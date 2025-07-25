import { ethers } from "hardhat";
import { TokenA, TokenB, SimpleSwap } from "../typechain-types";

/**
 * Script para mintear tokens y crear pools con liquidez visible
 * Este script permite:
 * 1. Mintear TokenA y TokenB a direcciones específicas
 * 2. Crear un pool en SimpleSwap con liquidez
 * 3. Verificar que los tokens estén disponibles en las direcciones
 */

async function main() {
  console.log("🚀 Starting token minting and pool creation process...");
  
  // Obtener signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const user1 = signers[1];
  const user2 = signers[2];
  
  console.log("📋 Deployer address:", deployer.address);
  console.log("📋 User1 address:", user1.address);
  console.log("📋 User2 address:", user2.address);

  // 1. Desplegar contratos si no existen (o usar direcciones existentes)
  console.log("\n📦 Deploying contracts...");
  
  const TokenAFactory = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 5000000 });
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("✅ TokenA deployed at:", tokenAAddress);

  const TokenBFactory = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 5000000 });
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("✅ TokenB deployed at:", tokenBAddress);

  const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
  const simpleSwap = await SimpleSwapFactory.deploy({ gasLimit: 5000000 });
  await simpleSwap.waitForDeployment();
  const simpleSwapAddress = await simpleSwap.getAddress();
  console.log("✅ SimpleSwap deployed at:", simpleSwapAddress);

  // 2. Mintear tokens a diferentes direcciones
  console.log("\n💰 Minting tokens to addresses...");
  
  const mintAmount = ethers.parseEther("10000"); // 10,000 tokens
  const poolLiquidityAmount = ethers.parseEther("5000"); // 5,000 tokens para liquidez
  
  // Mintear al deployer (owner puede mintear cualquier cantidad)
  await tokenA.mint(deployer.address, mintAmount);
  await tokenB.mint(deployer.address, mintAmount);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenA to deployer`);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenB to deployer`);

  // Mintear a user1
  await tokenA.mint(user1.address, mintAmount);
  await tokenB.mint(user1.address, mintAmount);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenA to user1`);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenB to user1`);

  // Mintear a user2
  await tokenA.mint(user2.address, mintAmount);
  await tokenB.mint(user2.address, mintAmount);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenA to user2`);
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} TokenB to user2`);

  // 3. Verificar balances antes de crear el pool
  console.log("\n📊 Token balances before pool creation:");
  const deployerBalanceA = await tokenA.balanceOf(deployer.address);
  const deployerBalanceB = await tokenB.balanceOf(deployer.address);
  console.log(`Deployer - TokenA: ${ethers.formatEther(deployerBalanceA)} TKA`);
  console.log(`Deployer - TokenB: ${ethers.formatEther(deployerBalanceB)} TKB`);

  // 4. Aprobar el SimpleSwap para gastar tokens del deployer
  console.log("\n🔐 Approving SimpleSwap to spend tokens...");
  await tokenA.approve(simpleSwapAddress, poolLiquidityAmount);
  await tokenB.approve(simpleSwapAddress, poolLiquidityAmount);
  console.log("✅ Approved SimpleSwap to spend tokens");

  // 5. Agregar liquidez inicial al pool
  console.log("\n🏊 Adding initial liquidity to the pool...");
  const latestBlock = await ethers.provider.getBlock("latest");
  const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;

  const addLiquidityTx = await simpleSwap["addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"](
    tokenAAddress,
    tokenBAddress,
    poolLiquidityAmount,
    poolLiquidityAmount,
    poolLiquidityAmount,
    poolLiquidityAmount,
    deployer.address,
    deadline
  );
  
  await addLiquidityTx.wait();
  console.log(`✅ Added ${ethers.formatEther(poolLiquidityAmount)} TokenA and ${ethers.formatEther(poolLiquidityAmount)} TokenB to the pool`);

  // 6. Verificar que el pool tiene liquidez
  console.log("\n🏊 Pool information:");
  const pairHash = ethers.keccak256(
    ethers.solidityPacked(['address', 'address'], 
      tokenAAddress < tokenBAddress ? [tokenAAddress, tokenBAddress] : [tokenBAddress, tokenAAddress]
    )
  );
  
  const pairData = await simpleSwap.pairs(pairHash);
  console.log(`Pool reserves - TokenA: ${ethers.formatEther(pairData.reserveA)} TKA`);
  console.log(`Pool reserves - TokenB: ${ethers.formatEther(pairData.reserveB)} TKB`);
  console.log(`Total liquidity: ${ethers.formatEther(pairData.totalLiquidity)}`);

  // 7. Verificar balances finales de todas las direcciones
  console.log("\n📊 Final token balances:");
  
  // Deployer balances
  const finalDeployerA = await tokenA.balanceOf(deployer.address);
  const finalDeployerB = await tokenB.balanceOf(deployer.address);
  console.log(`Deployer - TokenA: ${ethers.formatEther(finalDeployerA)} TKA`);
  console.log(`Deployer - TokenB: ${ethers.formatEther(finalDeployerB)} TKB`);
  
  // User1 balances
  const user1BalanceA = await tokenA.balanceOf(user1.address);
  const user1BalanceB = await tokenB.balanceOf(user1.address);
  console.log(`User1 - TokenA: ${ethers.formatEther(user1BalanceA)} TKA`);
  console.log(`User1 - TokenB: ${ethers.formatEther(user1BalanceB)} TKB`);
  
  // User2 balances
  const user2BalanceA = await tokenA.balanceOf(user2.address);
  const user2BalanceB = await tokenB.balanceOf(user2.address);
  console.log(`User2 - TokenA: ${ethers.formatEther(user2BalanceA)} TKA`);
  console.log(`User2 - TokenB: ${ethers.formatEther(user2BalanceB)} TKB`);

  // SimpleSwap balances (tokens en el pool)
  const poolBalanceA = await tokenA.balanceOf(simpleSwapAddress);
  const poolBalanceB = await tokenB.balanceOf(simpleSwapAddress);
  console.log(`Pool (SimpleSwap) - TokenA: ${ethers.formatEther(poolBalanceA)} TKA`);
  console.log(`Pool (SimpleSwap) - TokenB: ${ethers.formatEther(poolBalanceB)} TKB`);

  // 8. Mostrar direcciones de contratos para verificación externa
  console.log("\n📍 Contract addresses for verification:");
  console.log(`TokenA: ${tokenAAddress}`);
  console.log(`TokenB: ${tokenBAddress}`);
  console.log(`SimpleSwap: ${simpleSwapAddress}`);
  
  console.log("\n🎉 Process completed successfully!");
  console.log("💡 You can now check these addresses on a block explorer to see the token balances and pool liquidity.");
}

// Función para usar tokens existentes (opcional)
async function useExistingContracts(tokenAAddress: string, tokenBAddress: string, simpleSwapAddress: string) {
  console.log("🔄 Using existing contracts...");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  // Conectar a contratos existentes
  const tokenA = await ethers.getContractAt("TokenA", tokenAAddress);
  const tokenB = await ethers.getContractAt("TokenB", tokenBAddress);
  const simpleSwap = await ethers.getContractAt("SimpleSwap", simpleSwapAddress);
  
  // Mintear más tokens
  const additionalMint = ethers.parseEther("5000");
  await tokenA.mint(deployer.address, additionalMint);
  await tokenB.mint(deployer.address, additionalMint);
  
  console.log(`✅ Minted additional ${ethers.formatEther(additionalMint)} tokens to deployer`);
  
  // Verificar balances
  const balanceA = await tokenA.balanceOf(deployer.address);
  const balanceB = await tokenB.balanceOf(deployer.address);
  console.log(`Deployer balance - TokenA: ${ethers.formatEther(balanceA)} TKA`);
  console.log(`Deployer balance - TokenB: ${ethers.formatEther(balanceB)} TKB`);
}

// Ejecutar el script principal
main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});

// Exportar función para uso manual
export { useExistingContracts };
