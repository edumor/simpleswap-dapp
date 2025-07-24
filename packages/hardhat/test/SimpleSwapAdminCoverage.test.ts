import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("SimpleSwap Admin Functions Coverage", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let owner: any;
  let user1: any;
  let user2: any;

  const initialSupply = ethers.parseEther("1000000");

  before(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];

    // Deploy tokens
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    
    tokenA = await TokenAFactory.deploy(owner.address, { gasLimit: 5000000 });
    await tokenA.waitForDeployment();
    
    tokenB = await TokenBFactory.deploy(owner.address, { gasLimit: 5000000 });
    await tokenB.waitForDeployment();
  });

  beforeEach(async function () {
    // Deploy fresh SimpleSwap for each test
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwapFactory.deploy();
    await simpleSwap.waitForDeployment();

    // Mint tokens to owner
    await tokenA.mint(owner.address, initialSupply);
    await tokenB.mint(owner.address, initialSupply);
    
    // Approve tokens
    await tokenA.approve(await simpleSwap.getAddress(), initialSupply);
    await tokenB.approve(await simpleSwap.getAddress(), initialSupply);
  });

  describe("transferOwnership function", function () {
    it("Should successfully transfer ownership", async function () {
      const currentOwner = await simpleSwap.owner();
      expect(currentOwner).to.equal(owner.address);

      // Transfer ownership to user1
      await expect(simpleSwap.transferOwnership(user1.address))
        .to.emit(simpleSwap, "OwnershipTransferred")
        .withArgs(owner.address, user1.address);

      // Verify ownership transferred
      const newOwner = await simpleSwap.owner();
      expect(newOwner).to.equal(user1.address);
    });

    it("Should revert when transferring to zero address", async function () {
      await expect(
        simpleSwap.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("zero addr");
    });

    it("Should revert when transferring to same owner", async function () {
      const currentOwner = await simpleSwap.owner();
      
      await expect(
        simpleSwap.transferOwnership(currentOwner)
      ).to.be.revertedWith("same owner");
    });

    it("Should revert when non-owner tries to transfer", async function () {
      await expect(
        simpleSwap.connect(user1).transferOwnership(user2.address)
      ).to.be.revertedWith("not owner");
    });
  });

  describe("pause/unpause functions", function () {
    it("Should successfully pause and unpause", async function () {
      // Initially not paused
      expect(await simpleSwap.paused()).to.equal(false);

      // Pause the contract
      await expect(simpleSwap.pause())
        .to.emit(simpleSwap, "Paused")
        .withArgs(owner.address);

      expect(await simpleSwap.paused()).to.equal(true);

      // Unpause the contract
      await expect(simpleSwap.unpause())
        .to.emit(simpleSwap, "Unpaused")
        .withArgs(owner.address);

      expect(await simpleSwap.paused()).to.equal(false);
    });

    it("Should revert pause when already paused", async function () {
      await simpleSwap.pause();
      
      await expect(simpleSwap.pause())
        .to.be.revertedWith("already paused");
    });

    it("Should revert unpause when not paused", async function () {
      await expect(simpleSwap.unpause())
        .to.be.revertedWith("not paused");
    });

    it("Should revert when non-owner tries to pause", async function () {
      await expect(
        simpleSwap.connect(user1).pause()
      ).to.be.revertedWith("not owner");
    });

    it("Should revert when non-owner tries to unpause", async function () {
      await simpleSwap.pause(); // Pause first
      
      await expect(
        simpleSwap.connect(user1).unpause()
      ).to.be.revertedWith("not owner");
    });
  });

  describe("paused operations", function () {
    beforeEach(async function () {
      // Add some liquidity first
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("100"),
        ethers.parseEther("90"),
        ethers.parseEther("90"),
        owner.address,
        deadline,
        
      );

      // Now pause the contract
      await simpleSwap.pause();
    });

    it("Should revert addLiquidity when paused", async function () {
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await expect(
        simpleSwap.addLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("10"),
          ethers.parseEther("10"),
          ethers.parseEther("9"),
          ethers.parseEther("9"),
          owner.address,
          deadline,
          
        )
      ).to.be.revertedWith("paused");
    });

    it("Should revert swapExactTokensForTokens when paused", async function () {
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      
      await expect(
        simpleSwap.swapExactTokensForTokens(
          ethers.parseEther("1"),
          ethers.parseEther("0.5"),
          path,
          owner.address,
          deadline,
          
        )
      ).to.be.revertedWith("paused");
    });

    it("Should revert removeLiquidity when paused", async function () {
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await expect(
        simpleSwap.removeLiquidity(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("10"),
          ethers.parseEther("9"),
          ethers.parseEther("9"),
          owner.address,
          deadline,
          
        )
      ).to.be.revertedWith("paused");
    });
  });
});
