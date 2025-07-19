const { ethers } = require("hardhat");
require("dotenv").config();

// Direcciones de los contratos desplegados
const SIMPLE_SWAP_ADDRESS = process.env.SIMPLE_SWAP_ADDRESS;
const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS;
const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS;

async function main() {
    console.log("🚀 Conectando a los contratos desplegados en Sepolia...\n");

    // Obtener las instancias de los contratos
    const TokenA = await ethers.getContractFactory("TokenA");
    const TokenB = await ethers.getContractFactory("TokenB");
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");

    const tokenA = TokenA.attach(TOKEN_A_ADDRESS);
    const tokenB = TokenB.attach(TOKEN_B_ADDRESS);
    const simpleSwap = SimpleSwap.attach(SIMPLE_SWAP_ADDRESS);

    console.log("📋 Direcciones de contratos:");
    console.log(`📍 SimpleSwap: ${SIMPLE_SWAP_ADDRESS}`);
    console.log(`📍 TokenA: ${TOKEN_A_ADDRESS}`);
    console.log(`📍 TokenB: ${TOKEN_B_ADDRESS}\n`);

    try {
        // Obtener información básica de los tokens
        console.log("🔍 Información de TokenA:");
        const nameA = await tokenA.name();
        const symbolA = await tokenA.symbol();
        const decimalsA = await tokenA.decimals();
        console.log(`   Nombre: ${nameA}`);
        console.log(`   Símbolo: ${symbolA}`);
        console.log(`   Decimales: ${decimalsA}\n`);

        console.log("🔍 Información de TokenB:");
        const nameB = await tokenB.name();
        const symbolB = await tokenB.symbol();
        const decimalsB = await tokenB.decimals();
        console.log(`   Nombre: ${nameB}`);
        console.log(`   Símbolo: ${symbolB}`);
        console.log(`   Decimales: ${decimalsB}\n`);

        // Verificar si hay liquidez en el pool
        console.log("💧 Verificando liquidez en SimpleSwap...");
        try {
            const reserves = await simpleSwap.getReserves(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
            console.log(`   Reserva TokenA: ${ethers.formatEther(reserves[0])} ${symbolA}`);
            console.log(`   Reserva TokenB: ${ethers.formatEther(reserves[1])} ${symbolB}\n`);
        } catch (error) {
            console.log("   ⚠️  No hay liquidez en este par aún\n");
        }

        // Verificar precio si hay liquidez
        try {
            const price = await simpleSwap.getPrice(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, ethers.parseEther("1"));
            console.log(`💰 Precio: 1 ${symbolA} = ${ethers.formatEther(price)} ${symbolB}\n`);
        } catch (error) {
            console.log("💰 No se puede obtener precio (sin liquidez)\n");
        }

        console.log("✅ ¡Conexión exitosa con todos los contratos!");

    } catch (error) {
        console.error("❌ Error al interactuar con los contratos:");
        console.error(error.message);
    }
}

// Función para obtener el balance de una wallet
async function checkBalance(walletAddress) {
    if (!walletAddress) {
        console.log("⚠️  No se proporcionó dirección de wallet");
        return;
    }

    console.log(`\n🔍 Verificando balances para: ${walletAddress}`);
    
    const TokenA = await ethers.getContractFactory("TokenA");
    const TokenB = await ethers.getContractFactory("TokenB");
    
    const tokenA = TokenA.attach(TOKEN_A_ADDRESS);
    const tokenB = TokenB.attach(TOKEN_B_ADDRESS);

    try {
        const balanceA = await tokenA.balanceOf(walletAddress);
        const balanceB = await tokenB.balanceOf(walletAddress);
        
        console.log(`   TokenA: ${ethers.formatEther(balanceA)} TKA`);
        console.log(`   TokenB: ${ethers.formatEther(balanceB)} TKB`);
    } catch (error) {
        console.error("❌ Error al verificar balances:", error.message);
    }
}

// Función principal con manejo de argumentos
async function runScript() {
    await main();
    
    // Si se proporciona una dirección como argumento, verificar balance
    const walletAddress = process.argv[2];
    if (walletAddress) {
        await checkBalance(walletAddress);
    } else {
        console.log("\n💡 Tip: Ejecuta el script con una dirección para ver balances:");
        console.log("   npx hardhat run scripts/interact.js --network sepolia 0xTU_DIRECCION");
    }
}

runScript()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
