const { ethers } = require("hardhat");
require("dotenv").config();

// Direcciones de los contratos desplegados
const SIMPLE_SWAP_ADDRESS = process.env.SIMPLE_SWAP_ADDRESS;
const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS;
const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS;

class ContractManager {
    constructor() {
        this.tokenA = null;
        this.tokenB = null;
        this.simpleSwap = null;
        this.signer = null;
    }

    async initialize() {
        // Obtener el signer (la wallet que ejecutará las transacciones)
        const [signer] = await ethers.getSigners();
        this.signer = signer;

        // Conectar a los contratos
        const TokenA = await ethers.getContractFactory("TokenA");
        const TokenB = await ethers.getContractFactory("TokenB");
        const SimpleSwap = await ethers.getContractFactory("SimpleSwap");

        this.tokenA = TokenA.attach(TOKEN_A_ADDRESS);
        this.tokenB = TokenB.attach(TOKEN_B_ADDRESS);
        this.simpleSwap = SimpleSwap.attach(SIMPLE_SWAP_ADDRESS);

        console.log(`🔗 Conectado como: ${await signer.getAddress()}`);
        console.log(`💰 Balance ETH: ${ethers.formatEther(await signer.provider.getBalance(signer.address))} ETH\n`);
    }

    async getTokenInfo() {
        console.log("📊 Información de tokens:");
        console.log(`   TokenA (${await this.tokenA.symbol()}): ${TOKEN_A_ADDRESS}`);
        console.log(`   TokenB (${await this.tokenB.symbol()}): ${TOKEN_B_ADDRESS}\n`);
    }

    async getBalances(address = null) {
        const addr = address || await this.signer.getAddress();
        console.log(`💼 Balances para ${addr}:`);
        
        const balanceA = await this.tokenA.balanceOf(addr);
        const balanceB = await this.tokenB.balanceOf(addr);
        
        console.log(`   TokenA: ${ethers.formatEther(balanceA)} TKA`);
        console.log(`   TokenB: ${ethers.formatEther(balanceB)} TKB\n`);
        
        return { balanceA, balanceB };
    }

