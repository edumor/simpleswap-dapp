const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contracts", function () {
  let tokenA;
  let tokenB;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TokenA
    const TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy(owner.address);
    await tokenA.waitForDeployment();

    // Deploy TokenB
    const TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy(owner.address);
    await tokenB.waitForDeployment();
  });

  describe("TokenA", function () {
    it("Should have correct initial properties", async function () {
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
      expect(await tokenA.decimals()).to.equal(18);
      expect(await tokenA.owner()).to.equal(owner.address);
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(tokenA.mint(user1.address, mintAmount))
        .to.emit(tokenA, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount);

      expect(await tokenA.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await tokenA.totalSupply()).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        tokenA.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWithCustomError(tokenA, "OwnableUnauthorizedAccount");
    });

    it("Should allow token burning", async function () {
      const mintAmount = ethers.parseEther("1000");
      const burnAmount = ethers.parseEther("500");
      
      // First mint tokens to user1
      await tokenA.mint(user1.address, mintAmount);
      
      // User1 burns their tokens
      await expect(tokenA.connect(user1).burn(burnAmount))
        .to.emit(tokenA, "Transfer")
        .withArgs(user1.address, ethers.ZeroAddress, burnAmount);

      expect(await tokenA.balanceOf(user1.address)).to.equal(mintAmount - burnAmount);
      expect(await tokenA.totalSupply()).to.equal(mintAmount - burnAmount);
    });

    it("Should allow standard ERC20 transfers", async function () {
      const mintAmount = ethers.parseEther("1000");
      const transferAmount = ethers.parseEther("250");
      
      await tokenA.mint(user1.address, mintAmount);
      
      await expect(tokenA.connect(user1).transfer(user2.address, transferAmount))
        .to.emit(tokenA, "Transfer")
        .withArgs(user1.address, user2.address, transferAmount);

      expect(await tokenA.balanceOf(user1.address)).to.equal(mintAmount - transferAmount);
      expect(await tokenA.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Should handle approvals correctly", async function () {
      const mintAmount = ethers.parseEther("1000");
      const approveAmount = ethers.parseEther("500");
      
      await tokenA.mint(user1.address, mintAmount);
      
      await expect(tokenA.connect(user1).approve(user2.address, approveAmount))
        .to.emit(tokenA, "Approval")
        .withArgs(user1.address, user2.address, approveAmount);

      expect(await tokenA.allowance(user1.address, user2.address)).to.equal(approveAmount);
    });
  });

  describe("TokenB", function () {
    it("Should have correct initial properties", async function () {
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
      expect(await tokenB.decimals()).to.equal(18);
      expect(await tokenB.owner()).to.equal(owner.address);
      expect(await tokenB.paused()).to.equal(false);
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("2000");
      
      await expect(tokenB.mint(user1.address, mintAmount))
        .to.emit(tokenB, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount);

      expect(await tokenB.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint using custom error", async function () {
      const mintAmount = ethers.parseEther("2000");
      
      await expect(
        tokenB.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWithCustomError(tokenB, "NotOwner");
    });

    it("Should allow owner to pause and unpause", async function () {
      // Pause the contract
      await expect(tokenB.pause())
        .to.emit(tokenB, "Paused")
        .withArgs(owner.address);

      expect(await tokenB.paused()).to.equal(true);

      // Unpause the contract
      await expect(tokenB.unpause())
        .to.emit(tokenB, "Unpaused")
        .withArgs(owner.address);

      expect(await tokenB.paused()).to.equal(false);
    });

    it("Should not allow transfers when paused", async function () {
      const mintAmount = ethers.parseEther("1000");
      await tokenB.mint(user1.address, mintAmount);

      // Pause the contract
      await tokenB.pause();

      // Try to transfer - should fail
      await expect(
        tokenB.connect(user1).transfer(user2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(tokenB, "IsPaused");
    });

    it("Should allow transfers when not paused", async function () {
      const mintAmount = ethers.parseEther("1000");
      const transferAmount = ethers.parseEther("300");
      
      await tokenB.mint(user1.address, mintAmount);
      
      await expect(tokenB.connect(user1).transfer(user2.address, transferAmount))
        .to.emit(tokenB, "Transfer")
        .withArgs(user1.address, user2.address, transferAmount);

      expect(await tokenB.balanceOf(user1.address)).to.equal(mintAmount - transferAmount);
      expect(await tokenB.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Should not allow minting when paused", async function () {
      await tokenB.pause();
      
      await expect(
        tokenB.mint(user1.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(tokenB, "IsPaused");
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        tokenB.connect(user1).pause()
      ).to.be.revertedWithCustomError(tokenB, "NotOwner");
    });

    it("Should not allow burning when paused", async function () {
      const mintAmount = ethers.parseEther("1000");
      const burnAmount = ethers.parseEther("200");
      
      // First mint and then pause
      await tokenB.mint(user1.address, mintAmount);
      await tokenB.pause();
      
      // Burning should also fail when paused (due to _update override)
      await expect(tokenB.connect(user1).burn(burnAmount))
        .to.be.revertedWithCustomError(tokenB, "IsPaused");
    });
  });

  describe("Cross-token interactions", function () {
    it("Should allow complex multi-token operations", async function () {
      const amount = ethers.parseEther("1000");
      
      // Mint tokens to users
      await tokenA.mint(user1.address, amount);
      await tokenB.mint(user2.address, amount);
      
      // Set up approvals for cross-transfers
      await tokenA.connect(user1).approve(user2.address, amount);
      await tokenB.connect(user2).approve(user1.address, amount);
      
      // Execute transfers
      await tokenA.connect(user2).transferFrom(user1.address, user2.address, ethers.parseEther("500"));
      await tokenB.connect(user1).transferFrom(user2.address, user1.address, ethers.parseEther("600"));
      
      // Verify final balances
      expect(await tokenA.balanceOf(user1.address)).to.equal(ethers.parseEther("500"));
      expect(await tokenA.balanceOf(user2.address)).to.equal(ethers.parseEther("500"));
      expect(await tokenB.balanceOf(user1.address)).to.equal(ethers.parseEther("600"));
      expect(await tokenB.balanceOf(user2.address)).to.equal(ethers.parseEther("400"));
    });
  });
});
