import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("SimpleSwap", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let deployer: any;
  let user1: any;
  // let user2: any; // Eliminado porque no se usa

  const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens

  // Desplegamos TokenA y TokenB una sola vez para todos los tests.
  // Desplegaremos SimpleSwap para cada bloque 'describe' con 'beforeEach' para asegurar un estado aislado.
  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];
    // user2 = signers[2]; // Eliminado porque no se usa

    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenA.waitForDeployment();

    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenB.waitForDeployment();
  });

  // Función auxiliar para resetear los balances de los tokens para un contexto de test fresco
  async function resetTokenBalances() {
    // Mintear suministro inicial al deployer (y user1 si es necesario para tests específicos)
    // Esto asegura un estado limpio para los balances de tokens antes de cada bloque de tests que interactúa con ellos.
    // Nota: Esto minteará tokens *adicionales* cada vez que se llame.
    // Si quieres resetear estrictamente al estado inicial, podrías necesitar quemar los tokens existentes primero
    // o desplegar nuevos contratos de tokens. Para ahora, añadir más es generalmente aceptable para los tests.
    await tokenA.mint(deployer.address, initialSupply, { gasLimit: 6000000 });
    await tokenB.mint(deployer.address, initialSupply, { gasLimit: 6000000 });
    await tokenA.mint(user1.address, ethers.parseEther("1000"), { gasLimit: 6000000 });
    await tokenB.mint(user1.address, ethers.parseEther("1000"), { gasLimit: 6000000 });
  }

  // --- Tests de Despliegue ---
  describe("Deployment", function () {
    beforeEach(async function () {
      // Desplegar una nueva instancia de SimpleSwap para cada test de despliegue
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances(); // Asegurar balances de tokens frescos para este contexto de test
    });

    it("Should deploy TokenA and TokenB correctly", async function () {
      expect(await tokenA.totalSupply()).to.equal(initialSupply + ethers.parseEther("1000"));
      expect(await tokenB.totalSupply()).to.equal(initialSupply + ethers.parseEther("1000"));
      expect(await tokenA.balanceOf(deployer.address)).to.equal(initialSupply);
      expect(await tokenB.balanceOf(deployer.address)).to.equal(initialSupply);
    });

    it("Should deploy SimpleSwap correctly", async function () {
      const address = await simpleSwap.getAddress();
      expect(typeof address).to.equal("string");
      expect(address.length).to.be.greaterThan(0);
    });
  });

  // --- Tests de addLiquidity ---
  describe("addLiquidity", function () {
    const amountA = ethers.parseEther("100");
    const amountB = ethers.parseEther("100");

    beforeEach(async function () {
      // Desplegar una nueva instancia de SimpleSwap para cada test de addLiquidity
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances(); // Asegurar balances de tokens frescos para este contexto de test

      // Aprobar que SimpleSwap pueda gastar los tokens del deployer
      await tokenA.approve(await simpleSwap.getAddress(), amountA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), amountB, { gasLimit: 6000000 });
    });

    it("Should add initial liquidity and mint liquidity tokens", async function () {
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          amountA,
          amountB,
          deployer.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      )
        .to.emit(simpleSwap, "LiquidityAction")
        .withArgs(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          ethers.parseEther("100"), // sqrt(100*100) = 100
          true,
        );

      // Ahora simpleSwap._getPairHash debería ser una función válida
      const [contractPairHash] = await simpleSwap._getPairHash(await tokenA.getAddress(), await tokenB.getAddress());
      expect(await simpleSwap.liquidityBalances(contractPairHash, deployer.address)).to.equal(ethers.parseEther("100"));

      // Verificar reservas del pool
      const [reserveA, reserveB] = await simpleSwap.getReserves(await tokenA.getAddress(), await tokenB.getAddress());
      expect(reserveA).to.equal(amountA);
      expect(reserveB).to.equal(amountB);
    });

    it("Should add more liquidity proportionally", async function () {
      // Añadir liquidez inicial primero (ya se hace en el beforeEach, pero para este test, añadimos una segunda vez)
      const initialAmount = ethers.parseEther("100");
      await tokenA.approve(await simpleSwap.getAddress(), initialAmount, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), initialAmount, { gasLimit: 6000000 });
      const latestBlockInitial = await ethers.provider.getBlock("latest");
      const deadlineInitial = latestBlockInitial
        ? latestBlockInitial.timestamp + 3600
        : Math.floor(Date.now() / 1000) + 3600;
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        initialAmount,
        initialAmount,
        0n,
        0n, // Los montos mínimos pueden ser 0 para simplicidad en este test
        deployer.address,
        deadlineInitial,
        { gasLimit: 6000000 },
      );

      // Añadir más liquidez
      const moreAmountA = ethers.parseEther("50");
      const moreAmountB = ethers.parseEther("50");
      // Aprobar nuevamente para la liquidez adicional
      await tokenA.approve(await simpleSwap.getAddress(), moreAmountA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), moreAmountB, { gasLimit: 6000000 });
      const latestBlockMore = await ethers.provider.getBlock("latest");
      const deadlineMore = latestBlockMore ? latestBlockMore.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          moreAmountA,
          moreAmountB,
          0n,
          0n,
          deployer.address,
          deadlineMore,
          { gasLimit: 6000000 },
        ),
      )
        .to.emit(simpleSwap, "LiquidityAction")
        .withArgs(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          moreAmountA,
          moreAmountB,
          ethers.parseEther("50"), // Proporcional a la liquidez existente
          true,
        );

      const [contractPairHash] = await simpleSwap._getPairHash(await tokenA.getAddress(), await tokenB.getAddress());
      expect(await simpleSwap.liquidityBalances(contractPairHash, deployer.address)).to.equal(ethers.parseEther("150")); // 100 + 50
    });

    it("Should revert if deadline is exceeded", async function () {
      const expiredDeadline = (await ethers.provider.getBlock("latest"))!.timestamp - 1; // 1 segundo en el pasado
      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          0n,
          0n,
          deployer.address,
          expiredDeadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Expired deadline");
    });

    it("Should revert if insufficient amount provided", async function () {
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          amountA + 1n,
          amountB,
          deployer.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Insufficient amount provided");
    });
  });

  // --- Tests de removeLiquidity ---
  describe("removeLiquidity", function () {
    const initialAmount = ethers.parseEther("100");
    let contractPairHash: string;

    beforeEach(async function () {
      // Desplegar una nueva instancia de SimpleSwap para cada test de removeLiquidity
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances(); // Asegurar balances de tokens frescos para este contexto de test

      // Añadir liquidez inicial para poder removerla
      await tokenA.approve(await simpleSwap.getAddress(), initialAmount, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), initialAmount, { gasLimit: 6000000 });
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        initialAmount,
        initialAmount,
        0n,
        0n,
        deployer.address,
        deadline,
        { gasLimit: 6000000 },
      );
      // Ahora simpleSwap._getPairHash debería ser una función válida
      [contractPairHash] = await simpleSwap._getPairHash(await tokenA.getAddress(), await tokenB.getAddress());
    });

    it("Should remove liquidity and return tokens", async function () {
      const liquidityToRemove = ethers.parseEther("50");
      const deployerInitialTokenABalance = await tokenA.balanceOf(deployer.address);
      const deployerInitialTokenBBalance = await tokenB.balanceOf(deployer.address);

      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          liquidityToRemove,
          0n,
          0n, // Los montos mínimos pueden ser 0 para simplicidad en este test
          deployer.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      )
        .to.emit(simpleSwap, "LiquidityAction")
        .withArgs(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("50"), // 50% de las reservas iniciales
          ethers.parseEther("50"), // 50% de las reservas iniciales
          liquidityToRemove,
          false,
        );

      // Verificar balances de liquidez
      expect(await simpleSwap.liquidityBalances(contractPairHash, deployer.address)).to.equal(ethers.parseEther("50"));

      // Verificar que los tokens fueron devueltos
      expect(await tokenA.balanceOf(deployer.address)).to.equal(deployerInitialTokenABalance + ethers.parseEther("50"));
      expect(await tokenB.balanceOf(deployer.address)).to.equal(deployerInitialTokenBBalance + ethers.parseEther("50"));
    });

    it("Should revert if insufficient liquidity", async function () {
      const liquidityToRemove = ethers.parseEther("150"); // Más de lo que tiene el deployer
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          liquidityToRemove,
          0n,
          0n,
          deployer.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Insufficient liquidity");
    });

    it("Should revert if insufficient amount received", async function () {
      const liquidityToRemove = ethers.parseEther("50");
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      // Simular que se espera menos de lo que se recibirá
      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          liquidityToRemove,
          ethers.parseEther("51"), // Espera más de lo que se devolverá (50)
          ethers.parseEther("50"),
          deployer.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Insufficient amount received");
    });
  });

  // --- Tests de swapExactTokensForTokens ---
  describe("swapExactTokensForTokens", function () {
    const initialLiquidityA = ethers.parseEther("1000");
    const initialLiquidityB = ethers.parseEther("1000");

    beforeEach(async function () {
      // Desplegar una nueva instancia de SimpleSwap para cada test de swap
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances(); // Asegurar balances de tokens frescos para este contexto de test

      // Añadir liquidez inicial al pool
      await tokenA.approve(await simpleSwap.getAddress(), initialLiquidityA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), initialLiquidityB, { gasLimit: 6000000 });
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        initialLiquidityA,
        initialLiquidityB,
        0n,
        0n,
        deployer.address,
        deadline,
        { gasLimit: 6000000 },
      );

      // Aprobar que SimpleSwap pueda gastar los tokens de user1 para el swap
      await tokenA
        .connect(user1)
        .approve(await simpleSwap.getAddress(), ethers.parseEther("100"), { gasLimit: 6000000 });
      await tokenB
        .connect(user1)
        .approve(await simpleSwap.getAddress(), ethers.parseEther("100"), { gasLimit: 6000000 });
    });

    it("Should swap TokenA for TokenB", async function () {
      const amountIn = ethers.parseEther("10"); // Cantidad de TokenA a enviar

      // Calcular expectedAmountOut con la comisión del 0.3%, usando la lógica de división entera de Solidity
      // Calcular expectedAmountOut sin comisión, usando la fórmula del AMM constante
      // La fórmula del contrato para amountOut es (amountIn * reserveOut) / (reserveIn + amountIn)
      const numerator = amountIn * initialLiquidityB;
      const denominator = initialLiquidityA + amountIn;
      const expectedAmountOut = numerator / denominator;

      const user1InitialTokenABalance = await tokenA.balanceOf(user1.address);
      const user1InitialTokenBBalance = await tokenB.balanceOf(user1.address);
      const simpleSwapInitialTokenABalance = await tokenA.balanceOf(await simpleSwap.getAddress());
      const simpleSwapInitialTokenBBalance = await tokenB.balanceOf(await simpleSwap.getAddress());

      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          expectedAmountOut, // amountOutMin
          [await tokenA.getAddress(), await tokenB.getAddress()],
          user1.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      )
        .to.emit(simpleSwap, "Swap")
        .withArgs(await tokenA.getAddress(), await tokenB.getAddress(), amountIn, expectedAmountOut);

      // Verificar balances después del swap
      expect(await tokenA.balanceOf(user1.address)).to.equal(user1InitialTokenABalance - amountIn);
      expect(await tokenB.balanceOf(user1.address)).to.equal(user1InitialTokenBBalance + expectedAmountOut);
      expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(simpleSwapInitialTokenABalance + amountIn);
      expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(
        simpleSwapInitialTokenBBalance - expectedAmountOut,
      );
    });

    it("Should swap TokenB for TokenA", async function () {
      const amountIn = ethers.parseEther("10"); // Cantidad de TokenB a enviar

      // Calcular expectedAmountOut sin comisión para swap TokenB -> TokenA
      // La fórmula del contrato para amountOut es (amountIn * reserveOut) / (reserveIn + amountIn)
      const numerator = amountIn * initialLiquidityA;
      const denominator = initialLiquidityB + amountIn;
      const expectedAmountOut = numerator / denominator;

      const user1InitialTokenABalance = await tokenA.balanceOf(user1.address);
      const user1InitialTokenBBalance = await tokenB.balanceOf(user1.address);
      const simpleSwapInitialTokenABalance = await tokenA.balanceOf(await simpleSwap.getAddress());
      const simpleSwapInitialTokenBBalance = await tokenB.balanceOf(await simpleSwap.getAddress());

      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          expectedAmountOut, // amountOutMin
          [await tokenB.getAddress(), await tokenA.getAddress()], // Ruta invertida
          user1.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      )
        .to.emit(simpleSwap, "Swap")
        .withArgs(await tokenB.getAddress(), await tokenA.getAddress(), amountIn, expectedAmountOut);

      // Verificar balances después del swap
      expect(await tokenB.balanceOf(user1.address)).to.equal(user1InitialTokenBBalance - amountIn);
      expect(await tokenA.balanceOf(user1.address)).to.equal(user1InitialTokenABalance + expectedAmountOut);
      expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(simpleSwapInitialTokenBBalance + amountIn);
      expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(
        simpleSwapInitialTokenABalance - expectedAmountOut,
      );
    });

    it("Should revert if deadline is exceeded", async function () {
      const amountIn = ethers.parseEther("10");
      const expiredDeadline = (await ethers.provider.getBlock("latest"))!.timestamp - 1;
      await expect(
        simpleSwap
          .connect(user1)
          .swapExactTokensForTokens(
            amountIn,
            0n,
            [await tokenA.getAddress(), await tokenB.getAddress()],
            user1.address,
            expiredDeadline,
            { gasLimit: 6000000 },
          ),
      ).to.be.revertedWith("Expired deadline");
    });

    it("Should revert if invalid path length", async function () {
      const amountIn = ethers.parseEther("10");
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          0n,
          [await tokenA.getAddress()], // Ruta incorrecta
          user1.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Invalid path length");
    });

    it("Should revert if insufficient output amount", async function () {
      const amountIn = ethers.parseEther("10");
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          ethers.parseEther("100"), // amountOutMin demasiado alto
          [await tokenA.getAddress(), await tokenB.getAddress()],
          user1.address,
          deadline,
          { gasLimit: 6000000 },
        ),
      ).to.be.revertedWith("Insufficient output amount");
    });
  });

  // --- Tests de getPrice y getReserves ---
  describe("Read Functions", function () {
    const initialLiquidityA = ethers.parseEther("1000");
    const initialLiquidityB = ethers.parseEther("1000");

    beforeEach(async function () {
      // Desplegar una nueva instancia de SimpleSwap para cada test de Read Functions
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances(); // Asegurar balances de tokens frescos para este contexto de test

      // Añadir liquidez inicial al pool
      await tokenA.approve(await simpleSwap.getAddress(), initialLiquidityA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), initialLiquidityB, { gasLimit: 6000000 });
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        initialLiquidityA,
        initialLiquidityB,
        0n,
        0n,
        deployer.address,
        deadline,
        { gasLimit: 6000000 }
      );
    });

    it("Should return correct reserves", async function () {
      const [reserveA, reserveB] = await simpleSwap.getReserves(await tokenA.getAddress(), await tokenB.getAddress());
      expect(reserveA).to.equal(initialLiquidityA);
      expect(reserveB).to.equal(initialLiquidityB);
    });

    it("Should return correct price", async function () {
      // Precio esperado: reserveB / reserveA * 1e18
      // En este caso, 1000 / 1000 * 1e18 = 1e18
      const expectedPrice = (initialLiquidityB * ethers.parseEther("1")) / initialLiquidityA;
      const price = await simpleSwap.getPrice(await tokenA.getAddress(), await tokenB.getAddress());
      expect(price).to.equal(expectedPrice);
    });

    it("Should revert getPrice if reserveA is zero", async function () {
      // Para este test, necesitamos un escenario donde reserveA sea 0.
      // Desplegamos nuevos tokens y probamos con ellos sin liquidez previa
      const newTokenAFactory = await ethers.getContractFactory("TokenA");
      const newTokenA = await newTokenAFactory.deploy(deployer.address, { gasLimit: 6000000 });
      await newTokenA.waitForDeployment();

      const newTokenBFactory = await ethers.getContractFactory("TokenB");
      const newTokenB = await newTokenBFactory.deploy(deployer.address, { gasLimit: 6000000 });
      await newTokenB.waitForDeployment();

      await expect(simpleSwap.getPrice(await newTokenA.getAddress(), await newTokenB.getAddress())).to.be.revertedWith(
        "ReserveA is zero",
      );
    });

    it("Should calculate amount out correctly", async function () {
      const amountIn = ethers.parseEther("10");
      const reserveIn = ethers.parseEther("1000");
      const reserveOut = ethers.parseEther("1000");
      const expectedAmountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
      expect(await simpleSwap.getAmountOut(amountIn, reserveIn, reserveOut)).to.equal(expectedAmountOut);
    });

    it("Should revert getAmountOut if amountIn is zero", async function () {
      await expect(simpleSwap.getAmountOut(0n, ethers.parseEther("100"), ethers.parseEther("100"))).to.be.revertedWith(
        "AmountIn must be greater than zero",
      );
    });

    it("Should revert getAmountOut if reserveIn is zero", async function () {
      await expect(simpleSwap.getAmountOut(ethers.parseEther("10"), 0n, ethers.parseEther("100"))).to.be.revertedWith(
        "ReserveIn must be greater than zero",
      );
    });

    it("Should revert getAmountOut if reserveOut is zero", async function () {
      await expect(simpleSwap.getAmountOut(ethers.parseEther("10"), ethers.parseEther("100"), 0n)).to.be.revertedWith(
        "ReserveOut must be greater than zero",
      );
    });
  });
});
