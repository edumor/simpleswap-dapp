/**
 * 📚 Ethers.js Advanced Examples
 * Ejemplos avanzados de ethers.js siguiendo el módulo 4
 */

const { ethers } = require('ethers');
require('dotenv').config();

class EthersToolkit {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contracts = {};
  }

  // Inicializar provider y wallet
  async initialize() {
    console.log("🔧 Inicializando Ethers.js Toolkit...\n");

    try {
      // 1. Crear provider
      this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      console.log("✅ Provider creado para Sepolia");

      // 2. Conectar wallet si hay private key
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log(`✅ Wallet conectada: ${this.wallet.address}`);
      } else {
        console.log("⚠️  Modo solo lectura - sin private key");
      }

      // 3. Cargar contratos
      await this.loadContracts();

      console.log("✅ Toolkit inicializado\n");

    } catch (error) {
      console.error("❌ Error inicializando:", error.message);
    }
  }

  // Cargar contratos con ABIs
  async loadContracts() {
    try {
      // ABI básico de ERC20
      const erc20Abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)", 
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function mint(address to, uint256 amount)",
        "event Transfer(address indexed from, address indexed to, uint256 value)"
      ];

      // ABI básico de SimpleSwap  
      const swapAbi = [
        "function getReserves(address tokenA, address tokenB) view returns (uint256, uint256)",
        "function getPrice(address tokenA, address tokenB, uint256 amountIn) view returns (uint256)",
        "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256, uint256, uint256)",
        "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[])",
        "event Swap(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)"
      ];

      // Crear instancias de contratos
      this.contracts.tokenA = new ethers.Contract(
        process.env.TOKEN_A_ADDRESS,
        erc20Abi,
        this.provider
      );

      this.contracts.tokenB = new ethers.Contract(
        process.env.TOKEN_B_ADDRESS,
        erc20Abi,
        this.provider
      );

      this.contracts.simpleSwap = new ethers.Contract(
        process.env.SIMPLE_SWAP_ADDRESS,
        swapAbi,
        this.provider
      );

      console.log("✅ Contratos cargados con ABIs");

    } catch (error) {
      console.error("❌ Error cargando contratos:", error.message);
    }
  }

  // Ejemplos de Providers (módulo 4)
  async ejemplosProviders() {
    console.log("🌐 EJEMPLOS DE PROVIDERS\n");

    try {
      // 1. Información de la red
      const network = await this.provider.getNetwork();
      console.log(`📡 Red: ${network.name} (Chain ID: ${network.chainId})`);

      // 2. Número de bloque actual
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`📦 Bloque actual: ${blockNumber}`);

      // 3. Precio del gas
      const gasPrice = await this.provider.getGasPrice();
      console.log(`⛽ Precio del gas: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`);

      // 4. Balance de contratos
      const balanceSwap = await this.provider.getBalance(process.env.SIMPLE_SWAP_ADDRESS);
      console.log(`💰 Balance SimpleSwap: ${ethers.formatEther(balanceSwap)} ETH`);

      // 5. Información de un bloque
      const block = await this.provider.getBlock('latest');
      console.log(`🕐 Timestamp del bloque: ${new Date(block.timestamp * 1000).toLocaleString()}`);
      console.log(`🔗 Hash del bloque: ${block.hash.substring(0, 10)}...`);

      console.log("");

    } catch (error) {
      console.error("❌ Error en ejemplos de providers:", error.message);
    }
  }

  // Ejemplos de Wallets (módulo 4)
  async ejemplosWallets() {
    console.log("👛 EJEMPLOS DE WALLETS\n");

    try {
      // 1. Crear wallet aleatoria
      const randomWallet = ethers.Wallet.createRandom();
      console.log("🎲 Wallet aleatoria creada:");
      console.log(`   Address: ${randomWallet.address}`);
      console.log(`   Private Key: ${randomWallet.privateKey.substring(0, 10)}...`);

      // 2. Wallet desde private key
      if (this.wallet) {
        console.log("\n🔑 Wallet desde private key:");
        console.log(`   Address: ${this.wallet.address}`);
        
        const balance = await this.provider.getBalance(this.wallet.address);
        console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
      }

      // 3. Firmar mensaje
      const message = "Hola desde SSwap!";
      const signedMessage = await randomWallet.signMessage(message);
      console.log(`\n✍️  Mensaje firmado: ${signedMessage.substring(0, 20)}...`);

      // 4. Verificar firma
      const recoveredAddress = ethers.verifyMessage(message, signedMessage);
      console.log(`🔍 Dirección recuperada: ${recoveredAddress}`);
      console.log(`✅ Firma válida: ${recoveredAddress === randomWallet.address}`);

      console.log("");

    } catch (error) {
      console.error("❌ Error en ejemplos de wallets:", error.message);
    }
  }

  // Ejemplos de Utilidades (módulo 4)
  async ejemplosUtilidades() {
    console.log("🛠️ EJEMPLOS DE UTILIDADES\n");

    try {
      // 1. Conversiones Ether/Wei
      const etherAmount = "1.5";
      const weiAmount = ethers.parseEther(etherAmount);
      console.log(`💱 ${etherAmount} ETH = ${weiAmount.toString()} Wei`);

      const backToEther = ethers.formatEther(weiAmount);
      console.log(`💱 ${weiAmount.toString()} Wei = ${backToEther} ETH`);

      // 2. Conversiones de unidades
      const gweiAmount = ethers.parseUnits("20", "gwei");
      console.log(`⛽ 20 Gwei = ${gweiAmount.toString()} Wei`);

      // 3. Hash de mensaje
      const message = "SSwap Protocol";
      const messageHash = ethers.hashMessage(message);
      console.log(`🔗 Hash del mensaje "${message}": ${messageHash.substring(0, 20)}...`);

      // 4. Generar address de contrato
      const deployerAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const nonce = 0;
      const contractAddress = ethers.getContractAddress({
        from: deployerAddress,
        nonce: nonce
      });
      console.log(`🏗️ Address de contrato (nonce ${nonce}): ${contractAddress}`);

      // 5. Formatear direcciones
      const address = process.env.TOKEN_A_ADDRESS;
      console.log(`📍 Address: ${ethers.getAddress(address)}`); // Checksum

      console.log("");

    } catch (error) {
      console.error("❌ Error en ejemplos de utilidades:", error.message);
    }
  }

  // Ejemplos de Contratos (módulo 4)
  async ejemplosContratos() {
    console.log("📄 EJEMPLOS DE CONTRATOS\n");

    try {
      // 1. Llamadas de solo lectura
      console.log("📖 Llamadas de solo lectura:");
      const tokenName = await this.contracts.tokenA.name();
      const tokenSymbol = await this.contracts.tokenA.symbol();
      const totalSupply = await this.contracts.tokenA.totalSupply();
      
      console.log(`   Token: ${tokenName} (${tokenSymbol})`);
      console.log(`   Supply total: ${ethers.formatEther(totalSupply)} ${tokenSymbol}`);

      // 2. Consultar balances
      if (this.wallet) {
        const balance = await this.contracts.tokenA.balanceOf(this.wallet.address);
        console.log(`   Balance wallet: ${ethers.formatEther(balance)} ${tokenSymbol}`);
      }

      // 3. Información del pool
      console.log("\n🏊‍♂️ Información del pool:");
      const reserves = await this.contracts.simpleSwap.getReserves(
        process.env.TOKEN_A_ADDRESS,
        process.env.TOKEN_B_ADDRESS
      );
      console.log(`   Reserva TokenA: ${ethers.formatEther(reserves[0])} TKA`);
      console.log(`   Reserva TokenB: ${ethers.formatEther(reserves[1])} TKB`);

      // 4. Estimación de gas para transacciones
      if (this.wallet) {
        console.log("\n⛽ Estimaciones de gas:");
        
        try {
          const gasEstimate = await this.contracts.tokenA.connect(this.wallet).mint.estimateGas(
            this.wallet.address,
            ethers.parseEther("100")
          );
          console.log(`   Mint 100 tokens: ${gasEstimate.toString()} gas`);
        } catch (error) {
          console.log(`   Mint: No permitido (no eres owner)`);
        }
      }

      // 5. Eventos históricos
      console.log("\n📋 Consultando eventos...");
      const filter = this.contracts.tokenA.filters.Transfer();
      const events = await this.contracts.tokenA.queryFilter(filter, -10); // Últimos 10 bloques
      console.log(`   Eventos Transfer encontrados: ${events.length}`);

      console.log("");

    } catch (error) {
      console.error("❌ Error en ejemplos de contratos:", error.message);
    }
  }

  // Ejemplo de transacción completa
  async ejemploTransaccion() {
    if (!this.wallet) {
      console.log("⚠️  Necesitas configurar PRIVATE_KEY para ejemplos de transacciones\n");
      return;
    }

    console.log("💸 EJEMPLO DE TRANSACCIÓN\n");

    try {
      // 1. Preparar transacción de transferencia de ETH
      const toAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Vitalik
      const value = ethers.parseEther("0.001"); // 0.001 ETH

      // 2. Estimar gas
      const gasEstimate = await this.provider.estimateGas({
        to: toAddress,
        value: value
      });
      console.log(`⛽ Gas estimado: ${gasEstimate.toString()}`);

      // 3. Obtener gas price
      const gasPrice = await this.provider.getGasPrice();
      console.log(`💰 Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`);

      // 4. Calcular costo total
      const totalCost = gasEstimate * gasPrice + value;
      console.log(`💵 Costo total: ${ethers.formatEther(totalCost)} ETH`);

      // 5. Verificar balance
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`👛 Balance actual: ${ethers.formatEther(balance)} ETH`);

      if (balance < totalCost) {
        console.log("❌ Balance insuficiente para la transacción\n");
        return;
      }

      console.log("✅ Balance suficiente - Se podría enviar la transacción");
      console.log("💡 Para enviar realmente, descomenta el código de envío\n");

      // Descomenta para enviar realmente:
      /*
      const tx = await this.wallet.sendTransaction({
        to: toAddress,
        value: value,
        gasLimit: gasEstimate,
        gasPrice: gasPrice
      });
      
      console.log(`📝 Transacción enviada: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Transacción confirmada en bloque ${receipt.blockNumber}`);
      */

    } catch (error) {
      console.error("❌ Error en ejemplo de transacción:", error.message);
    }
  }

  // Función principal que ejecuta todos los ejemplos
  async ejecutarTodosLosEjemplos() {
    await this.ejemplosProviders();
    await this.ejemplosWallets();
    await this.ejemplosUtilidades();
    await this.ejemplosContratos();
    await this.ejemploTransaccion();
  }
}

// Función demo principal
async function demoEthersjs() {
  console.log("📚 ETHERS.JS TOOLKIT - EJEMPLOS DEL MÓDULO 4");
  console.log("=".repeat(55) + "\n");

  const toolkit = new EthersToolkit();
  await toolkit.initialize();
  await toolkit.ejecutarTodosLosEjemplos();

  console.log("✅ ¡Todos los ejemplos de ethers.js completados!");
}

module.exports = {
  EthersToolkit,
  demoEthersjs
};

// Si se ejecuta directamente
if (require.main === module) {
  demoEthersjs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
