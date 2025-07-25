import { ethers } from "hardhat";

/**
 * Script interactivo para trabajar con contratos existentes
 * Permite mintear tokens y agregar liquidez a pools existentes
 */

// ===== CONFIGURACIÓN =====
// Cambiar estas direcciones por las de tus contratos deployados
const CONTRACT_ADDRESSES = {
  TokenA: "", // Colocar dirección del TokenA deployado
  TokenB: "", // Colocar dirección del TokenB deployado  
  SimpleSwap: "" // Colocar dirección del SimpleSwap deployado
};

// Configuración de minting
const CONFIG = {
  MINT_AMOUNT: "5000", // Cantidad de tokens a mintear por usuario
  LIQUIDITY_AMOUNT: "2000", // Cantidad de tokens para agregar al pool
  TARGET_ADDRESSES: [
    // Agregar aquí las direcciones específicas que quieres que reciban tokens
    // Ejemplo: "0x1234567890123456789012345678901234567890"
  ] as string[]
};

async function main() {
  console.log("🔧 Interactive Token and Pool Manager");
  console.log("=====================================");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  console.log("📋 Current deployer:", deployer.address);
  
  // Verificar configuración
  if (!CONTRACT_ADDRESSES.TokenA || !CONTRACT_ADDRESSES.TokenB) {
    console.log("\n❌ No contract addresses configured!");
    console.log("Please edit the CONTRACT_ADDRESSES in the script with your deployed contract addresses.");
    console.log("\nOr run one of these commands to deploy and setup everything:");
    console.log("  npm run mint-and-pool  (deploy + mint + create pool)");
    console.log("  npm run mint-tokens     (deploy + mint only)");
    return;
  }
  
  try {
    // Conectar a contratos existentes
    console.log("\n🔗 Connecting to existing contracts...");
    const tokenA = await ethers.getContractAt("TokenA", CONTRACT_ADDRESSES.TokenA);
    const tokenB = await ethers.getContractAt("TokenB", CONTRACT_ADDRESSES.TokenB);
    
    console.log(`✅ TokenA connected: ${CONTRACT_ADDRESSES.TokenA}`);
    console.log(`✅ TokenB connected: ${CONTRACT_ADDRESSES.TokenB}`);
    
    // Verificar información de tokens
    const [nameA, symbolA, nameB, symbolB] = await Promise.all([
      tokenA.name(),
      tokenA.symbol(), 
      tokenB.name(),
      tokenB.symbol()
    ]);
    
    console.log(`📊 TokenA: ${nameA} (${symbolA})`);
    console.log(`📊 TokenB: ${nameB} (${symbolB})`);
    
    // 1. Mintear tokens a direcciones objetivo
    await mintTokensToTargets(tokenA, tokenB);
    
    // 2. Si SimpleSwap está configurado, manejar liquidez
    if (CONTRACT_ADDRESSES.SimpleSwap) {
      await manageLiquidity(tokenA, tokenB);
    } else {
      console.log("\n⚠️  SimpleSwap not configured. Skipping liquidity management.");
      console.log("To add liquidity, configure SimpleSwap address and run again.");
    }
    
    // 3. Mostrar estado final
    await showFinalStatus(tokenA, tokenB);
    
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n💡 Possible solutions:");
    console.log("  - Verify contract addresses are correct");
    console.log("  - Ensure contracts are deployed on the current network");
    console.log("  - Check that you have sufficient gas and permissions");
  }
}

