import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenA & TokenB Isolated Coverage", function () {
  
  describe("TokenA Coverage", function () {
    it("Should deploy TokenA contract", async function () {
      const [owner] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
      expect(await tokenA.decimals()).to.equal(18);
      expect(await tokenA.owner()).to.equal(owner.address);
    });

    it("Should mint via faucet", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenA.connect(user1).faucet();
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should allow owner to mint any amount", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenA.connect(owner).mint(user1.address, ethers.parseEther("5000"));
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("5000"));
    });

    it("Should restrict non-owner minting", async function () {
      const [owner, user1, user2] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      // Non-owner can only mint max 1 token for themselves
      await tokenA.connect(user1).mint(user1.address, ethers.parseEther("1"));
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("1"));
      
      // Should revert if trying to mint more than 1 token
      await expect(
        tokenA.connect(user1).mint(user1.address, ethers.parseEther("2"))
      ).to.be.revertedWith("max 1 token");
      
      // Should revert if trying to mint for someone else
      await expect(
        tokenA.connect(user1).mint(user2.address, ethers.parseEther("1"))
      ).to.be.revertedWith("self only");
    });

    it("Should allow burning tokens", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenA.connect(user1).faucet();
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
      
      await tokenA.connect(user1).burn(ethers.parseEther("500"));
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("500"));
    });
  });

  describe("TokenB Coverage", function () {
    it("Should deploy TokenB contract", async function () {
      const [owner] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
      expect(await tokenB.decimals()).to.equal(18);
      expect(await tokenB.owner()).to.equal(owner.address);
      expect(await tokenB.paused()).to.equal(false);
    });

    it("Should mint via faucet", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenB.connect(user1).faucet();
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should pause and unpause", async function () {
      const [owner] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      // Should start unpaused
      expect(await tokenB.paused()).to.equal(false);
      
      // Owner can pause
      await tokenB.connect(owner).pause();
      expect(await tokenB.paused()).to.equal(true);
      
      // Owner can unpause
      await tokenB.connect(owner).unpause();
      expect(await tokenB.paused()).to.equal(false);
    });

    it("Should restrict pausing to owner only", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      // Non-owner should not be able to pause
      await expect(
        tokenB.connect(user1).pause()
      ).to.be.reverted;
    });

    it("Should prevent transfers when paused", async function () {
      const [owner, user1, user2] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      // Mint some tokens
      await tokenB.connect(user1).faucet();
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
      
      // Pause the contract
      await tokenB.connect(owner).pause();
      
      // Transfers should be reverted when paused
      await expect(
        tokenB.connect(user1).transfer(user2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(tokenB, "EnforcedPause");
    });

    it("Should allow minting any amount by owner", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenB.connect(owner).mint(user1.address, ethers.parseEther("5000"));
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("5000"));
    });

    it("Should allow burning tokens", async function () {
      const [owner, user1] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      await tokenB.connect(user1).faucet();
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
      
      await tokenB.connect(user1).burn(ethers.parseEther("500"));
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("500"));
    });
  });

});
