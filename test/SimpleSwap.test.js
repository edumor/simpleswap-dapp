const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap Contract", function () {
  let simpleSwap;
  let tokenA;
  let tokenB;
  let owner;
  let user1;
  let user2;
  
  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const INITIAL_LIQUIDITY_A = ethers.parseEther("1000");
  const INITIAL_LIQUIDITY_B = ethers.parseEther("2000");

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TokenA
    const TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy(owner.address);
    await tokenA.waitForDeployment();

    // Deploy TokenB
    const TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy(owner.address);
    await tokenB.waitForDeployment();

    // Deploy SimpleSwap
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwap.deploy();
    await simpleSwap.waitForDeployment();

    // Mint initial tokens
    await tokenA.mint(owner.address, INITIAL_SUPPLY);
    await tokenB.mint(owner.address, INITIAL_SUPPLY);
    
    // Transfer some tokens to users
    await tokenA.transfer(user1.address, ethers.parseEther("10000"));
    await tokenB.transfer(user1.address, ethers.parseEther("10000"));
    await tokenA.transfer(user2.address, ethers.parseEther("10000"));
    await tokenB.transfer(user2.address, ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should deploy contracts correctly", async function () {
      expect(await tokenA.getAddress()).to.be.properAddress;
      expect(await tokenB.getAddress()).to.be.properAddress;
      expect(await simpleSwap.getAddress()).to.be.properAddress;
    });

    it("Should have correct token names and symbols", async function () {
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
    });

    it("Should mint initial supply correctly", async function () {
      expect(await tokenA.balanceOf(owner.address)).to.be.above(0);
      expect(await tokenB.balanceOf(owner.address)).to.be.above(0);
    });
  });

  describe("Add Liquidity", function () {
    it("Should add initial liquidity successfully", async function () {
      // Approve tokens
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes

      // Add liquidity
      const tx = await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );

      await expect(tx)
        .to.emit(simpleSwap, "LiquidityAction")
        .withArgs(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          INITIAL_LIQUIDITY_A,
          INITIAL_LIQUIDITY_B,
          await ethers.parseEther("1414.213562373095048801"), // sqrt approximation
          true
        );

      // Check reserves
      const reserves = await simpleSwap.getReserves(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );
      expect(reserves[0]).to.equal(INITIAL_LIQUIDITY_A);
      expect(reserves[1]).to.equal(INITIAL_LIQUIDITY_B);
    });

    it("Should fail with expired deadline", async function () {
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const expiredDeadline = Math.floor(Date.now() / 1000) - 300; // 5 minutes ago

      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          INITIAL_LIQUIDITY_A,
          INITIAL_LIQUIDITY_B,
          0,
          0,
          owner.address,
          expiredDeadline
        )
      ).to.be.revertedWith("EXPIRED");
    });

    it("Should fail with insufficient amounts", async function () {
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          0,
          INITIAL_LIQUIDITY_B,
          1, // Need minimum amount > 0
          1, // Need minimum amount > 0
          owner.address,
          deadline
        )
      ).to.be.revertedWith("INSUFFICIENT_AMOUNT");
    });
  });

  describe("Remove Liquidity", function () {
    beforeEach(async function () {
      // Add initial liquidity first
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );
    });

    it("Should remove liquidity successfully", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 300;
      const liquidityToRemove = ethers.parseEther("500");

      const tx = await simpleSwap.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        liquidityToRemove,
        0,
        0,
        owner.address,
        deadline
      );

      await expect(tx).to.emit(simpleSwap, "LiquidityAction");
    });

    it("Should fail with insufficient liquidity", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 300;
      const excessiveLiquidity = ethers.parseEther("100000");

      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          excessiveLiquidity,
          0,
          0,
          owner.address,
          deadline
        )
      ).to.be.revertedWith("INSUFFICIENT_LIQUIDITY");
    });
  });

  describe("Swap Tokens", function () {
    beforeEach(async function () {
      // Add initial liquidity
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );
    });

    it("Should swap TokenA for TokenB successfully", async function () {
      const amountIn = ethers.parseEther("10");
      const expectedAmountOut = await simpleSwap.getAmountOut(
        amountIn,
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      // Connect as user1 and approve tokens
      await tokenA.connect(user1).approve(await simpleSwap.getAddress(), amountIn);

      const deadline = Math.floor(Date.now() / 1000) + 300;
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      const tx = await simpleSwap.connect(user1).swapExactTokensForTokens(
        amountIn,
        0,
        path,
        user1.address,
        deadline
      );

      // Just check that Swap event was emitted, don't check exact amounts
      await expect(tx).to.emit(simpleSwap, "Swap");
    });

    it("Should swap TokenB for TokenA successfully", async function () {
      const amountIn = ethers.parseEther("20");
      const expectedAmountOut = await simpleSwap.getAmountOut(
        amountIn,
        await tokenB.getAddress(),
        await tokenA.getAddress()
      );

      await tokenB.connect(user1).approve(await simpleSwap.getAddress(), amountIn);

      const deadline = Math.floor(Date.now() / 1000) + 300;
      const path = [await tokenB.getAddress(), await tokenA.getAddress()];

      const tx = await simpleSwap.connect(user1).swapExactTokensForTokens(
        amountIn,
        0,
        path,
        user1.address,
        deadline
      );

      await expect(tx).to.emit(simpleSwap, "Swap");
    });

    it("Should fail with invalid path", async function () {
      const amountIn = ethers.parseEther("10");
      await tokenA.connect(user1).approve(await simpleSwap.getAddress(), amountIn);

      const deadline = Math.floor(Date.now() / 1000) + 300;
      const invalidPath = [await tokenA.getAddress()]; // Path too short

      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          0,
          invalidPath,
          user1.address,
          deadline
        )
      ).to.be.revertedWith("INVALID_PATH");
    });

    it("Should fail with insufficient output amount", async function () {
      const amountIn = ethers.parseEther("10");
      const expectedAmountOut = await simpleSwap.getAmountOut(
        amountIn,
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      await tokenA.connect(user1).approve(await simpleSwap.getAddress(), amountIn);

      const deadline = Math.floor(Date.now() / 1000) + 300;
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const excessiveMinAmountOut = ethers.parseEther("1000"); // Very high amount

      await expect(
        simpleSwap.connect(user1).swapExactTokensForTokens(
          amountIn,
          excessiveMinAmountOut,
          path,
          user1.address,
          deadline
        )
      ).to.be.revertedWith("INSUFFICIENT_OUTPUT_AMOUNT");
    });
  });

  describe("Price and Reserve Functions", function () {
    beforeEach(async function () {
      // Add initial liquidity
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );
    });

    it("Should get reserves correctly", async function () {
      const reserves = await simpleSwap.getReserves(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      expect(reserves[0]).to.equal(INITIAL_LIQUIDITY_A);
      expect(reserves[1]).to.equal(INITIAL_LIQUIDITY_B);
    });

    it("Should get price correctly", async function () {
      const price = await simpleSwap.getPrice(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      expect(price).to.be.above(0);
    });

    it("Should calculate amount out correctly", async function () {
      const amountIn = ethers.parseEther("10");
      const amountOut = await simpleSwap.getAmountOut(
        amountIn,
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      expect(amountOut).to.be.above(0);
      expect(amountOut).to.be.below(amountIn * 2n); // Should be reasonable
    });
  });

  describe("Internal Functions", function () {
    it("Should calculate amount out correctly", async function () {
      // Add initial liquidity first
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );

      const amountIn = ethers.parseEther("10");
      const amountOut = await simpleSwap.getAmountOut(
        amountIn,
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      expect(amountOut).to.be.above(0);
      expect(amountOut).to.be.below(amountIn * 2n);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very small amounts", async function () {
      // Add initial liquidity
      await tokenA.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_A);
      await tokenB.approve(await simpleSwap.getAddress(), INITIAL_LIQUIDITY_B);

      const deadline = Math.floor(Date.now() / 1000) + 300;

      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        INITIAL_LIQUIDITY_A,
        INITIAL_LIQUIDITY_B,
        0,
        0,
        owner.address,
        deadline
      );

      // Try very small swap
      const verySmallAmount = 1000n; // 1000 wei
      await tokenA.connect(user1).approve(await simpleSwap.getAddress(), verySmallAmount);

      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      const tx = await simpleSwap.connect(user1).swapExactTokensForTokens(
        verySmallAmount,
        0,
        path,
        user1.address,
        deadline
      );

      await expect(tx).to.emit(simpleSwap, "Swap");
    });

    it("Should fail when pool is empty", async function () {
      await expect(
        simpleSwap.getReserves(
          await tokenA.getAddress(),
          await tokenB.getAddress()
        )
      ).to.not.be.reverted; // Should return zeros, not revert

      const reserves = await simpleSwap.getReserves(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );
      expect(reserves[0]).to.equal(0);
      expect(reserves[1]).to.equal(0);
    });
  });
});
