import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Coverage Optimized Tests", function () {
  async function deployTokensFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(owner.address);

    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(owner.address);

    return { tokenA, tokenB, owner, addr1, addr2 };
  }

  async function deploySimpleSwapFixture() {
    const { tokenA, tokenB, owner, addr1, addr2 } = await deployTokensFixture();
    
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await SimpleSwap.deploy();

    return { tokenA, tokenB, simpleSwap, owner, addr1, addr2 };
  }

  describe("TokenA Coverage", function () {
    it("Should deploy and have correct initial values", async function () {
      const { tokenA, owner } = await loadFixture(deployTokensFixture);
      
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
      expect(await tokenA.decimals()).to.equal(18);
      expect(await tokenA.owner()).to.equal(owner.address);
    });

    it("Should mint tokens via faucet", async function () {
      const { tokenA, addr1 } = await loadFixture(deployTokensFixture);
      
      await tokenA.connect(addr1).faucet();
      expect(await tokenA.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Owner should mint to any address", async function () {
      const { tokenA, owner, addr1 } = await loadFixture(deployTokensFixture);
      
      await tokenA.connect(owner).mint(addr1.address, ethers.parseEther("500"));
      expect(await tokenA.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
    });
  });

  describe("TokenB Coverage", function () {
    it("Should deploy and have correct initial values", async function () {
      const { tokenB, owner } = await loadFixture(deployTokensFixture);
      
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
      expect(await tokenB.decimals()).to.equal(18);
      expect(await tokenB.owner()).to.equal(owner.address);
      expect(await tokenB.paused()).to.equal(false);
    });

    it("Should mint tokens via faucet", async function () {
      const { tokenB, addr1 } = await loadFixture(deployTokensFixture);
      
      await tokenB.connect(addr1).faucet();
      expect(await tokenB.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should pause and unpause", async function () {
      const { tokenB, owner } = await loadFixture(deployTokensFixture);
      
      await tokenB.connect(owner).pause();
      expect(await tokenB.paused()).to.equal(true);
      
      await tokenB.connect(owner).unpause();
      expect(await tokenB.paused()).to.equal(false);
    });
  });

  describe("SimpleSwap Basic Coverage", function () {
    it("Should deploy correctly", async function () {
      const { simpleSwap, owner } = await loadFixture(deploySimpleSwapFixture);
      
      expect(await simpleSwap.owner()).to.equal(owner.address);
      expect(await simpleSwap.paused()).to.equal(false);
    });

    it("Should get initial reserves (should be zero)", async function () {
      const { simpleSwap, tokenA, tokenB } = await loadFixture(deploySimpleSwapFixture);
      
      const [reserveA, reserveB] = await simpleSwap.getReserves(tokenA.target, tokenB.target);
      expect(reserveA).to.equal(0);
      expect(reserveB).to.equal(0);
    });

    it("Should return total liquidity (should be zero initially)", async function () {
      const { simpleSwap, tokenA, tokenB } = await loadFixture(deploySimpleSwapFixture);
      
      const totalLiquidity = await simpleSwap.getTotalLiquidity(tokenA.target, tokenB.target);
      expect(totalLiquidity).to.equal(0);
    });
  });

  describe("TestSqrtHelper Coverage", function () {
    it("Should deploy and test sqrt function", async function () {
      const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
      const testSqrt = await TestSqrtHelper.deploy();
      
      // Test sqrt(0) = 0
      expect(await testSqrt.testSqrt(0)).to.equal(0);
      // Test sqrt(1) = 1  
      expect(await testSqrt.testSqrt(1)).to.equal(1);
      // Test sqrt(4) = 2
      expect(await testSqrt.testSqrt(4)).to.equal(2);
    });
  });
});
