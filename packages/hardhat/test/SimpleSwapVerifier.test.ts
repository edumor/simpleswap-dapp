import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB, SimpleSwapVerifier } from "../typechain-types";

describe("SimpleSwapVerifier", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let verifier: SimpleSwapVerifier;
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

    // Deploy SimpleSwap
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 6000000 });
    await simpleSwap.waitForDeployment();

    // Deploy Verifier
    const VerifierFactory = await ethers.getContractFactory("SimpleSwapVerifier");
    verifier = await VerifierFactory.deploy({ gasLimit: 6000000 });
    await verifier.waitForDeployment();

    // Mint tokens for testing
    await tokenA.mint(deployer.address, initialSupply, { gasLimit: 6000000 });
    await tokenB.mint(deployer.address, initialSupply, { gasLimit: 6000000 });
    
    // Transfer tokens to verifier for testing
    const testAmount = ethers.parseEther("10000");
    await tokenA.transfer(await verifier.getAddress(), testAmount, { gasLimit: 6000000 });
    await tokenB.transfer(await verifier.getAddress(), testAmount, { gasLimit: 6000000 });
  });

  describe("Deployment", function () {
    it("Should deploy SimpleSwapVerifier correctly", async function () {
      expect(await verifier.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should initialize with zero authors", async function () {
      expect(await verifier.getAuthorsCount()).to.equal(0);
    });
  });

  describe("verify function", function () {
    it("Should successfully verify SimpleSwap contract", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("100");
      const amountIn = ethers.parseEther("10");
      const author = "Eduardo Moreno";

      await expect(
        verifier.verify(
          await simpleSwap.getAddress(),
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          amountA,
          amountB,
          amountIn,
          author,
          { gasLimit: 8000000 }
        )
      ).to.emit(verifier, "VerificationCompleted")
        .withArgs(await simpleSwap.getAddress(), author, true);

      // Check author was added
      expect(await verifier.getAuthorsCount()).to.equal(1);
      expect(await verifier.authors(0)).to.equal(author);
      expect(await verifier.authorExists(author)).to.be.true;
    });

    it("Should revert with invalid liquidity amounts", async function () {
      await expect(
        verifier.verify(
          await simpleSwap.getAddress(),
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          0, // Invalid amountA
          ethers.parseEther("100"),
          ethers.parseEther("10"),
          "Test Author"
        )
      ).to.be.revertedWith("Invalid liquidity amounts");
    });

    it("Should revert with invalid swap amount", async function () {
      await expect(
        verifier.verify(
          await simpleSwap.getAddress(),
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100"),
          0, // Invalid amountIn
          "Test Author"
        )
      ).to.be.revertedWith("Invalid swap amount");
    });

    it("Should revert with insufficient token balance", async function () {
      // Deploy new verifier with no tokens
      const VerifierFactory = await ethers.getContractFactory("SimpleSwapVerifier");
      const newVerifier = await VerifierFactory.deploy({ gasLimit: 6000000 });
      
      await expect(
        newVerifier.verify(
          await simpleSwap.getAddress(),
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100"),
          ethers.parseEther("10"),
          "Test Author"
        )
      ).to.be.revertedWith("Insufficient token A");
    });

    it("Should not add duplicate authors", async function () {
      const author = "Duplicate Author";
      const amountA = ethers.parseEther("50");
      const amountB = ethers.parseEther("50");
      const amountIn = ethers.parseEther("5");

      // First verification
      await verifier.verify(
        await simpleSwap.getAddress(),
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        amountIn,
        author,
        { gasLimit: 8000000 }
      );

      const countBefore = await verifier.getAuthorsCount();
      
      // Second verification with same author
      await verifier.verify(
        await simpleSwap.getAddress(),
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        amountIn,
        author,
        { gasLimit: 8000000 }
      );

      // Count should not increase
      expect(await verifier.getAuthorsCount()).to.equal(countBefore);
    });
  });

  describe("depositTokens function", function () {
    it("Should allow depositing tokens", async function () {
      const depositAmount = ethers.parseEther("100");
      
      await tokenA.approve(await verifier.getAddress(), depositAmount);
      
      await expect(
        verifier.depositTokens(await tokenA.getAddress(), depositAmount)
      ).not.to.be.reverted;
    });

    it("Should revert on failed transfer", async function () {
      const depositAmount = ethers.parseEther("100");
      
      // Don't approve, should fail
      await expect(
        verifier.depositTokens(await tokenA.getAddress(), depositAmount)
      ).to.be.revertedWith("Transfer failed");
    });
  });

  describe("withdrawTokens function", function () {
    it("Should allow withdrawing tokens", async function () {
      const withdrawAmount = ethers.parseEther("50");
      
      await expect(
        verifier.withdrawTokens(await tokenA.getAddress(), withdrawAmount, deployer.address)
      ).not.to.be.reverted;
    });

    it("Should revert on failed withdrawal", async function () {
      const withdrawAmount = ethers.parseEther("999999"); // More than available
      
      await expect(
        verifier.withdrawTokens(await tokenA.getAddress(), withdrawAmount, deployer.address)
      ).to.be.revertedWith("Withdrawal failed");
    });
  });

  describe("getAuthorsCount function", function () {
    it("Should return correct authors count", async function () {
      const count = await verifier.getAuthorsCount();
      expect(count).to.be.a("bigint");
      expect(count).to.be.gte(0);
    });
  });
});
