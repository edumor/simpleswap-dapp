import { ethers } from "hardhat";
import { TokenA, TokenB } from "../typechain-types";

/**
 * Script simple para mintear tokens a direcciones específicas
 * Útil para probar pools existentes o distribuir tokens para testing
 */

async function main() {
  console.log("💰 Starting simple token minting process...");
  
  // Configuración
  const MINT_AMOUNT = ethers.parseEther("10000"); // 10,000 tokens por dirección
  const NUMBER_OF_USERS = 5; // Cantidad de usuarios que recibirán tokens
  
  // Direcciones de contratos (cambiar por las direcciones reales si ya existen)
  // Si no existen, se desplegarán nuevos contratos
  const EXISTING_TOKEN_A = ""; // Dejar vacío para desplegar nuevo
  const EXISTING_TOKEN_B = ""; // Dejar vacío para desplegar nuevo
  
  // Obtener signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  console.log("📋 Deployer address:", deployer.address);
  console.log(`💵 Mint amount per user: ${ethers.formatEther(MINT_AMOUNT)} tokens`);
  console.log(`👥 Number of users to receive tokens: ${NUMBER_OF_USERS}`);

  let tokenA: TokenA;
  let tokenB: TokenB;

  // Obtener o desplegar TokenA
  if (EXISTING_TOKEN_A && ethers.isAddress(EXISTING_TOKEN_A)) {
    console.log("\n🔗 Connecting to existing TokenA at:", EXISTING_TOKEN_A);
    tokenA = await ethers.getContractAt("TokenA", EXISTING_TOKEN_A);
  } else {
    console.log("\n📦 Deploying new TokenA...");
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenA.waitForDeployment();
    const tokenAAddress = await tokenA.getAddress();
    console.log("✅ TokenA deployed at:", tokenAAddress);
  }

  // Obtener o desplegar TokenB
  if (EXISTING_TOKEN_B && ethers.isAddress(EXISTING_TOKEN_B)) {
    console.log("\n🔗 Connecting to existing TokenB at:", EXISTING_TOKEN_B);
    tokenB = await ethers.getContractAt("TokenB", EXISTING_TOKEN_B);
  } else {
    console.log("\n📦 Deploying new TokenB...");
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy(deployer.address, { gasLimit: 5000000 });
    await tokenB.waitForDeployment();
    const tokenBAddress = await tokenB.getAddress();
    console.log("✅ TokenB deployed at:", tokenBAddress);
  }

  // Mintear tokens a múltiples direcciones
  console.log("\n💰 Minting tokens to addresses...");
  
  const addresses = [];
  const balancePromises = [];
  
  // Incluir al deployer
  addresses.push(deployer.address);
  
  // Agregar usuarios adicionales
  for (let i = 1; i < Math.min(NUMBER_OF_USERS, signers.length); i++) {
    addresses.push(signers[i].address);
  }
  
  // Si necesitamos más direcciones que signers disponibles, generar direcciones aleatorias
  while (addresses.length < NUMBER_OF_USERS) {
    const randomWallet = ethers.Wallet.createRandom();
    addresses.push(randomWallet.address);
    console.log(`⚠️  Generated random address: ${randomWallet.address} (no private key available)`);
  }

  // Mintear a cada dirección
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    console.log(`\n💰 Minting to address ${i + 1}/${addresses.length}: ${address}`);
    
    try {
      // Mintear TokenA
      const mintATx = await tokenA.mint(address, MINT_AMOUNT);
      await mintATx.wait();
      console.log(`✅ Minted ${ethers.formatEther(MINT_AMOUNT)} TokenA`);
      
      // Mintear TokenB  
      const mintBTx = await tokenB.mint(address, MINT_AMOUNT);
      await mintBTx.wait();
      console.log(`✅ Minted ${ethers.formatEther(MINT_AMOUNT)} TokenB`);
      
    } catch (error) {
      console.log(`❌ Error minting to ${address}:`, error);
    }
  }

  // Verificar balances finales
  console.log("\n📊 Final token balances:");
  console.log("=" .repeat(80));
  
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    try {
      const balanceA = await tokenA.balanceOf(address);
      const balanceB = await tokenB.balanceOf(address);
      
      console.log(`\n👤 Address ${i + 1}: ${address}`);
      console.log(`   TokenA: ${ethers.formatEther(balanceA)} TKA`);
      console.log(`   TokenB: ${ethers.formatEther(balanceB)} TKB`);
    } catch (error) {
      console.log(`❌ Error checking balance for ${address}:`, error);
    }
  }

  // Mostrar información de contratos
  console.log("\n📍 Contract Information:");
  console.log("=" .repeat(50));
  console.log(`TokenA address: ${await tokenA.getAddress()}`);
  console.log(`TokenB address: ${await tokenB.getAddress()}`);
  console.log(`TokenA name: ${await tokenA.name()}`);
  console.log(`TokenA symbol: ${await tokenA.symbol()}`);
  console.log(`TokenB name: ${await tokenB.name()}`);
  console.log(`TokenB symbol: ${await tokenB.symbol()}`);

  // Mostrar supply total
  const totalSupplyA = await tokenA.totalSupply();
  const totalSupplyB = await tokenB.totalSupply();
  console.log(`\n📈 Total Supply:`);
  console.log(`TokenA: ${ethers.formatEther(totalSupplyA)} TKA`);
  console.log(`TokenB: ${ethers.formatEther(totalSupplyB)} TKB`);

  console.log("\n🎉 Token minting completed successfully!");
  console.log("💡 You can now use these tokens to:");
  console.log("   - Add liquidity to SimpleSwap pools");
  console.log("   - Test swapping functionality");
  console.log("   - Verify balances on block explorers");
}

