import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("SimpleSwap Additional Tests", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let deployer: any;
  let user1: any;

  const initialSupply = ethers.parseEther("1000000");

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];

    // Deploy tokens
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenA.waitForDeployment();

    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenB.waitForDeployment();
  });

  async function resetTokenBalances() {
    const balance = await tokenA.balanceOf(deployer.address);
    if (balance < initialSupply) {
      await tokenA.mint(deployer.address, initialSupply - balance, { gasLimit: 6000000 });
    }
    const balanceB = await tokenB.balanceOf(deployer.address);
    if (balanceB < initialSupply) {
      await tokenB.mint(deployer.address, initialSupply - balanceB, { gasLimit: 6000000 });
    }

    // Transfer tokens to user1 for testing
    await tokenA.transfer(user1.address, ethers.parseEther("10000"), { gasLimit: 6000000 });
    await tokenB.transfer(user1.address, ethers.parseEther("10000"), { gasLimit: 6000000 });
  }

  describe("calculateMinOutputWithSlippage", function () {
    const initialLiquidityA = ethers.parseEther("1000");
    const initialLiquidityB = ethers.parseEther("1000");

    beforeEach(async function () {
      // Deploy fresh SimpleSwap for each test
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances();

      // Add initial liquidity
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
    });

    it("Should calculate minimum output with slippage correctly", async function () {
      const amountIn = ethers.parseEther("10");
      const slippageBps = 100; // 1%
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      const minOutput = await simpleSwap.calculateMinOutputWithSlippage(amountIn, path, slippageBps);
      
      // Verify result is positive
      expect(minOutput).to.be.gt(0);
      
      // Verify it's less than output without slippage
      const fullOutput = await simpleSwap.getAmountOut(amountIn, initialLiquidityA, initialLiquidityB);
      expect(minOutput).to.be.lt(fullOutput);
    });

    it("Should revert with invalid path length", async function () {
      const amountIn = ethers.parseEther("10");
      const slippageBps = 100;
      const invalidPath = [await tokenA.getAddress()]; // Only one token

      await expect(
        simpleSwap.calculateMinOutputWithSlippage(amountIn, invalidPath, slippageBps)
      ).to.be.revertedWith("bad len");
    });

    it("Should revert with high slippage", async function () {
      const amountIn = ethers.parseEther("10");
      const highSlippage = 5001; // > 50%
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      await expect(
        simpleSwap.calculateMinOutputWithSlippage(amountIn, path, highSlippage)
      ).to.be.revertedWith("hi slip");
    });

    it("Should handle maximum allowed slippage", async function () {
      const amountIn = ethers.parseEther("10");
      const maxSlippage = 5000; // Exactly 50%
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      await expect(
        simpleSwap.calculateMinOutputWithSlippage(amountIn, path, maxSlippage)
      ).not.to.be.reverted;
    });

    it("Should handle zero slippage", async function () {
      const amountIn = ethers.parseEther("10");
      const zeroSlippage = 0;
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      const minOutput = await simpleSwap.calculateMinOutputWithSlippage(amountIn, path, zeroSlippage);
      const fullOutput = await simpleSwap.getAmountOut(amountIn, initialLiquidityA, initialLiquidityB);
      
      // With 0% slippage, should equal full output
      expect(minOutput).to.equal(fullOutput);
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
    });

    it("Should pause and unpause contract", async function () {
      // Verify not paused initially
      expect(await simpleSwap.paused()).to.be.false;

      // Pause
      await expect(simpleSwap.pause())
        .to.emit(simpleSwap, "Paused")
        .withArgs(deployer.address);
      
      expect(await simpleSwap.paused()).to.be.true;

      // Unpause
      await expect(simpleSwap.unpause())
        .to.emit(simpleSwap, "Unpaused")
        .withArgs(deployer.address);
        
      expect(await simpleSwap.paused()).to.be.false;
    });

    it("Should revert paused operations", async function () {
      // Pause contract
      await simpleSwap.pause();

      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      // Try to add liquidity while paused
      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100"),
          0n,
          0n,
          deployer.address,
          deadline
        )
      ).to.be.revertedWith("paused");
    });

    it("Should transfer ownership", async function () {
      await expect(simpleSwap.transferOwnership(user1.address))
        .to.emit(simpleSwap, "OwnershipTransferred")
        .withArgs(deployer.address, user1.address);
        
      expect(await simpleSwap.owner()).to.equal(user1.address);
    });

    it("Should revert transfer to zero address", async function () {
      await expect(
        simpleSwap.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("zero");
    });

    it("Should revert non-owner operations", async function () {
      await expect(
        simpleSwap.connect(user1).pause()
      ).to.be.revertedWith("not owner");

      await expect(
        simpleSwap.connect(user1).transferOwnership(user1.address)
      ).to.be.revertedWith("not owner");
    });
  });

  describe("Edge Cases", function () {
    beforeEach(async function () {
      const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
      simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
      await simpleSwap.waitForDeployment();
      await resetTokenBalances();
    });

    it("Should handle _min function correctly", async function () {
      // Test internal _min function through addLiquidity proportional calculation
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200"); // Different ratio
      
      await tokenA.approve(await simpleSwap.getAddress(), amountA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), amountB, { gasLimit: 6000000 });
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      // First liquidity addition
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        0n,
        0n,
        deployer.address,
        deadline,
        { gasLimit: 6000000 }
      );

      // Add more liquidity with different proportions to trigger _min logic
      const moreAmountA = ethers.parseEther("50");
      const moreAmountB = ethers.parseEther("150");
      
      await tokenA.approve(await simpleSwap.getAddress(), moreAmountA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), moreAmountB, { gasLimit: 6000000 });
      
      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          moreAmountA,
          moreAmountB,
          0n,
          0n,
          deployer.address,
          deadline + 1,
          { gasLimit: 6000000 }
        )
      ).not.to.be.reverted;
    });

    it("Should handle sqrt calculation in first liquidity provision", async function () {
      const amountA = ethers.parseEther("64"); // Perfect square
      const amountB = ethers.parseEther("36"); // Perfect square
      
      await tokenA.approve(await simpleSwap.getAddress(), amountA, { gasLimit: 6000000 });
      await tokenB.approve(await simpleSwap.getAddress(), amountB, { gasLimit: 6000000 });
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const result = await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        0n,
        0n,
        deployer.address,
        deadline,
        { gasLimit: 6000000 }
      );

      // Check that liquidity was calculated correctly (sqrt(64*36) = sqrt(2304) = 48)
      await expect(result)
        .to.emit(simpleSwap, "LiquidityAction")
        .withArgs(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          ethers.parseEther("48"), // Expected liquidity tokens
          true
        );
    });
  });
});
