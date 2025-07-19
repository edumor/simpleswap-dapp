const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Setting up contracts on Sepolia...");
  
  // Contract addresses
  const SIMPLE_SWAP_ADDRESS = "0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4";
  const TOKEN_A_ADDRESS = "0x4efc5e7af7851efB65871c0d54adaC154250126f";
  const TOKEN_B_ADDRESS = "0x36ae80FDa8f67605aac4Dd723c70ce70513AB909";
  
  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  // Get contract instances
  const TokenA = await ethers.getContractAt("TokenA", TOKEN_A_ADDRESS);
  const TokenB = await ethers.getContractAt("TokenB", TOKEN_B_ADDRESS);
  const SimpleSwap = await ethers.getContractAt("SimpleSwap", SIMPLE_SWAP_ADDRESS);
  
  console.log("\n💰 Step 1: Minting tokens...");
  
  // Mint 1000 tokens of each type
  const mintAmount = ethers.parseEther("1000");
  
  console.log("Minting TokenA...");
  const mintATx = await TokenA.mint(deployer.address, mintAmount);
  await mintATx.wait();
  console.log("✅ TokenA minted");
  
  console.log("Minting TokenB...");
  const mintBTx = await TokenB.mint(deployer.address, mintAmount);
  await mintBTx.wait();
  console.log("✅ TokenB minted");
  
  console.log("\n🔐 Step 2: Approving SimpleSwap...");
  
  // Approve max amount for SimpleSwap
  const maxApproval = ethers.MaxUint256;
  
  console.log("Approving TokenA...");
  const approveATx = await TokenA.approve(SIMPLE_SWAP_ADDRESS, maxApproval);
  await approveATx.wait();
  console.log("✅ TokenA approved");
  
  console.log("Approving TokenB...");
  const approveBTx = await TokenB.approve(SIMPLE_SWAP_ADDRESS, maxApproval);
  await approveBTx.wait();
  console.log("✅ TokenB approved");
  
  console.log("\n🏊 Step 3: Adding initial liquidity...");
  
  // Add initial liquidity (100 tokens each)
  const liquidityAmount = ethers.parseEther("100");
  
  console.log("Adding liquidity...");
  const addLiquidityTx = await SimpleSwap.addLiquidity(liquidityAmount, liquidityAmount);
  await addLiquidityTx.wait();
  console.log("✅ Initial liquidity added");
  
  console.log("\n📊 Final balances:");
  const balanceA = await TokenA.balanceOf(deployer.address);
  const balanceB = await TokenB.balanceOf(deployer.address);
  const reserveA = await SimpleSwap.reserveA();
  const reserveB = await SimpleSwap.reserveB();
  
  console.log(`TokenA balance: ${ethers.formatEther(balanceA)} TokenA`);
  console.log(`TokenB balance: ${ethers.formatEther(balanceB)} TokenB`);
  console.log(`Pool reserveA: ${ethers.formatEther(reserveA)} TokenA`);
  console.log(`Pool reserveB: ${ethers.formatEther(reserveB)} TokenB`);
  
  console.log("\n🎉 Setup complete! You can now use the frontend.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
