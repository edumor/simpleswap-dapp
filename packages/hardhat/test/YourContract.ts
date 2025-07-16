import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  let yourContract: YourContract;
  let deployer: any;
  let user1: any;
  let user2: any;

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];
    user2 = signers[2];

    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(deployer.address, { gasLimit: 6000000 })) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await yourContract.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should set the right owner", async function () {
      expect(await yourContract.owner()).to.equal(deployer.address);
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
      await yourContract.setGreeting(newGreeting, { gasLimit: 6000000 });
      expect(await yourContract.greeting()).to.equal(newGreeting);
    });

    it("Should emit GreetingChange event on setGreeting", async function () {
      await expect(yourContract.connect(user1).setGreeting("Hello", { gasLimit: 6000000 }))
        .to.emit(yourContract, "GreetingChange")
        .withArgs(user1.address, "Hello", false, 0);
    });

    it("Should increment userGreetingCounter and totalCounter", async function () {
      const beforeUser = await yourContract.userGreetingCounter(user1.address);
      const beforeTotal = await yourContract.totalCounter();

      await yourContract.connect(user1).setGreeting("Test", { gasLimit: 6000000 });

      const afterUser = await yourContract.userGreetingCounter(user1.address);
      const afterTotal = await yourContract.totalCounter();

      expect(afterUser - beforeUser).to.equal(1);
      expect(afterTotal - beforeTotal).to.equal(1);
    });

    it("Should set premium true when sending ETH", async function () {
      const ethValue = ethers.parseEther("0.01");

      await expect(
        yourContract.connect(user1).setGreeting("Premium", {
          value: ethValue,
          gasLimit: 6000000,
        }),
      )
        .to.emit(yourContract, "GreetingChange")
        .withArgs(user1.address, "Premium", true, ethValue);

      expect(await yourContract.premium()).to.equal(true);
    });

    it("Should set premium false when not sending ETH", async function () {
      await yourContract.connect(user1).setGreeting("NotPremium", { gasLimit: 6000000 });
      expect(await yourContract.premium()).to.equal(false);
    });

    it("Should track individual user counters correctly", async function () {
      // Reset state by getting current values
      const user1CounterBefore = await yourContract.userGreetingCounter(user1.address);
      const user2CounterBefore = await yourContract.userGreetingCounter(user2.address);

      // User1 sets greeting
      await yourContract.connect(user1).setGreeting("User1 Message", { gasLimit: 6000000 });

      // User2 sets greeting
      await yourContract.connect(user2).setGreeting("User2 Message", { gasLimit: 6000000 });

      // Check individual counters
      expect(await yourContract.userGreetingCounter(user1.address)).to.equal(user1CounterBefore + 1n);
      expect(await yourContract.userGreetingCounter(user2.address)).to.equal(user2CounterBefore + 1n);
    });

    it("Should handle multiple premium and non-premium messages", async function () {
      // Non-premium message
      await yourContract.connect(user1).setGreeting("Non-premium 1", { gasLimit: 6000000 });
      expect(await yourContract.premium()).to.equal(false);

      // Premium message
      await yourContract.connect(user1).setGreeting("Premium 1", {
        value: ethers.parseEther("0.005"),
        gasLimit: 6000000,
      });
      expect(await yourContract.premium()).to.equal(true);

      // Non-premium message again
      await yourContract.connect(user1).setGreeting("Non-premium 2", { gasLimit: 6000000 });
      expect(await yourContract.premium()).to.equal(false);
    });
  });

  describe("withdraw", function () {
    beforeEach(async function () {
      // Send some ETH to contract for testing
      await user1.sendTransaction({
        to: await yourContract.getAddress(),
        value: ethers.parseEther("0.01"),
        gasLimit: 6000000,
      });
    });

    it("Should revert withdraw if not owner", async function () {
      await expect(yourContract.connect(user1).withdraw({ gasLimit: 6000000 })).to.be.revertedWith("Not the Owner");
    });

    it("Should allow owner to withdraw", async function () {
      const contractBalance = await ethers.provider.getBalance(await yourContract.getAddress());
      expect(contractBalance).to.be.gt(0);

      const beforeBalance = await ethers.provider.getBalance(deployer.address);

      const tx = await yourContract.connect(deployer).withdraw({ gasLimit: 6000000 });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const afterBalance = await ethers.provider.getBalance(deployer.address);

      // Account for gas costs in the calculation
      expect(afterBalance + gasUsed).to.be.approximately(beforeBalance + contractBalance, ethers.parseEther("0.001"));

      // Contract should have 0 balance after withdrawal
      expect(await ethers.provider.getBalance(await yourContract.getAddress())).to.equal(0);
    });

    it("Should handle withdrawal with no balance", async function () {
      // First withdraw all funds
      await yourContract.connect(deployer).withdraw({ gasLimit: 6000000 });

      // Should still work even with 0 balance
      await expect(yourContract.connect(deployer).withdraw({ gasLimit: 6000000 })).to.not.be.reverted;
    });
  });

  describe("receive function", function () {
    it("Should accept ETH via receive()", async function () {
      const contractAddress = await yourContract.getAddress();
      const balanceBefore = await ethers.provider.getBalance(contractAddress);
      const ethAmount = ethers.parseEther("0.005");

      const tx = await user1.sendTransaction({
        to: contractAddress,
        value: ethAmount,
        gasLimit: 6000000,
      });
      await tx.wait();

      const balanceAfter = await ethers.provider.getBalance(contractAddress);
      expect(balanceAfter - balanceBefore).to.equal(ethAmount);
    });

    it("Should accept multiple ETH transfers", async function () {
      const contractAddress = await yourContract.getAddress();
      const initialBalance = await ethers.provider.getBalance(contractAddress);

      // Send ETH multiple times
      await user1.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("0.001"),
        gasLimit: 6000000,
      });

      await user2.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("0.002"),
        gasLimit: 6000000,
      });

      const finalBalance = await ethers.provider.getBalance(contractAddress);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("0.003"));
    });
  });

  describe("State variables", function () {
    it("Should return correct owner", async function () {
      expect(await yourContract.owner()).to.equal(deployer.address);
    });

    it("Should track total counter across all users", async function () {
      const totalBefore = await yourContract.totalCounter();

      await yourContract.connect(user1).setGreeting("Message 1", { gasLimit: 6000000 });
      await yourContract.connect(user2).setGreeting("Message 2", { gasLimit: 6000000 });
      await yourContract.connect(user1).setGreeting("Message 3", { gasLimit: 6000000 });

      const totalAfter = await yourContract.totalCounter();
      expect(totalAfter - totalBefore).to.equal(3);
    });
  });
});
