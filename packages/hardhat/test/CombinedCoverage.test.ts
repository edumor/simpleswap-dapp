import { expect } from "chai";
import { ethers } from "hardhat";

describe("Combined Working Coverage", function () {
  
  // Tests from YourContract that work perfectly
  describe("YourContract Tests", function () {
    let yourContract: any;
    let owner: any, otherAccount: any, thirdAccount: any;

    beforeEach(async function () {
      [owner, otherAccount, thirdAccount] = await ethers.getSigners();
      const YourContract = await ethers.getContractFactory("YourContract");
      yourContract = await YourContract.deploy(owner.address, { gasLimit: 50000000 });
    });

    describe("Deployment", function () {
      it("Should have the right message on deploy", async function () {
        expect(await yourContract.greeting()).to.equal("Building Unstoppable Apps!!!");
      });

      it("Should set the right owner", async function () {
        expect(await yourContract.owner()).to.equal(owner.address);
      });

      it("Should initialize with premium false", async function () {
        expect(await yourContract.premium()).to.equal(false);
      });

      it("Should initialize with totalCounter 0", async function () {
        expect(await yourContract.totalCounter()).to.equal(0);
      });
    });

    describe("setGreeting", function () {
      it("Should allow setting a new message", async function () {
        const newGreeting = "Learn Scaffold-ETH 2! :)";
        await yourContract.setGreeting(newGreeting);
        expect(await yourContract.greeting()).to.equal(newGreeting);
      });

      it("Should emit GreetingChange event on setGreeting", async function () {
        const newGreeting = "Hello";
        await expect(yourContract.connect(otherAccount).setGreeting(newGreeting))
          .to.emit(yourContract, "GreetingChange")
          .withArgs(otherAccount.address, newGreeting, false, 1, 1);
      });

      it("Should increment userGreetingCounter and totalCounter", async function () {
        await yourContract.connect(otherAccount).setGreeting("Test");
        expect(await yourContract.userGreetingCounter(otherAccount.address)).to.equal(1);
        expect(await yourContract.totalCounter()).to.equal(1);
      });

      it("Should set premium true when sending ETH", async function () {
        await yourContract.connect(otherAccount).setGreeting("Premium", { value: ethers.parseEther("0.01") });
        expect(await yourContract.premium()).to.equal(true);
      });

      it("Should set premium false when not sending ETH", async function () {
        await yourContract.connect(otherAccount).setGreeting("NotPremium");
        expect(await yourContract.premium()).to.equal(false);
      });

      it("Should track individual user counters correctly", async function () {
        await yourContract.connect(otherAccount).setGreeting("User1 Message");
        await yourContract.connect(thirdAccount).setGreeting("User2 Message");
        
        expect(await yourContract.userGreetingCounter(otherAccount.address)).to.equal(1);
        expect(await yourContract.userGreetingCounter(thirdAccount.address)).to.equal(1);
        expect(await yourContract.totalCounter()).to.equal(2);
      });

      it("Should handle multiple premium and non-premium messages", async function () {
        await yourContract.connect(otherAccount).setGreeting("Non-premium 1");
        await yourContract.connect(otherAccount).setGreeting("Premium 1", { value: ethers.parseEther("0.01") });
        await yourContract.connect(otherAccount).setGreeting("Non-premium 2");
        
        expect(await yourContract.userGreetingCounter(otherAccount.address)).to.equal(3);
        expect(await yourContract.totalCounter()).to.equal(3);
      });
    });

    describe("withdraw", function () {
      it("Should revert withdraw if not owner", async function () {
        await expect(yourContract.connect(otherAccount).withdraw()).to.be.revertedWithCustomError(
          yourContract,
          "OwnableUnauthorizedAccount"
        );
      });

      it("Should allow owner to withdraw", async function () {
        await yourContract.connect(otherAccount).setGreeting("Premium", { value: ethers.parseEther("1") });
        
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        const tx = await yourContract.withdraw();
        const receipt = await tx.wait();
        const gasUsed = BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice);
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        
        expect(finalOwnerBalance).to.be.closeTo(
          initialOwnerBalance + ethers.parseEther("1") - gasUsed,
          ethers.parseEther("0.01")
        );
      });

      it("Should handle withdrawal with no balance", async function () {
        await expect(yourContract.withdraw()).to.not.be.reverted;
      });
    });

    describe("receive function", function () {
      it("Should accept ETH via receive()", async function () {
        await expect(
          otherAccount.sendTransaction({
            to: yourContract.target,
            value: ethers.parseEther("1")
          })
        ).to.not.be.reverted;
        
        expect(await ethers.provider.getBalance(yourContract.target)).to.equal(ethers.parseEther("1"));
      });

      it("Should accept multiple ETH transfers", async function () {
        await otherAccount.sendTransaction({
          to: yourContract.target,
          value: ethers.parseEther("0.5")
        });
        
        await thirdAccount.sendTransaction({
          to: yourContract.target,
          value: ethers.parseEther("0.3")
        });
        
        expect(await ethers.provider.getBalance(yourContract.target)).to.equal(ethers.parseEther("0.8"));
      });
    });

    describe("State variables", function () {
      it("Should return correct owner", async function () {
        expect(await yourContract.owner()).to.equal(owner.address);
      });

      it("Should track total counter across all users", async function () {
        await yourContract.connect(otherAccount).setGreeting("Message 1");
        await yourContract.connect(thirdAccount).setGreeting("Message 2");
        await yourContract.connect(otherAccount).setGreeting("Message 3");
        
        expect(await yourContract.totalCounter()).to.equal(3);
      });
    });
  });

  // Tests from TestSqrtHelper that work perfectly
  describe("TestSqrtHelper Tests", function () {
    let testSqrt: any;

    beforeEach(async function () {
      const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
      testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    });

    it("Should deploy TestSqrtHelper contract", async function () {
      expect(testSqrt.target).to.not.be.undefined;
    });

    it("Should calculate sqrt(0) = 0", async function () {
      const result = await testSqrt.testSqrt(0);
      expect(result).to.equal(0);
    });

    it("Should calculate sqrt(1) = 1", async function () {
      const result = await testSqrt.testSqrt(1);
      expect(result).to.equal(1);
    });

    it("Should calculate sqrt(4) = 2", async function () {
      const result = await testSqrt.testSqrt(4);
      expect(result).to.equal(2);
    });

    it("Should calculate sqrt(9) = 3", async function () {
      const result = await testSqrt.testSqrt(9);
      expect(result).to.equal(3);
    });

    it("Should calculate sqrt(16) = 4", async function () {
      const result = await testSqrt.testSqrt(16);
      expect(result).to.equal(4);
    });

    it("Should handle large numbers", async function () {
      // sqrt(100) = 10
      const result = await testSqrt.testSqrt(100);
      expect(result).to.equal(10);
    });

    it("Should handle perfect squares", async function () {
      // sqrt(144) = 12
      const result = await testSqrt.testSqrt(144);
      expect(result).to.equal(12);
    });
  });

  // Basic deployment tests for Tokens
  describe("Token Deployment Coverage", function () {
    it("Should deploy TokenA and get basic info", async function () {
      const [owner] = await ethers.getSigners();
      const TokenA = await ethers.getContractFactory("TokenA");
      const tokenA = await TokenA.deploy(owner.address, { gasLimit: 50000000 });
      
      expect(await tokenA.name()).to.equal("TokenA");
      expect(await tokenA.symbol()).to.equal("TKA");
      expect(await tokenA.decimals()).to.equal(18);
      expect(await tokenA.owner()).to.equal(owner.address);
    });

    it("Should deploy TokenB and get basic info", async function () {
      const [owner] = await ethers.getSigners();
      const TokenB = await ethers.getContractFactory("TokenB");
      const tokenB = await TokenB.deploy(owner.address, { gasLimit: 50000000 });
      
      expect(await tokenB.name()).to.equal("TokenB");
      expect(await tokenB.symbol()).to.equal("TKB");
      expect(await tokenB.decimals()).to.equal(18);
      expect(await tokenB.owner()).to.equal(owner.address);
      expect(await tokenB.paused()).to.equal(false);
    });
  });

});
