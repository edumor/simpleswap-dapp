import { expect } from "chai";
import { ethers } from "hardhat";
import type { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("SimpleSwap Struct Debug", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    // Deploy TokenA and TokenB
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(owner.address);

    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(owner.address);

    // Deploy SimpleSwap
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwapFactory.deploy();

    // Mint tokens for testing
    await tokenA.connect(owner).mint(owner.address, ethers.parseEther("1000"));
    await tokenB.connect(owner).mint(owner.address, ethers.parseEther("1000"));

    // Approve SimpleSwap to spend tokens
    await tokenA.connect(owner).approve(simpleSwap.getAddress(), ethers.parseEther("1000"));
    await tokenB.connect(owner).approve(simpleSwap.getAddress(), ethers.parseEther("1000"));
  });

  it("Should debug addLiquidity struct call", async function () {
    console.log("Testing struct-based addLiquidity...");
    
    const params = {
      tokenA: await tokenA.getAddress(),
      tokenB: await tokenB.getAddress(),
      amountADesired: ethers.parseEther("10"),
      amountBDesired: ethers.parseEther("20"),
      amountAMin: ethers.parseEther("9"),
      amountBMin: ethers.parseEther("18"),
      to: owner.address,
      deadline: Math.floor(Date.now() / 1000) + 3600
    };

    try {
      await simpleSwap.connect(owner)["addLiquidity((address,address,uint256,uint256,uint256,uint256,address,uint256))"](params);
      console.log("Struct-based addLiquidity succeeded!");
    } catch (error) {
      console.log("Struct-based addLiquidity failed:", error);
    }
  });

  it("Should debug legacy addLiquidity call", async function () {
    console.log("Testing legacy addLiquidity...");
    
    try {
      await simpleSwap.connect(owner)["addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"](
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("10"),
        ethers.parseEther("20"),
        ethers.parseEther("9"),
        ethers.parseEther("18"),
        owner.address,
        Math.floor(Date.now() / 1000) + 3600
      );
      console.log("Legacy addLiquidity succeeded!");
    } catch (error) {
      console.log("Legacy addLiquidity failed:", error);
    }
  });
});
