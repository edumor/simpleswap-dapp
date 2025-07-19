const { ethers } = require("hardhat");
require("dotenv").config();

// Configuración de contratos desplegados
const CONTRACTS = {
  SimpleSwap: {
    address: process.env.SIMPLE_SWAP_ADDRESS,
    name: "SimpleSwap"
  },
  TokenA: {
    address: process.env.TOKEN_A_ADDRESS,
    name: "TokenA"
  },
  TokenB: {
    address: process.env.TOKEN_B_ADDRESS,
    name: "TokenB"
  }
};

class Web3Toolkit {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isConnected = false;
  }

  // Inicializar conexión
  async initialize(useLocalNetwork = false) {
    try {
      console.log("🔌 Inicializando Web3 Toolkit...\n");

      if (useLocalNetwork) {
        // Conectar a red local de Hardhat
        this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        console.log("🏠 Conectado a red local de Hardhat");
      } else {
        // Conectar a Sepolia
        this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        console.log("🌐 Conectado a Sepolia Testnet");
      }

      // Si hay private key, crear signer
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log(`👤 Wallet conectada: ${this.signer.address}`);
        
        const balance = await this.provider.getBalance(this.signer.address);
        console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);
      } else {
        console.log("⚠️  Modo solo lectura - No hay private key configurada\n");
      }

      // Cargar contratos
      await this.loadContracts();
      this.isConnected = true;

      console.log("✅ Web3 Toolkit inicializado correctamente!\n");
      return true;

    } catch (error) {
      console.error("❌ Error al inicializar Web3 Toolkit:", error.message);
      return false;
    }
  }

  // Cargar instancias de contratos
  async loadContracts() {
    try {
      console.log("📄 Cargando contratos...");

      // Cargar TokenA
      const TokenA = await ethers.getContractFactory("TokenA");
      this.contracts.TokenA = TokenA.attach(CONTRACTS.TokenA.address);
      
      // Cargar TokenB  
      const TokenB = await ethers.getContractFactory("TokenB");
      this.contracts.TokenB = TokenB.attach(CONTRACTS.TokenB.address);
      
      // Cargar SimpleSwap
      const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
      this.contracts.SimpleSwap = SimpleSwap.attach(CONTRACTS.SimpleSwap.address);

      console.log("   ✅ TokenA cargado");
      console.log("   ✅ TokenB cargado");
      console.log("   ✅ SimpleSwap cargado\n");

    } catch (error) {
      console.error("❌ Error cargando contratos:", error.message);
      throw error;
    }
  }

  // Obtener información de tokens
  async getTokensInfo() {
    console.log("📊 INFORMACIÓN DE TOKENS\n");
    
    try {
      const tokenA = this.contracts.TokenA;
      const tokenB = this.contracts.TokenB;

      const [nameA, symbolA, decimalsA, totalSupplyA] = await Promise.all([
        tokenA.name(),
        tokenA.symbol(),
        tokenA.decimals(),
        tokenA.totalSupply()
      ]);

      const [nameB, symbolB, decimalsB, totalSupplyB] = await Promise.all([
        tokenB.name(),
        tokenB.symbol(),
        tokenB.decimals(),
        tokenB.totalSupply()
      ]);

      console.log(`🪙 ${nameA} (${symbolA}):`);
      console.log(`   Dirección: ${CONTRACTS.TokenA.address}`);
      console.log(`   Decimales: ${decimalsA}`);
      console.log(`   Supply Total: ${ethers.formatEther(totalSupplyA)} ${symbolA}\n`);

      console.log(`🪙 ${nameB} (${symbolB}):`);
      console.log(`   Dirección: ${CONTRACTS.TokenB.address}`);
      console.log(`   Decimales: ${decimalsB}`);
      console.log(`   Supply Total: ${ethers.formatEther(totalSupplyB)} ${symbolB}\n`);

      return { tokenA: { nameA, symbolA, decimalsA, totalSupplyA }, tokenB: { nameB, symbolB, decimalsB, totalSupplyB } };

    } catch (error) {
      console.error("❌ Error obteniendo información de tokens:", error.message);
    }
  }

  // Obtener información del pool
  async getPoolInfo() {
    console.log("🏊‍♂️ INFORMACIÓN DEL POOL\n");
    
    try {
      const simpleSwap = this.contracts.SimpleSwap;
      const reserves = await simpleSwap.getReserves(CONTRACTS.TokenA.address, CONTRACTS.TokenB.address);

      if (reserves[0] > 0 || reserves[1] > 0) {
        console.log(`   📊 Reserva TokenA: ${ethers.formatEther(reserves[0])} TKA`);
        console.log(`   📊 Reserva TokenB: ${ethers.formatEther(reserves[1])} TKB`);
        
        if (reserves[0] > 0 && reserves[1] > 0) {
          const ratio = Number(ethers.formatEther(reserves[1])) / Number(ethers.formatEther(reserves[0]));
          console.log(`   📈 Ratio: 1 TKA = ${ratio.toFixed(6)} TKB`);
        }
      } else {
        console.log("   ⚠️  Pool vacío - no hay liquidez");
      }
      
      console.log("");
      return reserves;

    } catch (error) {
      console.error("❌ Error obteniendo información del pool:", error.message);
    }
  }

  // Obtener balances de una dirección
  async getBalances(address = null) {
    const targetAddress = address || this.signer?.address;
    
    if (!targetAddress) {
      console.log("⚠️  No se especificó dirección y no hay wallet conectada");
      return;
    }

    console.log(`💼 BALANCES PARA: ${targetAddress}\n`);
    
    try {
      const tokenA = this.contracts.TokenA;
      const tokenB = this.contracts.TokenB;

      const [balanceA, balanceB, ethBalance] = await Promise.all([
        tokenA.balanceOf(targetAddress),
        tokenB.balanceOf(targetAddress),
        this.provider.getBalance(targetAddress)
      ]);

      console.log(`   💰 ETH: ${ethers.formatEther(ethBalance)} ETH`);
      console.log(`   🪙 TokenA: ${ethers.formatEther(balanceA)} TKA`);
      console.log(`   🪙 TokenB: ${ethers.formatEther(balanceB)} TKB\n`);

      return { ethBalance, balanceA, balanceB };

    } catch (error) {
      console.error("❌ Error obteniendo balances:", error.message);
    }
  }

  // Mintear tokens (solo si eres owner)
  async mintTokens(tokenSymbol, amount, toAddress = null) {
    if (!this.signer) {
      console.log("❌ Necesitas una private key para mintear tokens");
      return;
    }

    const to = toAddress || this.signer.address;
    const amountWei = ethers.parseEther(amount.toString());
    
    console.log(`🏦 Minteando ${amount} ${tokenSymbol} para ${to}...`);

    try {
      let contract;
      if (tokenSymbol.toLowerCase() === 'tka' || tokenSymbol.toLowerCase() === 'tokena') {
        contract = this.contracts.TokenA.connect(this.signer);
      } else if (tokenSymbol.toLowerCase() === 'tkb' || tokenSymbol.toLowerCase() === 'tokenb') {
        contract = this.contracts.TokenB.connect(this.signer);
      } else {
        throw new Error("Token inválido. Usa 'TKA' o 'TKB'");
      }

      const tx = await contract.mint(to, amountWei);
      console.log(`   📝 Transacción enviada: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`   ✅ ¡${amount} ${tokenSymbol} minteados exitosamente!`);
      console.log(`   ⛽ Gas usado: ${receipt.gasUsed.toString()}\n`);

      return receipt;

    } catch (error) {
      console.error(`❌ Error minteando ${tokenSymbol}:`, error.message);
    }
  }

  // Aprobar tokens para el swap
  async approveTokens(tokenSymbol, amount) {
    if (!this.signer) {
      console.log("❌ Necesitas una private key para aprobar tokens");
      return;
    }

    const amountWei = ethers.parseEther(amount.toString());
    console.log(`🔐 Aprobando ${amount} ${tokenSymbol} para SimpleSwap...`);

    try {
      let contract;
      if (tokenSymbol.toLowerCase() === 'tka' || tokenSymbol.toLowerCase() === 'tokena') {
        contract = this.contracts.TokenA.connect(this.signer);
      } else if (tokenSymbol.toLowerCase() === 'tkb' || tokenSymbol.toLowerCase() === 'tokenb') {
        contract = this.contracts.TokenB.connect(this.signer);
      } else {
        throw new Error("Token inválido. Usa 'TKA' o 'TKB'");
      }

      const tx = await contract.approve(CONTRACTS.SimpleSwap.address, amountWei);
      console.log(`   📝 Transacción enviada: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`   ✅ ¡Aprobación exitosa!`);
      console.log(`   ⛽ Gas usado: ${receipt.gasUsed.toString()}\n`);

      return receipt;

    } catch (error) {
      console.error(`❌ Error aprobando ${tokenSymbol}:`, error.message);
    }
  }

  // Agregar liquidez al pool
  async addLiquidity(amountA, amountB) {
    if (!this.signer) {
      console.log("❌ Necesitas una private key para agregar liquidez");
      return;
    }

    console.log(`🏊‍♂️ Agregando liquidez: ${amountA} TKA + ${amountB} TKB...`);

    try {
      const amountAWei = ethers.parseEther(amountA.toString());
      const amountBWei = ethers.parseEther(amountB.toString());
      
      // Mínimos (95% del deseado)
      const minA = (amountAWei * 95n) / 100n;
      const minB = (amountBWei * 95n) / 100n;

      // Aprobar tokens primero
      await this.approveTokens('TKA', amountA);
      await this.approveTokens('TKB', amountB);

      // Agregar liquidez
      const simpleSwap = this.contracts.SimpleSwap.connect(this.signer);
      const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutos

      const tx = await simpleSwap.addLiquidity(
        CONTRACTS.TokenA.address,
        CONTRACTS.TokenB.address,
        amountAWei,
        amountBWei,
        minA,
        minB,
        this.signer.address,
        deadline
      );

      console.log(`   📝 Transacción enviada: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`   ✅ ¡Liquidez agregada exitosamente!`);
      console.log(`   ⛽ Gas usado: ${receipt.gasUsed.toString()}\n`);

      return receipt;

    } catch (error) {
      console.error("❌ Error agregando liquidez:", error.message);
    }
  }

  // Hacer swap de tokens
  async swapTokens(fromToken, toToken, amount) {
    if (!this.signer) {
      console.log("❌ Necesitas una private key para hacer swap");
      return;
    }

    console.log(`🔄 Swap: ${amount} ${fromToken} → ${toToken}...`);

    try {
      const amountWei = ethers.parseEther(amount.toString());
      
      // Determinar direcciones
      let tokenInAddress, tokenOutAddress;
      if (fromToken.toLowerCase() === 'tka') {
        tokenInAddress = CONTRACTS.TokenA.address;
        tokenOutAddress = CONTRACTS.TokenB.address;
      } else if (fromToken.toLowerCase() === 'tkb') {
        tokenInAddress = CONTRACTS.TokenB.address;
        tokenOutAddress = CONTRACTS.TokenA.address;
      } else {
        throw new Error("Token inválido. Usa 'TKA' o 'TKB'");
      }

      // Obtener cantidad esperada
      const simpleSwap = this.contracts.SimpleSwap;
      const expectedOut = await simpleSwap.getAmountOut(amountWei, tokenInAddress, tokenOutAddress);
      const minOut = (expectedOut * 95n) / 100n; // 5% slippage

      console.log(`   📊 Esperado: ${ethers.formatEther(expectedOut)} ${toToken}`);
      console.log(`   📊 Mínimo: ${ethers.formatEther(minOut)} ${toToken}`);

      // Aprobar tokens
      await this.approveTokens(fromToken, amount);

      // Realizar swap
      const swapContract = simpleSwap.connect(this.signer);
      const deadline = Math.floor(Date.now() / 1000) + 300;
      const path = [tokenInAddress, tokenOutAddress];

      const tx = await swapContract.swapExactTokensForTokens(
        amountWei,
        minOut,
        path,
        this.signer.address,
        deadline
      );

      console.log(`   📝 Transacción enviada: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`   ✅ ¡Swap exitoso!`);
      console.log(`   ⛽ Gas usado: ${receipt.gasUsed.toString()}\n`);

      return receipt;

    } catch (error) {
      console.error("❌ Error en swap:", error.message);
    }
  }

  // Mostrar resumen completo
  async showFullStatus() {
    console.log("=" * 60);
    console.log("🚀 ESTADO COMPLETO DEL ECOSISTEMA SSWAP");
    console.log("=" * 60 + "\n");

    await this.getTokensInfo();
    await this.getPoolInfo();
    await this.getBalances();
  }
}

// Función demo para mostrar todas las capacidades
async function demoCompleto() {
  const toolkit = new Web3Toolkit();
  
  // Inicializar (usa false para Sepolia, true para red local)
  const success = await toolkit.initialize(false);
  if (!success) return;

  // Mostrar estado completo
  await toolkit.showFullStatus();

  console.log("💡 COMANDOS DISPONIBLES:");
  console.log("   toolkit.mintTokens('TKA', 100)");
  console.log("   toolkit.addLiquidity(50, 50)");
  console.log("   toolkit.swapTokens('TKA', 'TKB', 10)");
  console.log("   toolkit.getBalances()");
  console.log("\n🔧 Para usar en consola:");
  console.log("   const { Web3Toolkit } = require('./scripts/web3-toolkit.js');");
  console.log("   const toolkit = new Web3Toolkit();");
  console.log("   await toolkit.initialize();");
}

module.exports = {
  Web3Toolkit,
  demoCompleto,
  CONTRACTS
};

// Si se ejecuta directamente
if (require.main === module) {
  demoCompleto()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