async function mintTokensToTargets(tokenA: any, tokenB: any) {
  console.log("\n💰 === TOKEN MINTING ===");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const mintAmount = ethers.parseEther(CONFIG.MINT_AMOUNT);
  
  // Determinar direcciones objetivo
  let targetAddresses = [...CONFIG.TARGET_ADDRESSES];
  
  // Si no hay direcciones específicas, usar signers disponibles
  if (targetAddresses.length === 0) {
    targetAddresses = signers.slice(0, 3).map(s => s.address); // Primeros 3 signers
    console.log("📝 No target addresses configured, using available signers");
  }
  
  // Siempre incluir al deployer
  if (!targetAddresses.includes(deployer.address)) {
    targetAddresses.unshift(deployer.address);
  }
  
  console.log(`🎯 Minting ${CONFIG.MINT_AMOUNT} tokens to ${targetAddresses.length} addresses...`);
  
  for (let i = 0; i < targetAddresses.length; i++) {
    const address = targetAddresses[i];
    console.log(`\n👤 Address ${i + 1}/${targetAddresses.length}: ${address}`);
    
    try {
      // Verificar balance antes
      const [balanceABefore, balanceBBefore] = await Promise.all([
        tokenA.balanceOf(address),
        tokenB.balanceOf(address)
      ]);
      
      console.log(`   Before - A: ${ethers.formatEther(balanceABefore)}, B: ${ethers.formatEther(balanceBBefore)}`);
      
      // Mintear tokens
      const [mintATx, mintBTx] = await Promise.all([
        tokenA.mint(address, mintAmount),
        tokenB.mint(address, mintAmount)
      ]);
      
      await Promise.all([mintATx.wait(), mintBTx.wait()]);
      
      // Verificar balance después
      const [balanceAAfter, balanceBAfter] = await Promise.all([
        tokenA.balanceOf(address),
        tokenB.balanceOf(address)
      ]);
      
      console.log(`   After  - A: ${ethers.formatEther(balanceAAfter)}, B: ${ethers.formatEther(balanceBAfter)}`);
      console.log(`   ✅ Minted ${CONFIG.MINT_AMOUNT} of each token`);
      
    } catch (error) {
      console.log(`   ❌ Failed to mint to ${address}:`, (error as Error).message);
    }
  }
}

async function manageLiquidity(tokenA: any, tokenB: any) {
  console.log("\n🏊 === LIQUIDITY MANAGEMENT ===");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  
  try {
    const simpleSwap = await ethers.getContractAt("SimpleSwap", CONTRACT_ADDRESSES.SimpleSwap);
    console.log(`✅ SimpleSwap connected: ${CONTRACT_ADDRESSES.SimpleSwap}`);
    
    // Verificar liquidez actual
    const [reserveA, reserveB] = await simpleSwap.getReserves(
      CONTRACT_ADDRESSES.TokenA,
      CONTRACT_ADDRESSES.TokenB
    );
    
    console.log(`📊 Current reserves - A: ${ethers.formatEther(reserveA)}, B: ${ethers.formatEther(reserveB)}`);
    
    if (reserveA === 0n && reserveB === 0n) {
      console.log("🆕 Pool is empty, adding initial liquidity...");
      await addInitialLiquidity(tokenA, tokenB, simpleSwap, deployer);
    } else {
      console.log("📈 Pool exists, adding additional liquidity...");
      await addAdditionalLiquidity(tokenA, tokenB, simpleSwap, deployer);
    }
    
  } catch (error) {
    console.log("❌ Error managing liquidity:", (error as Error).message);
  }
}

async function addInitialLiquidity(tokenA: any, tokenB: any, simpleSwap: any, deployer: any) {
  const liquidityAmount = ethers.parseEther(CONFIG.LIQUIDITY_AMOUNT);
  
  console.log(`💧 Adding initial liquidity: ${CONFIG.LIQUIDITY_AMOUNT} of each token`);
  
  // Aprobar tokens
  console.log("🔐 Approving tokens...");
  const [approveATx, approveBTx] = await Promise.all([
    tokenA.approve(CONTRACT_ADDRESSES.SimpleSwap, liquidityAmount),
    tokenB.approve(CONTRACT_ADDRESSES.SimpleSwap, liquidityAmount)
  ]);
  
  await Promise.all([approveATx.wait(), approveBTx.wait()]);
  console.log("✅ Tokens approved");
  
  // Agregar liquidez
  const latestBlock = await ethers.provider.getBlock("latest");
  const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
  
  const addLiquidityTx = await simpleSwap["addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"](
    CONTRACT_ADDRESSES.TokenA,
    CONTRACT_ADDRESSES.TokenB,
    liquidityAmount,
    liquidityAmount,
    liquidityAmount,
    liquidityAmount,
    deployer.address,
    deadline
  );
  
  await addLiquidityTx.wait();
  console.log("✅ Initial liquidity added successfully!");
}

