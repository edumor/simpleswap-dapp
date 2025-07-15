import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  let deployer: any;
  let user1: any;
  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];
  });
  it("Should emit GreetingChange event on setGreeting", async function () {
    await expect(yourContract.connect(user1).setGreeting("Hello")).to.emit(yourContract, "GreetingChange");
  });

  it("Should increment userGreetingCounter and totalCounter", async function () {
    const beforeUser = await yourContract.userGreetingCounter(user1.address);
    const beforeTotal = await yourContract.totalCounter();
    await yourContract.connect(user1).setGreeting("Test");
    const afterUser = await yourContract.userGreetingCounter(user1.address);
    const afterTotal = await yourContract.totalCounter();
    expect(afterUser - beforeUser).to.equal(1);
    expect(afterTotal - beforeTotal).to.equal(1);
  });

  it("Should set premium true when sending ETH", async function () {
    await yourContract.connect(user1).setGreeting("Premium", { value: ethers.parseEther("0.01") });
    expect(await yourContract.premium()).to.equal(true);
  });

  it("Should set premium false when not sending ETH", async function () {
    await yourContract.connect(user1).setGreeting("NotPremium");
    expect(await yourContract.premium()).to.equal(false);
  });

  it("Should revert withdraw if not owner", async function () {
    await expect(yourContract.connect(user1).withdraw()).to.be.revertedWith("Not the Owner");
  });

  it("Should allow owner to withdraw", async function () {
    // Send ETH to contract
    await user1.sendTransaction({ to: yourContract.getAddress(), value: ethers.parseEther("0.01") });
    const before = await ethers.provider.getBalance(deployer.address);
    await yourContract.connect(deployer).withdraw();
    const after = await ethers.provider.getBalance(deployer.address);
    expect(after).to.be.gt(before);
  });

  it("Should accept ETH via receive()", async function () {
    const tx = await user1.sendTransaction({ to: yourContract.getAddress(), value: ethers.parseEther("0.005") });
    await tx.wait();
    // No revert means receive() worked
    expect(await ethers.provider.getBalance(yourContract.getAddress())).to.be.gte(ethers.parseEther("0.005"));
  });
  // We define a fixture to reuse the same setup in every test.

  let yourContract: YourContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(owner.address, { gasLimit: 6000000 })) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await yourContract.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should allow setting a new message", async function () {
      const newGreeting = "Learn Scaffold-ETH 2! :)";

      await yourContract.setGreeting(newGreeting, { gasLimit: 6000000 });
      expect(await yourContract.greeting()).to.equal(newGreeting);
    });
  });
});
