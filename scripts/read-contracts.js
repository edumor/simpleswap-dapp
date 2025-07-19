const { ethers } = require("hardhat");
require("dotenv").config();

// Direcciones de los contratos desplegados
const SIMPLE_SWAP_ADDRESS = process.env.SIMPLE_SWAP_ADDRESS;
const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS;
const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS;

// ABIs simplificados para las funciones que necesitamos
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function totalSupply() view returns (uint256)"
];

const SIMPLE_SWAP_ABI = [
    "function getReserves(address tokenA, address tokenB) view returns (uint256, uint256)",
    "function getPrice(address tokenA, address tokenB, uint256 amountIn) view returns (uint256)",
    "function getAmountOut(uint256 amountIn, address tokenIn, address tokenOut) view returns (uint256)",
    "function pairs(bytes32) view returns (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity)"
];

async function main() {
    console.log("🚀 Conectando a los contratos desplegados en Sepolia...\n");

    try {
        // Crear provider directo
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        
        // Crear instancias de contratos con provider de solo lectura
        const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, ERC20_ABI, provider);
        const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, ERC20_ABI, provider);
        const simpleSwap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI, provider);

        console.log("📋 Direcciones de contratos:");
        console.log(`📍 SimpleSwap: ${SIMPLE_SWAP_ADDRESS}`);
        console.log(`📍 TokenA: ${TOKEN_A_ADDRESS}`);
        console.log(`📍 TokenB: ${TOKEN_B_ADDRESS}\n`);

        // Obtener información de TokenA
        console.log("🔍 Información de TokenA:");
        const nameA = await tokenA.name();
        const symbolA = await tokenA.symbol();
        const decimalsA = await tokenA.decimals();
        const totalSupplyA = await tokenA.totalSupply();
        
        console.log(`   Nombre: ${nameA}`);
        console.log(`   Símbolo: ${symbolA}`);
        console.log(`   Decimales: ${decimalsA}`);
        console.log(`   Supply Total: ${ethers.formatEther(totalSupplyA)} ${symbolA}\n`);

        // Obtener información de TokenB
        console.log("🔍 Información de TokenB:");
        const nameB = await tokenB.name();
        const symbolB = await tokenB.symbol();
        const decimalsB = await tokenB.decimals();
        const totalSupplyB = await tokenB.totalSupply();
        
        console.log(`   Nombre: ${nameB}`);
        console.log(`   Símbolo: ${symbolB}`);
        console.log(`   Decimales: ${decimalsB}`);
        console.log(`   Supply Total: ${ethers.formatEther(totalSupplyB)} ${symbolB}\n`);

        // Verificar liquidez en el pool
        console.log("💧 Verificando liquidez en SimpleSwap...");
        try {
            const reserves = await simpleSwap.getReserves(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
            
            if (reserves[0] > 0 || reserves[1] > 0) {
                console.log(`   Reserva ${symbolA}: ${ethers.formatEther(reserves[0])} ${symbolA}`);
                console.log(`   Reserva ${symbolB}: ${ethers.formatEther(reserves[1])} ${symbolB}`);
                
                // Calcular ratio si ambas reservas > 0
                if (reserves[0] > 0 && reserves[1] > 0) {
                    const ratio = Number(ethers.formatEther(reserves[1])) / Number(ethers.formatEther(reserves[0]));
                    console.log(`   Ratio: 1 ${symbolA} = ${ratio.toFixed(6)} ${symbolB}`);
                    
                    // Obtener precio para 1 token
                    try {
                        const price = await simpleSwap.getPrice(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, ethers.parseEther("1"));
                        console.log(`   Precio exacto: 1 ${symbolA} = ${ethers.formatEther(price)} ${symbolB}`);
                    } catch (priceError) {
                        console.log(`   ⚠️  No se pudo obtener precio exacto`);
                    }
                }
                console.log("");
            } else {
                console.log("   ⚠️  Pool vacío - no hay liquidez\n");
            }
        } catch (error) {
            console.log("   ⚠️  No se pudo acceder al pool o pool no inicializado\n");
        }

        console.log("✅ ¡Conexión exitosa con todos los contratos!");
        
        // Verificar si se proporcionó una dirección para balance
        const walletAddress = process.argv[2];
        if (walletAddress) {
            console.log("\n" + "=".repeat(50));
            await checkBalance(tokenA, tokenB, walletAddress, symbolA, symbolB);
        } else {
            console.log("\n💡 Tip: Ejecuta el script con una dirección para ver balances:");
            console.log("   npx hardhat run scripts/read-contracts.js --network sepolia 0xTU_DIRECCION");
        }

    } catch (error) {
        console.error("❌ Error al conectar con los contratos:");
        console.error(error.message);
        console.error("\n🔧 Verifica que:");
        console.error("   - Las direcciones de contratos son correctas");
        console.error("   - La RPC de Sepolia funciona");
        console.error("   - Los contratos están desplegados");
    }
}

async function checkBalance(tokenA, tokenB, walletAddress, symbolA, symbolB) {
    console.log(`🔍 Verificando balances para: ${walletAddress}`);
    
    try {
        const balanceA = await tokenA.balanceOf(walletAddress);
        const balanceB = await tokenB.balanceOf(walletAddress);
        
        console.log(`   ${symbolA}: ${ethers.formatEther(balanceA)} ${symbolA}`);
        console.log(`   ${symbolB}: ${ethers.formatEther(balanceB)} ${symbolB}`);
        
        if (balanceA > 0 || balanceB > 0) {
            console.log("   ✅ Wallet tiene tokens!");
        } else {
            console.log("   ⚠️  Wallet sin tokens - necesita mintear o recibir tokens");
        }
    } catch (error) {
        console.error("❌ Error al verificar balances:", error.message);
    }
}

// Función auxiliar para mostrar información resumida
async function quickInfo() {
    console.log("⚡ INFO RÁPIDA DE CONTRATOS DESPLEGADOS\n");
    console.log(`🔗 Red: Sepolia Testnet (Chain ID: 11155111)`);
    console.log(`🌐 RPC: ${process.env.SEPOLIA_RPC_URL}\n`);
    console.log("📍 Direcciones:");
    console.log(`   SimpleSwap: ${SIMPLE_SWAP_ADDRESS}`);
    console.log(`   TokenA:     ${TOKEN_A_ADDRESS}`);
    console.log(`   TokenB:     ${TOKEN_B_ADDRESS}\n`);
    console.log("🔗 Enlaces Etherscan:");
    console.log(`   SimpleSwap: https://sepolia.etherscan.io/address/${SIMPLE_SWAP_ADDRESS}`);
    console.log(`   TokenA:     https://sepolia.etherscan.io/address/${TOKEN_A_ADDRESS}`);
    console.log(`   TokenB:     https://sepolia.etherscan.io/address/${TOKEN_B_ADDRESS}\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