async function addAdditionalLiquidity(tokenA: any, tokenB: any, simpleSwap: any, deployer: any) {
  // Para pools existentes, calculamos la proporción correcta
  const [reserveA, reserveB] = await simpleSwap.getReserves(
    CONTRACT_ADDRESSES.TokenA,
    CONTRACT_ADDRESSES.TokenB
  );
  
  const baseAmount = ethers.parseEther(CONFIG.LIQUIDITY_AMOUNT);
  
  // Calcular amounts proporcionales
  let amountA, amountB;
  if (reserveA > 0n && reserveB > 0n) {
    // Mantener proporción existente
    const ratio = reserveB * 10000n / reserveA; // ratio * 10000 para precisión
    amountA = baseAmount;
    amountB = (baseAmount * ratio) / 10000n;
  } else {
    amountA = baseAmount;
    amountB = baseAmount;
  }
  
  console.log(`💧 Adding proportional liquidity:`);
  console.log(`   TokenA: ${ethers.formatEther(amountA)}`);
  console.log(`   TokenB: ${ethers.formatEther(amountB)}`);
  
  // Aprobar y agregar liquidez (similar al proceso inicial)
  const [approveATx, approveBTx] = await Promise.all([
    tokenA.approve(CONTRACT_ADDRESSES.SimpleSwap, amountA),
    tokenB.approve(CONTRACT_ADDRESSES.SimpleSwap, amountB)
  ]);
  
  await Promise.all([approveATx.wait(), approveBTx.wait()]);
  
  const latestBlock = await ethers.provider.getBlock("latest");
  const deadline = latestBlock ? latestBlock.timestamp + 3600 : Math.floor(Date.now() / 1000) + 3600;
  
  const addLiquidityTx = await simpleSwap["addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"](
    CONTRACT_ADDRESSES.TokenA,
    CONTRACT_ADDRESSES.TokenB,
    amountA,
    amountB,
    (amountA * 95n) / 100n, // 5% slippage tolerance
    (amountB * 95n) / 100n,
    deployer.address,
    deadline
  );
  
  await addLiquidityTx.wait();
  console.log("✅ Additional liquidity added successfully!");
}

async function showFinalStatus(tokenA: any, tokenB: any) {
  console.log("\n📊 === FINAL STATUS ===");
  
  // Total supply
  const [totalSupplyA, totalSupplyB] = await Promise.all([
    tokenA.totalSupply(),
    tokenB.totalSupply()
  ]);
  
  console.log(`📈 Total Supply:`);
  console.log(`   TokenA: ${ethers.formatEther(totalSupplyA)} TKA`);
  console.log(`   TokenB: ${ethers.formatEther(totalSupplyB)} TKB`);
  
  // Pool info si existe
  if (CONTRACT_ADDRESSES.SimpleSwap) {
    try {
      const simpleSwap = await ethers.getContractAt("SimpleSwap", CONTRACT_ADDRESSES.SimpleSwap);
      const [reserveA, reserveB] = await simpleSwap.getReserves(
        CONTRACT_ADDRESSES.TokenA,
        CONTRACT_ADDRESSES.TokenB
      );
      
      console.log(`\n🏊 Pool Reserves:`);
      console.log(`   TokenA: ${ethers.formatEther(reserveA)} TKA`);
      console.log(`   TokenB: ${ethers.formatEther(reserveB)} TKB`);
      
      if (reserveA > 0n && reserveB > 0n) {
        const price = (reserveB * 1000000n) / reserveA; // precio con 6 decimales
        console.log(`   Price: 1 TKA = ${Number(price) / 1000000} TKB`);
      }
    } catch (error) {
      console.log("⚠️  Could not fetch pool information");
    }
  }
  
  console.log("\n🎉 Process completed!");
  console.log("\n📍 Contract Addresses:");
  console.log(`   TokenA: ${CONTRACT_ADDRESSES.TokenA}`);
  console.log(`   TokenB: ${CONTRACT_ADDRESSES.TokenB}`);
  if (CONTRACT_ADDRESSES.SimpleSwap) {
    console.log(`   SimpleSwap: ${CONTRACT_ADDRESSES.SimpleSwap}`);
  }
  
  console.log("\n💡 Next steps:");
  console.log("   - Verify token balances on block explorer");
  console.log("   - Test swapping functionality");
  console.log("   - Check pool reserves and liquidity");
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exitCode = 1;
});