    async getPoolInfo() {
        console.log("🏊‍♂️ Información del pool:");
        try {
            const reserves = await this.simpleSwap.getReserves(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
            console.log(`   Reserva TokenA: ${ethers.formatEther(reserves[0])} TKA`);
            console.log(`   Reserva TokenB: ${ethers.formatEther(reserves[1])} TKB`);
            
            if (reserves[0] > 0 && reserves[1] > 0) {
                const price = await this.simpleSwap.getPrice(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, ethers.parseEther("1"));
                console.log(`   Precio: 1 TKA = ${ethers.formatEther(price)} TKB`);
            }
            console.log("");
            return reserves;
        } catch (error) {
            console.log("   ⚠️  Pool vacío o no inicializado\n");
            return [0n, 0n];
        }
    }

    // Función para mintear tokens (solo si eres owner)
    async mintTokens(tokenAddress, to, amount) {
        console.log(`🏦 Minteando ${ethers.formatEther(amount)} tokens...`);
        try {
            const token = tokenAddress === TOKEN_A_ADDRESS ? this.tokenA : this.tokenB;
            const symbol = await token.symbol();
            
            const tx = await token.mint(to, amount);
            console.log(`   📝 Transacción enviada: ${tx.hash}`);
            
            await tx.wait();
            console.log(`   ✅ ¡${ethers.formatEther(amount)} ${symbol} minteados exitosamente!\n`);
            
            return tx;
        } catch (error) {
            console.error(`   ❌ Error al mintear: ${error.message}\n`);
            throw error;
        }
    }

    // Función para aprobar tokens
    async approveToken(tokenAddress, spender, amount) {
        const token = tokenAddress === TOKEN_A_ADDRESS ? this.tokenA : this.tokenB;
        const symbol = await token.symbol();
        
        console.log(`🔐 Aprobando ${ethers.formatEther(amount)} ${symbol} para ${spender}...`);
        
        try {
            const tx = await token.approve(spender, amount);
            await tx.wait();
            console.log(`   ✅ Aprobación exitosa!\n`);
            return tx;
        } catch (error) {
            console.error(`   ❌ Error en aprobación: ${error.message}\n`);
            throw error;
        }
    }

    // Función para agregar liquidez
    async addLiquidity(amountA, amountB, minAmountA = null, minAmountB = null) {
        console.log(`🏊‍♂️ Agregando liquidez: ${ethers.formatEther(amountA)} TKA + ${ethers.formatEther(amountB)} TKB...`);
        
        // Valores mínimos por defecto (95% del deseado)
        const minA = minAmountA || (amountA * 95n) / 100n;
        const minB = minAmountB || (amountB * 95n) / 100n;
        
        try {
            // Aprobar tokens primero
            await this.approveToken(TOKEN_A_ADDRESS, SIMPLE_SWAP_ADDRESS, amountA);
            await this.approveToken(TOKEN_B_ADDRESS, SIMPLE_SWAP_ADDRESS, amountB);
            
            // Agregar liquidez
            const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutos
            const tx = await this.simpleSwap.addLiquidity(
                TOKEN_A_ADDRESS,
                TOKEN_B_ADDRESS,
                amountA,
                amountB,
                minA,
                minB,
                await this.signer.getAddress(),
                deadline
            );
            
            console.log(`   📝 Transacción enviada: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`   ✅ ¡Liquidez agregada exitosamente!\n`);
            
            return receipt;
        } catch (error) {
            console.error(`   ❌ Error al agregar liquidez: ${error.message}\n`);
            throw error;
        }
    }

    // Función para hacer swap
    async swapTokens(tokenIn, tokenOut, amountIn, minAmountOut = null) {
        const symbolIn = tokenIn === TOKEN_A_ADDRESS ? "TKA" : "TKB";
        const symbolOut = tokenOut === TOKEN_A_ADDRESS ? "TKA" : "TKB";
        
        console.log(`🔄 Intercambiando ${ethers.formatEther(amountIn)} ${symbolIn} por ${symbolOut}...`);
        
        try {
            // Calcular amount out esperado
            const expectedOut = await this.simpleSwap.getAmountOut(amountIn, tokenIn, tokenOut);
            const minOut = minAmountOut || (expectedOut * 95n) / 100n; // 5% slippage
            
            console.log(`   📊 Esperado: ${ethers.formatEther(expectedOut)} ${symbolOut}`);
            console.log(`   📊 Mínimo: ${ethers.formatEther(minOut)} ${symbolOut}`);
            
            // Aprobar tokens
            await this.approveToken(tokenIn, SIMPLE_SWAP_ADDRESS, amountIn);
            
            // Realizar swap
            const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutos
            const path = [tokenIn, tokenOut];
            
            const tx = await this.simpleSwap.swapExactTokensForTokens(
                amountIn,
                minOut,
                path,
                await this.signer.getAddress(),
                deadline
            );
            
            console.log(`   📝 Transacción enviada: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`   ✅ ¡Swap exitoso!\n`);
            
            return receipt;
        } catch (error) {
            console.error(`   ❌ Error en swap: ${error.message}\n`);
            throw error;
        }
    }
}

// Funciones de ejemplo para usar el ContractManager
async function demo() {
    const manager = new ContractManager();
    await manager.initialize();
    
    console.log("🎯 DEMO - Interacción con contratos desplegados\n");
    
    // Mostrar información básica
    await manager.getTokenInfo();
    await manager.getBalances();
    await manager.getPoolInfo();
    
    console.log("💡 Para ejecutar operaciones, usa las funciones del ContractManager:");
    console.log("   - manager.mintTokens(tokenAddress, to, amount)");
    console.log("   - manager.addLiquidity(amountA, amountB)");
    console.log("   - manager.swapTokens(tokenIn, tokenOut, amountIn)");
    console.log("\n🔧 Ejemplo de uso en consola de Hardhat:");
    console.log('   const manager = require("./scripts/operations.js");');
    console.log('   await manager.demo();');
}

// Exportar para uso en consola
module.exports = {
    ContractManager,
    demo,
    SIMPLE_SWAP_ADDRESS,
    TOKEN_A_ADDRESS,
    TOKEN_B_ADDRESS
};

// Si se ejecuta directamente
if (require.main === module) {
    demo()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
