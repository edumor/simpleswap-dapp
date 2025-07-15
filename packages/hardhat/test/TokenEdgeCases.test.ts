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
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenA.waitForDeployment();
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 6000000 });
    await tokenB.waitForDeployment();
  });
  it("Should revert mint if amount > 1 token and not owner (TokenA)", async function () {
    await expect(
      tokenA.connect(user1).mint(user1.address, ethers.parseEther("2"), { gasLimit: 6000000 }),
    ).to.be.revertedWith("Max faucet amount is 1 token");
  });
  it("Should revert mint if to != msg.sender and not owner (TokenA)", async function () {
    await expect(
      tokenA.connect(user1).mint(deployer.address, ethers.parseEther("1"), { gasLimit: 6000000 }),
    ).to.be.revertedWith("Can only mint to self");
  });
  it("Owner can mint any amount to any address (TokenA)", async function () {
    await expect(tokenA.connect(deployer).mint(user1.address, ethers.parseEther("100"), { gasLimit: 6000000 })).to.not
      .be.reverted;
  });
  it("Should revert mint if amount > 1 token and not owner (TokenB)", async function () {
    await expect(
      tokenB.connect(user1).mint(user1.address, ethers.parseEther("2"), { gasLimit: 6000000 }),
    ).to.be.revertedWith("Max faucet amount is 1 token");
  });
  it("Should revert mint if to != msg.sender and not owner (TokenB)", async function () {
    await expect(
      tokenB.connect(user1).mint(deployer.address, ethers.parseEther("1"), { gasLimit: 6000000 }),
    ).to.be.revertedWith("Can only mint to self");
  });
  it("Owner can mint any amount to any address (TokenB)", async function () {
    await expect(tokenB.connect(deployer).mint(user1.address, ethers.parseEther("100"), { gasLimit: 6000000 })).to.not
      .be.reverted;
  });
  it("Should pause and unpause TokenB", async function () {
    await expect(tokenB.connect(deployer).pause({ gasLimit: 6000000 })).to.not.be.reverted;
    await expect(tokenB.connect(deployer).unpause({ gasLimit: 6000000 })).to.not.be.reverted;
  });
});
