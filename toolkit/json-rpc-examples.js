/**
 * 🌐 JSON-RPC Examples
 * Ejemplos de uso directo de JSON-RPC como se enseña en el módulo 4
 */

const https = require('https');
require('dotenv').config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

// Función para hacer llamadas JSON-RPC directas
function makeJsonRpcCall(method, params = [], id = 1) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: id
    });

    const url = new URL(SEPOLIA_RPC_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Ejemplos del módulo 4
async function ejemplosJsonRpc() {
  console.log("🌐 EJEMPLOS JSON-RPC DEL MÓDULO 4\n");

  try {
    // 1. eth_chainId - Obtener ID de la blockchain
    console.log("1️⃣ Obteniendo Chain ID...");
    const chainId = await makeJsonRpcCall("eth_chainId");
    console.log(`   Chain ID: ${parseInt(chainId.result, 16)} (${chainId.result})\n`);

    // 2. eth_blockNumber - Número de bloque actual
    console.log("2️⃣ Obteniendo número de bloque actual...");
    const blockNumber = await makeJsonRpcCall("eth_blockNumber");
    console.log(`   Bloque actual: ${parseInt(blockNumber.result, 16)} (${blockNumber.result})\n`);

    // 3. eth_gasPrice - Precio actual del gas
    console.log("3️⃣ Obteniendo precio del gas...");
    const gasPrice = await makeJsonRpcCall("eth_gasPrice");
    const gasPriceGwei = parseInt(gasPrice.result, 16) / 1e9;
    console.log(`   Gas Price: ${gasPriceGwei.toFixed(2)} Gwei (${gasPrice.result})\n`);

    // 4. eth_getBalance - Balance de los contratos
    console.log("4️⃣ Obteniendo balances de contratos...");
    
    const balanceSimpleSwap = await makeJsonRpcCall("eth_getBalance", [
      process.env.SIMPLE_SWAP_ADDRESS, 
      "latest"
    ]);
    console.log(`   SimpleSwap: ${parseInt(balanceSimpleSwap.result, 16) / 1e18} ETH`);

    const balanceTokenA = await makeJsonRpcCall("eth_getBalance", [
      process.env.TOKEN_A_ADDRESS, 
      "latest"
    ]);
    console.log(`   TokenA: ${parseInt(balanceTokenA.result, 16) / 1e18} ETH`);

    const balanceTokenB = await makeJsonRpcCall("eth_getBalance", [
      process.env.TOKEN_B_ADDRESS, 
      "latest"
    ]);
    console.log(`   TokenB: ${parseInt(balanceTokenB.result, 16) / 1e18} ETH\n`);

    // 5. eth_getCode - Obtener código de contrato
    console.log("5️⃣ Verificando que son contratos (tienen código)...");
    const codeSimpleSwap = await makeJsonRpcCall("eth_getCode", [
      process.env.SIMPLE_SWAP_ADDRESS, 
      "latest"
    ]);
    console.log(`   SimpleSwap tiene código: ${codeSimpleSwap.result !== '0x' ? '✅ SÍ' : '❌ NO'}`);

    const codeTokenA = await makeJsonRpcCall("eth_getCode", [
      process.env.TOKEN_A_ADDRESS, 
      "latest"
    ]);
    console.log(`   TokenA tiene código: ${codeTokenA.result !== '0x' ? '✅ SÍ' : '❌ NO'}`);

    // 6. eth_getBlockByNumber - Información del bloque actual
    console.log("\n6️⃣ Información del bloque actual...");
    const block = await makeJsonRpcCall("eth_getBlockByNumber", ["latest", false]);
    if (block.result) {
      console.log(`   Hash: ${block.result.hash}`);
      console.log(`   Timestamp: ${new Date(parseInt(block.result.timestamp, 16) * 1000).toLocaleString()}`);
      console.log(`   Transacciones: ${block.result.transactions.length}`);
    }

    console.log("\n✅ ¡Ejemplos JSON-RPC completados!");

  } catch (error) {
    console.error("❌ Error en llamadas JSON-RPC:", error.message);
  }
}

// Función para demostrar diferencias entre JSON-RPC y ethers.js
async function compararConEthers() {
  console.log("\n" + "=".repeat(60));
  console.log("🔄 COMPARACIÓN: JSON-RPC vs Ethers.js");
  console.log("=".repeat(60));

  const { ethers } = require('ethers');
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

  try {
    // Comparar obtención de número de bloque
    console.log("\n📊 Obteniendo número de bloque:");
    
    // Con JSON-RPC directo
    const startJsonRpc = Date.now();
    const blockJsonRpc = await makeJsonRpcCall("eth_blockNumber");
    const timeJsonRpc = Date.now() - startJsonRpc;
    console.log(`   JSON-RPC: ${parseInt(blockJsonRpc.result, 16)} (${timeJsonRpc}ms)`);

    // Con ethers.js
    const startEthers = Date.now();
    const blockEthers = await provider.getBlockNumber();
    const timeEthers = Date.now() - startEthers;
    console.log(`   Ethers.js: ${blockEthers} (${timeEthers}ms)`);

    console.log("\n💡 Como puedes ver, ethers.js:");
    console.log("   ✅ Convierte automáticamente de hex a decimal");
    console.log("   ✅ Proporciona una API más simple");
    console.log("   ✅ Maneja errores de forma más elegante");
    console.log("   ✅ Abstrae la complejidad de JSON-RPC");

  } catch (error) {
    console.error("❌ Error en comparación:", error.message);
  }
}

// Función principal
async function demoJsonRpc() {
  await ejemplosJsonRpc();
  await compararConEthers();
}

module.exports = {
  makeJsonRpcCall,
  ejemplosJsonRpc,
  compararConEthers,
  demoJsonRpc
};

// Si se ejecuta directamente
if (require.main === module) {
  demoJsonRpc()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