// Función auxiliar para usar con contratos existentes específicos
async function mintToSpecificAddresses(
  tokenAAddress: string, 
  tokenBAddress: string, 
  targetAddresses: string[], 
  amount: string = "1000"
) {
  console.log("🎯 Minting to specific addresses...");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  const tokenA = await ethers.getContractAt("TokenA", tokenAAddress);
  const tokenB = await ethers.getContractAt("TokenB", tokenBAddress);
  
  const mintAmount = ethers.parseEther(amount);
  
  for (const address of targetAddresses) {
    console.log(`💰 Minting ${amount} tokens to: ${address}`);
    
    await tokenA.mint(address, mintAmount);
    await tokenB.mint(address, mintAmount);
    
    const balanceA = await tokenA.balanceOf(address);
    const balanceB = await tokenB.balanceOf(address);
    
    console.log(`✅ New balances - A: ${ethers.formatEther(balanceA)}, B: ${ethers.formatEther(balanceB)}`);
  }
}

// Función para usar faucet (para usuarios no owner)
async function useFaucet(tokenAAddress: string, tokenBAddress: string, userIndex: number = 1) {
  console.log("🚰 Using token faucets...");
  
  const signers = await ethers.getSigners();
  const user = signers[userIndex];
  
  const tokenA = await ethers.getContractAt("TokenA", tokenAAddress);
  const tokenB = await ethers.getContractAt("TokenB", tokenBAddress);
  
  // Conectar como usuario (no owner)
  const tokenAAsUser = tokenA.connect(user);
  const tokenBAsUser = tokenB.connect(user);
  
  console.log(`🚰 User ${user.address} using faucets...`);
  
  await tokenAAsUser.faucet();
  await tokenBAsUser.faucet();
  
  const balanceA = await tokenA.balanceOf(user.address);
  const balanceB = await tokenB.balanceOf(user.address);
  
  console.log(`✅ Faucet complete! Balances - A: ${ethers.formatEther(balanceA)}, B: ${ethers.formatEther(balanceB)}`);
}

// Ejecutar script principal
main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});

// Exportar funciones auxiliares
export { mintToSpecificAddresses, useFaucet };
