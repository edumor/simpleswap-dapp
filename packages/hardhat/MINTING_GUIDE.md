# 🪙 Token Minting y Pool Management Scripts

Este directorio contiene scripts para mintear tokens y gestionar pools de liquidez en SimpleSwap. Los scripts te permiten crear pools con liquidez visible en las direcciones de los contratos.

## 📁 Scripts Disponibles

### 1. `mintTokensAndCreatePool.ts` - Script Completo
**Comando**: `npm run mint-and-pool`

✨ **Qué hace:**
- Despliega nuevos contratos TokenA, TokenB y SimpleSwap
- Mintea tokens a múltiples direcciones (deployer, user1, user2)
- Crea un pool inicial con liquidez
- Muestra balances y direcciones de contratos

🎯 **Úsalo cuando:**
- Quieras empezar desde cero
- Necesites desplegar y configurar todo de una vez
- Quieras un pool funcionando rápidamente

### 2. `mintTokensOnly.ts` - Solo Minting
**Comando**: `npm run mint-tokens`

✨ **Qué hace:**
- Despliega TokenA y TokenB (si no existen)
- Mintea tokens a múltiples direcciones
- Muestra balances finales de todos los usuarios
- No crea pools (solo distribuye tokens)

🎯 **Úsalo cuando:**
- Solo necesites distribuir tokens
- Quieras testear balances antes de crear pools
- Necesites más tokens para usuarios existentes

### 3. `manageExistingContracts.ts` - Gestión de Contratos Existentes
**Comando**: `npm run manage-contracts`

✨ **Qué hace:**
- Conecta a contratos ya deployados
- Mintea tokens adicionales
- Agrega liquidez a pools existentes
- Gestiona proporciones de liquidez automáticamente

🎯 **Úsalo cuando:**
- Ya tengas contratos deployados
- Quieras agregar más liquidez a un pool existente
- Necesites mintear más tokens para testing

## 🚀 Guía de Uso Rápida

### Opción 1: Empezar desde Cero
```bash
# Navegar al directorio hardhat
cd packages/hardhat

# Crear todo desde cero (recomendado para empezar)
npm run mint-and-pool
```

### Opción 2: Solo Mintear Tokens
```bash
# Solo distribuir tokens sin crear pool
npm run mint-tokens
```

### Opción 3: Trabajar con Contratos Existentes
```bash
# 1. Editar el archivo scripts/manageExistingContracts.ts
# 2. Configurar las direcciones de tus contratos:
# CONTRACT_ADDRESSES = {
#   TokenA: "0x...", 
#   TokenB: "0x...",
#   SimpleSwap: "0x..."
# }
# 3. Ejecutar:
npm run manage-contracts
```

## ⚙️ Configuración

### Script 1: mintTokensAndCreatePool.ts
- **Mint Amount**: 10,000 tokens por usuario
- **Pool Liquidity**: 5,000 tokens de cada tipo
- **Recipients**: deployer, user1, user2

### Script 2: mintTokensOnly.ts
- **Mint Amount**: 10,000 tokens por usuario (configurable)
- **Number of Users**: 5 usuarios (configurable)
- **Includes**: Faucet functions para usuarios normales

### Script 3: manageExistingContracts.ts
- **Mint Amount**: 5,000 tokens por usuario (configurable)
- **Liquidity Amount**: 2,000 tokens (configurable)
- **Requires**: Direcciones de contratos existentes

## 🔧 Personalización

### Cambiar Cantidades de Minting
Edita las siguientes constantes en cada script:

```typescript
// mintTokensAndCreatePool.ts
const mintAmount = ethers.parseEther("10000"); // Cambiar aquí

// mintTokensOnly.ts  
const MINT_AMOUNT = ethers.parseEther("10000"); // Cambiar aquí

// manageExistingContracts.ts
const CONFIG = {
  MINT_AMOUNT: "5000", // Cambiar aquí
  LIQUIDITY_AMOUNT: "2000" // Cambiar aquí
};
```

### Agregar Direcciones Específicas
En `manageExistingContracts.ts`:

```typescript
const CONFIG = {
  // ...
  TARGET_ADDRESSES: [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    // Agregar más direcciones aquí
  ]
};
```

## 📊 Output Esperado

Todos los scripts muestran:
- ✅ Direcciones de contratos deployados
- 💰 Balances de tokens por dirección
- 🏊 Información de pools (si aplica)
- 📈 Supply total de tokens
- 📍 Direcciones para verificación en block explorer

### Ejemplo de Output:
```
🚀 Starting token minting and pool creation process...
📋 Deployer address: 0x...
📋 User1 address: 0x...

📦 Deploying contracts...
✅ TokenA deployed at: 0x...
✅ TokenB deployed at: 0x...
✅ SimpleSwap deployed at: 0x...

💰 Minting tokens to addresses...
✅ Minted 10000.0 TokenA to deployer
✅ Minted 10000.0 TokenB to deployer

🏊 Adding initial liquidity to the pool...
✅ Added 5000.0 TokenA and 5000.0 TokenB to the pool

📊 Final token balances:
Deployer - TokenA: 5000.0 TKA
Deployer - TokenB: 5000.0 TKB
Pool (SimpleSwap) - TokenA: 5000.0 TKA
Pool (SimpleSwap) - TokenB: 5000.0 TKB
```

## 🛠️ Troubleshooting

### Error: "Property 'addLiquidity' does not exist"
- ✅ Los scripts usan la sintaxis correcta de TypeChain
- ✅ Ejecuta `npm run compile` primero

### Error: "Insufficient funds"
- 🔧 Asegúrate de tener ETH suficiente para gas
- 🔧 Reduce las cantidades de minting si es necesario

### Error: "Contract not found"
- 🔧 Verifica las direcciones de contratos en `manageExistingContracts.ts`
- 🔧 Asegúrate de estar en la red correcta

### Error: "Execution reverted"
- 🔧 Verifica que el deployer sea owner de los tokens
- 🔧 Revisa que los contratos no estén pausados

## 🎯 Casos de Uso

### Para Testing
```bash
# Crear un entorno de testing completo
npm run mint-and-pool

# Después hacer swaps de testing
npx hardhat test
```

### Para Demostración
```bash
# Crear múltiples usuarios con tokens
npm run mint-tokens

# Verificar balances en block explorer usando las direcciones mostradas
```

### Para Desarrollo Continuo
```bash
# Agregar más liquidez a pool existente
# 1. Configurar direcciones en manageExistingContracts.ts
# 2. Ejecutar:
npm run manage-contracts
```

## 📝 Notas Importantes

1. **Gas Costs**: Cada script consume gas para deployments y transacciones
2. **Network**: Asegúrate de estar en la red correcta (local/testnet)
3. **Permissions**: El deployer debe ser owner para mintear cantidades grandes
4. **Slippage**: Los scripts incluyen protección contra slippage del 5%
5. **Deadlines**: Se configuran automáticamente 1 hora desde el bloque actual

## 🔗 Funciones Auxiliares

### TokenA/TokenB Features
- **faucet()**: Cualquier usuario puede obtener 1000 tokens
- **mint()**: Owner puede mintear cualquier cantidad, usuarios hasta 1 token
- **burn()**: Función de quemar tokens disponible

### SimpleSwap Features  
- **addLiquidity()**: Agregar liquidez al pool
- **removeLiquidity()**: Remover liquidez del pool
- **swapExactTokensForTokens()**: Hacer swaps entre tokens
- **getReserves()**: Consultar reservas del pool

¡Con estos scripts puedes crear fácilmente pools con liquidez visible para testing y demostración! 🎉
