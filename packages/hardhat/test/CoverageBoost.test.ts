import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleSwap, TokenA, TokenB } from "../typechain-types";

describe("SimpleSwap Coverage Boost", function () {
  let simpleSwap: SimpleSwap;
  let tokenA: TokenA;
  let tokenB: TokenB;
  let deployer: any;
  let user1: any;

  const initialSupply = ethers.parseEther("1000000");

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];

    // Deploy tokens
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenA.waitForDeployment();
    
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenB.waitForDeployment();
  });

  beforeEach(async function () {
    // Deploy SimpleSwap
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 5000000 });
    await simpleSwap.waitForDeployment();

    // Mint initial tokens
    await tokenA.mint(deployer.address, initialSupply);
    await tokenB.mint(deployer.address, initialSupply);
    
    // Approve tokens
    await tokenA.approve(await simpleSwap.getAddress(), initialSupply);
    await tokenB.approve(await simpleSwap.getAddress(), initialSupply);
  });

  describe("estimateSwapGas function", function () {
    it("Should estimate gas correctly for valid swap path", async function () {
      // Add initial liquidity
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("100"),
        ethers.parseEther("90"),
        ethers.parseEther("90"),
        deployer.address,
        deadline
      );

      // Test estimateSwapGas with valid path
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const amountIn = ethers.parseEther("1");
      
      const gasEstimate = await simpleSwap.estimateSwapGas(amountIn, path);
      expect(gasEstimate).to.be.gt(0);
    });

    it("Should revert with invalid path length", async function () {
      const path = [await tokenA.getAddress()]; // Invalid path length
      const amountIn = ethers.parseEther("1");
      
      await expect(
        simpleSwap.estimateSwapGas(amountIn, path)
      ).to.be.revertedWith("bad path");
    });

    it("Should revert with zero amount input", async function () {
      // Add liquidity first to avoid "no liquidity" error
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("100"),
        ethers.parseEther("90"),
        ethers.parseEther("90"),
        deployer.address,
        deadline
      );
      
      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const amountIn = 0;
      
      await expect(
        simpleSwap.estimateSwapGas(amountIn, path)
      ).to.be.revertedWith("zero amt");
    });
  });

  describe("calculateMinOutputWithSlippage edge cases", function () {
    it("Should handle edge case calculations", async function () {
      // Add liquidity first
      const latestBlock = await ethers.provider.getBlock("latest");
      const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
      
      await simpleSwap.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("100"),
        ethers.parseEther("100"),
        ethers.parseEther("90"),
        ethers.parseEther("90"),
        deployer.address,
        deadline
      );

      const path = [await tokenA.getAddress(), await tokenB.getAddress()];
      const amountIn = ethers.parseEther("10");
      const slippage = 500; // 5%

      const result = await simpleSwap.calculateMinOutputWithSlippage(
        amountIn,
        path,
        slippage
      );
      
      expect(result).to.be.gt(0);
    });
  });
});
