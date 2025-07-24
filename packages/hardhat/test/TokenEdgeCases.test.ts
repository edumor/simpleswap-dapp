import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenA, TokenB } from "../typechain-types";

describe("TokenA & TokenB edge cases", function () {
  let tokenA: TokenA;
  let tokenB: TokenB;
  let deployer: any;
  let user1: any;

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];

    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenA.waitForDeployment();

    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenB.waitForDeployment();
  });

  // TokenA Tests
  describe("TokenA", function () {
    it("Should mint 1000 tokens to msg.sender using faucet (TokenA)", async function () {
      const before = await tokenA.balanceOf(user1.address);
      await tokenA.connect(user1).faucet();
      const after = await tokenA.balanceOf(user1.address);
      expect(after - before).to.equal(ethers.parseEther("1000"));
    });

    it("Should allow minting 0 tokens (TokenA)", async function () {
      await expect(tokenA.connect(user1).mint(user1.address, 0)).to.not.be.reverted;
    });

    it("Should burn tokens (TokenA)", async function () {
      await tokenA.connect(user1).faucet();
      const before = await tokenA.balanceOf(user1.address);
      await tokenA.connect(user1).burn(ethers.parseEther("100"));
      const after = await tokenA.balanceOf(user1.address);
      expect(before - after).to.equal(ethers.parseEther("100"));
    });

    it("Should emit Transfer event on mint (TokenA)", async function () {
      await expect(tokenA.connect(user1).mint(user1.address, 1)).to.emit(tokenA, "Transfer");
    });

    it("Should emit Transfer event on burn (TokenA)", async function () {
      await tokenA.connect(user1).faucet();
      await expect(tokenA.connect(user1).burn(1)).to.emit(tokenA, "Transfer");
    });

    it("Should revert mint if amount > 1 token and not owner (TokenA)", async function () {
      await expect(
        tokenA.connect(user1).mint(user1.address, ethers.parseEther("2")),
      ).to.be.revertedWith("max 1 token");
    });

    it("Should revert mint if to != msg.sender and not owner (TokenA)", async function () {
      await expect(
        tokenA.connect(user1).mint(deployer.address, ethers.parseEther("1")),
      ).to.be.revertedWith("self only");
    });

    it("Owner can mint any amount to any address (TokenA)", async function () {
      await expect(tokenA.connect(deployer).mint(user1.address, ethers.parseEther("100"))).to.not
        .be.reverted;
    });
  });

  // TokenB Tests
  describe("TokenB", function () {
    it("Should mint 1000 tokens to msg.sender using faucet (TokenB)", async function () {
      const before = await tokenB.balanceOf(user1.address);
      await tokenB.connect(user1).faucet();
      const after = await tokenB.balanceOf(user1.address);
      expect(after - before).to.equal(ethers.parseEther("1000"));
    });

    it("Should allow minting 0 tokens (TokenB)", async function () {
      await expect(tokenB.connect(user1).mint(user1.address, 0)).to.not.be.reverted;
    });

    it("Should burn tokens (TokenB)", async function () {
      await tokenB.connect(user1).faucet();
      const before = await tokenB.balanceOf(user1.address);
      await tokenB.connect(user1).burn(ethers.parseEther("100"));
      const after = await tokenB.balanceOf(user1.address);
      expect(before - after).to.equal(ethers.parseEther("100"));
    });

    it("Should emit Transfer event on mint (TokenB)", async function () {
      await expect(tokenB.connect(user1).mint(user1.address, 1)).to.emit(tokenB, "Transfer");
    });

    it("Should emit Transfer event on burn (TokenB)", async function () {
      await tokenB.connect(user1).faucet();
      await expect(tokenB.connect(user1).burn(1)).to.emit(tokenB, "Transfer");
    });

    it("Should revert mint if amount > 1 token and not owner (TokenB)", async function () {
      await expect(
        tokenB.connect(user1).mint(user1.address, ethers.parseEther("2")),
      ).to.be.revertedWith("max 1 token");
    });

    it("Should revert mint if to != msg.sender and not owner (TokenB)", async function () {
      await expect(
        tokenB.connect(user1).mint(deployer.address, ethers.parseEther("1")),
      ).to.be.revertedWith("self only");
    });

    it("Owner can mint any amount to any address (TokenB)", async function () {
      await expect(tokenB.connect(deployer).mint(user1.address, ethers.parseEther("100"))).to.not
        .be.reverted;
    });

    it("Should pause and unpause TokenB", async function () {
      await expect(tokenB.connect(deployer).pause()).to.not.be.reverted;
      await expect(tokenB.connect(deployer).unpause()).to.not.be.reverted;
    });

    it("Should emit Paused and Unpaused events (TokenB)", async function () {
      await expect(tokenB.connect(deployer).pause()).to.emit(tokenB, "Paused");
      await expect(tokenB.connect(deployer).unpause()).to.emit(tokenB, "Unpaused");
    });

    it("Should revert transfer when paused (TokenB)", async function () {
      // First mint some tokens to user1
      await tokenB.connect(user1).faucet();

      // Pause the contract
      await tokenB.connect(deployer).pause();

      // Try to transfer and expect it to be reverted
      await expect(
        tokenB.connect(user1).transfer(deployer.address, 1),
      ).to.be.revertedWithCustomError(tokenB, "EnforcedPause");

      // Unpause for subsequent tests
      await tokenB.connect(deployer).unpause();
    });

    it("Should allow transfers when not paused (TokenB)", async function () {
      // Ensure contract is not paused
      if (await tokenB.paused()) {
        await tokenB.connect(deployer).unpause();
      }

      // Mint some tokens to user1
      await tokenB.connect(user1).faucet();

      // Should be able to transfer
      await expect(tokenB.connect(user1).transfer(deployer.address, ethers.parseEther("1"))).to
        .not.be.reverted;
    });

    it("Should not allow non-owner to pause (TokenB)", async function () {
      await expect(tokenB.connect(user1).pause()).to.be.revertedWithCustomError(
        tokenB,
        "OwnableUnauthorizedAccount",
      );
    });

    it("Should not allow non-owner to unpause (TokenB)", async function () {
      // First pause as owner
      await tokenB.connect(deployer).pause();

      // Try to unpause as non-owner
      await expect(tokenB.connect(user1).unpause()).to.be.revertedWithCustomError(
        tokenB,
        "OwnableUnauthorizedAccount",
      );

      // Unpause as owner for subsequent tests
      await tokenB.connect(deployer).unpause();
    });
  });
});
