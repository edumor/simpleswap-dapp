import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("OptimizedCoverage", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy tokens with minimal gas
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(owner.address);
    await tokenA.waitForDeployment();

    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(owner.address);
    await tokenB.waitForDeployment();

    // Mint initial tokens to owner
    await tokenA.connect(owner).mint(owner.address, ethers.parseEther("1000"));
    await tokenB.connect(owner).mint(owner.address, ethers.parseEther("1000"));

    return { tokenA, tokenB, owner, user1, user2 };
  }

  describe("Token Coverage", function () {
    it("Should test basic TokenA functionality", async function () {
      const { tokenA, owner, user1 } = await loadFixture(deployFixture);
      
      // Test basic functions with minimal gas
      const initialBalance = await tokenA.balanceOf(owner.address);
      expect(initialBalance).to.be.gt(0);
      
      // Test name and symbol
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
    });

    it("Should test basic TokenB functionality", async function () {
      const { tokenB, owner } = await loadFixture(deployFixture);
      
      // Test basic functions
      const initialBalance = await tokenB.balanceOf(owner.address);
      expect(initialBalance).to.be.gt(0);
      
      // Test name and symbol
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
    });

    it("Should test TokenA transfer", async function () {
      const { tokenA, owner, user1 } = await loadFixture(deployFixture);
      
      const transferAmount = ethers.parseEther("10");
      await tokenA.connect(owner).transfer(user1.address, transferAmount);
      
      const balance = await tokenA.balanceOf(user1.address);
      expect(balance).to.equal(transferAmount);
    });

    it("Should test TokenB transfer", async function () {
      const { tokenB, owner, user1 } = await loadFixture(deployFixture);
      
      const transferAmount = ethers.parseEther("10");
      await tokenB.connect(owner).transfer(user1.address, transferAmount);
      
      const balance = await tokenB.balanceOf(user1.address);
      expect(balance).to.equal(transferAmount);
    });
  });

  describe("Minimal Contract Tests", function () {
    it("Should deploy all contracts successfully", async function () {
      const { tokenA, tokenB } = await loadFixture(deployFixture);
      
      expect(await tokenA.getAddress()).to.be.properAddress;
      expect(await tokenB.getAddress()).to.be.properAddress;
    });
  });
});
