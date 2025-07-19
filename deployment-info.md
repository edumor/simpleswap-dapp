# 📋 Información de Deployment

## 🌐 Red: Sepolia Testnet

### 📍 Direcciones de Contratos Desplegados

| Contrato | Dirección | Etherscan |
|----------|-----------|-----------|
| **SimpleSwap** | `0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4` | [Ver en Etherscan](https://sepolia.etherscan.io/address/0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4) |
| **TokenA** | `0x4efc5e7af7851efB65871c0d54adaC154250126f` | [Ver en Etherscan](https://sepolia.etherscan.io/address/0x4efc5e7af7851efB65871c0d54adaC154250126f) |
| **TokenB** | `0x36ae80FDa8f67605aac4Dd723c70ce70513AB909` | [Ver en Etherscan](https://sepolia.etherscan.io/address/0x36ae80FDa8f67605aac4Dd723c70ce70513AB909) |

### 🔧 Configuración

- **Compilador**: Solidity v0.8.20
- **Optimización**: Habilitada (200 runs)
- **Licencia**: MIT
- **Red**: Sepolia (Chain ID: 11155111)

### 📊 Estado de Verificación

✅ **Todos los contratos están verificados en Etherscan**

- Código fuente disponible
- ABI disponible
- Bytecode coincidente

### 🚀 Comandos Útiles

```bash
# Compilar contratos
npx hardhat compile

# Interactuar con contratos desplegados
npx hardhat run scripts/interact.js --network sepolia

# Operaciones avanzadas
npx hardhat run scripts/operations.js --network sepolia

# Consola interactiva
npx hardhat console --network sepolia
```

### 🔗 Enlaces Útiles

- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Documentación Hardhat](https://hardhat.org/)

### 📝 Notas del Proyecto

- Los contratos están desplegados y funcionando correctamente
- TokenA y TokenB usan OpenZeppelin ERC20
- SimpleSwap implementa AMM sin fees
- Todos los contratos tienen NatSpec completo
- Optimización de gas implementada

### ⚙️ Variables de Entorno

Configurar en `.env`:
```
ETHERSCAN_API_KEY=FXA9KKVY9YWUY9CJ8ZBSE5CWIWMDMG7Q2H
SIMPLE_SWAP_ADDRESS=0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4
TOKEN_A_ADDRESS=0x4efc5e7af7851efB65871c0d54adaC154250126f
TOKEN_B_ADDRESS=0x36ae80FDa8f67605aac4Dd723c70ce70513AB909
```
