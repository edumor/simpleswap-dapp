import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

describe("SimpleSwap Coverage Enhancement", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    // Deploy TokenA
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(owner.address);
    await tokenA.waitForDeployment();

    // Deploy TokenB
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(owner.address);
    await tokenB.waitForDeployment();

    // Deploy SimpleSwap
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwapFactory.deploy();
    await simpleSwap.waitForDeployment();

    // Mint tokens
    await tokenA.mint(owner.address, INITIAL_SUPPLY);
    await tokenB.mint(owner.address, INITIAL_SUPPLY);
    await tokenA.mint(user1.address, INITIAL_SUPPLY);
    await tokenB.mint(user1.address, INITIAL_SUPPLY);
  });

  describe("estimateSwapGas function", function () {
    it("Should estimate gas for valid swap", async function () {
      // Add liquidity first
      await tokenA.approve(simpleSwap.getAddress(), ethers.parseEther("100"));
      await tokenB.approve(simpleSwap.getAddress(), ethers.parseEther("200"));
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        0,
        0,
        owner.address,
        deadline
      );

      // Test estimateSwapGas
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const gasEstimate = await simpleSwap.estimateSwapGas(
        ethers.parseEther("1"),
        path
      );

      expect(gasEstimate).to.equal(85000);
    });

    it("Should revert estimateSwapGas with invalid path length", async function () {
      const invalidPath = [await tokenA.getAddress()]; // Only one token

      await expect(
        simpleSwap.estimateSwapGas(ethers.parseEther("1"), invalidPath)
      ).to.be.revertedWith("bad path");
    });

    it("Should revert estimateSwapGas with no liquidity", async function () {
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      await expect(
        simpleSwap.estimateSwapGas(ethers.parseEther("1"), path)
      ).to.be.revertedWith("no liquidity");
    });

    it("Should revert estimateSwapGas with zero output", async function () {
      // Add minimal liquidity
      await tokenA.approve(simpleSwap.getAddress(), 1);
      await tokenB.approve(simpleSwap.getAddress(), 1);
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1,
        1,
        0,
        0,
        owner.address,
        deadline
      );

      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      // Try to swap 0 tokens (should result in zero output)
      await expect(
        simpleSwap.estimateSwapGas(0, path)
      ).to.be.revertedWith("zero amt");
    });
  });

  describe("Admin Functions Coverage", function () {
    it("Should pause contract successfully", async function () {
      await expect(simpleSwap.pause())
        .to.emit(simpleSwap, "Paused")
        .withArgs(owner.address);

      expect(await simpleSwap.paused()).to.be.true;
    });

    it("Should unpause contract successfully", async function () {
      await simpleSwap.pause();
      
      await expect(simpleSwap.unpause())
        .to.emit(simpleSwap, "Unpaused")
        .withArgs(owner.address);

      expect(await simpleSwap.paused()).to.be.false;
    });

    it("Should transfer ownership successfully", async function () {
      await expect(simpleSwap.transferOwnership(user1.address))
        .to.emit(simpleSwap, "OwnershipTransferred")
        .withArgs(owner.address, user1.address);

      expect(await simpleSwap.owner()).to.equal(user1.address);
    });

    it("Should revert transfer ownership to zero address", async function () {
      await expect(
        simpleSwap.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("zero addr");
    });

    it("Should revert non-owner pause", async function () {
      await expect(
        simpleSwap.connect(user1).pause()
      ).to.be.revertedWith("not owner");
    });

    it("Should revert non-owner unpause", async function () {
      await simpleSwap.pause();
      
      await expect(
        simpleSwap.connect(user1).unpause()
      ).to.be.revertedWith("not owner");
    });

    it("Should revert non-owner transferOwnership", async function () {
      await expect(
        simpleSwap.connect(user1).transferOwnership(user1.address)
      ).to.be.revertedWith("not owner");
    });
  });

  describe("Paused Operations", function () {
    beforeEach(async function () {
      await simpleSwap.pause();
    });

    it("Should revert addLiquidity when paused", async function () {
      await tokenA.approve(simpleSwap.getAddress(), ethers.parseEther("100"));
      await tokenB.approve(simpleSwap.getAddress(), ethers.parseEther("100"));
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100"),
          0,
          0,
          owner.address,
          deadline
        )
      ).to.be.revertedWith("paused");
    });

    it("Should revert removeLiquidity when paused", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          100,
          0,
          0,
          owner.address,
          deadline
        )
      ).to.be.revertedWith("paused");
    });

    it("Should revert swapExactTokensForTokens when paused", async function () {
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        simpleSwap.swapExactTokensForTokens(
          ethers.parseEther("1"),
          0,
          path,
          owner.address,
          deadline
        )
      ).to.be.revertedWith("paused");
    });
  });

  describe("Edge Cases for Coverage", function () {
    it("Should handle getPrice with zero reserveB", async function () {
      // This tests a specific branch in getPrice
      await expect(
        simpleSwap.getPrice(
          await tokenA.getAddress(),
          await tokenB.getAddress()
        )
      ).to.be.revertedWith("no reserves");
    });

    it("Should handle calculateMinOutputWithSlippage edge cases", async function () {
      // Add liquidity first
      await tokenA.approve(simpleSwap.getAddress(), ethers.parseEther("100"));
      await tokenB.approve(simpleSwap.getAddress(), ethers.parseEther("200"));
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        0,
        0,
        owner.address,
        deadline
      );

      const path = [await tokenA.getAddress(), await tokenB.getAddress()];

      // Test with maximum allowed slippage (50%)
      const minOutput = await simpleSwap.calculateMinOutputWithSlippage(
        ethers.parseEther("1"),
        path,
        5000 // 50%
      );

      expect(minOutput).to.be.gt(0);

      // Test revert with excessive slippage
      await expect(
        simpleSwap.calculateMinOutputWithSlippage(
          ethers.parseEther("1"),
          path,
          5001 // 50.01%
        )
      ).to.be.revertedWith("max 50% slip");
    });

    it("Should test _sqrt function with different values", async function () {
      // Add very small liquidity to trigger different _sqrt branches
      await tokenA.approve(simpleSwap.getAddress(), 10);
      await tokenB.approve(simpleSwap.getAddress(), 10);
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      // This should trigger different branches in _sqrt
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        1,
        1,
        0,
        0,
        owner.address,
        deadline
      );

      const [reserveA, reserveB] = await simpleSwap.getReserves(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );

      expect(reserveA).to.equal(1);
      expect(reserveB).to.equal(1);
    });
  });
});
