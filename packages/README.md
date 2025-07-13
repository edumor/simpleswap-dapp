# SimpleSwap DApp – Practical Assignment (Module 3)

---

## Guía rápida para el evaluador/docente

Para probar la dApp directamente en producción (Vercel):

1. **Abre la aplicación:**
   - [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

2. **Conecta tu wallet:**
   - Haz clic en “Conectar Billetera” (arriba a la derecha).
   - Selecciona MetaMask, WalletConnect u otra opción compatible.
   - Asegúrate de estar en la red donde están desplegados los contratos (ver direcciones abajo).

3. **Obtén tokens de prueba (si está habilitado el faucet):**
   - Usa la sección “Faucet” para obtener TokenA y TokenB en tu wallet.

4. **Aprueba el uso de tokens:**
   - En la sección “Approve”, selecciona el token y la cantidad.
   - Haz clic en “Approve” y confirma la transacción en tu wallet.

5. **Realiza un swap:**
   - En la sección “Swap”, elige la dirección (TokenA → TokenB o viceversa).
   - Ingresa la cantidad y haz clic en “Swap”.
   - Confirma la transacción en tu wallet.

6. **Consulta precios y pool:**
   - Observa el precio actual y la información del pool de liquidez en la interfaz.

7. **Verifica en Etherscan:**
   - Tras cada transacción, haz clic en el hash que aparece en pantalla para ver los detalles en Etherscan.

Así puedes validar todas las funcionalidades, la integración con la wallet y la transparencia de las operaciones en la blockchain, directamente desde el deploy en Vercel, sin necesidad de instalar nada localmente.

## Overview
This project implements a decentralized application (dApp) for token swapping using a custom AMM contract (`SimpleSwap`) and two ERC20 tokens (`TokenA` and `TokenB`). The solution includes:
- Smart contracts (Solidity, Hardhat)
- A modern front-end (Next.js, Scaffold-ETH 2, wagmi, RainbowKit)
- Full wallet integration and user-friendly UI
- Automated tests and coverage

---

## Contract Addresses (Deployed for Module 3)
- **SimpleSwap:** `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
- **TokenA:** `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
- **TokenB:** `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`

---


## Live Demo

You can interact with the deployed dApp here:

**https://simpleswap-dapp-nextjs.vercel.app/**

---

## Step-by-Step: How to Use the Front-End

1. **Open the dApp**
   - Go to [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

2. **Connect Your Wallet**
   - Click the **Connect Wallet** button at the top right.
   - Select your preferred wallet (MetaMask, WalletConnect, etc.) and approve the connection.

3. **Get Test Tokens (Optional)**
   - Use the **Faucet** section to mint test TokenA or TokenB to your wallet for demo purposes.

4. **Approve Token**
   - Before swapping, you must approve the SimpleSwap contract to spend your tokens.
   - In the **Approve** section:
     - Select the token you want to swap (TokenA or TokenB).
     - Enter the amount to approve.
     - Click **Approve** and confirm the transaction in your wallet.
    - **¿Qué monto ingresar?**
      - Ingresa el monto en unidades decimales (por ejemplo, 1, 10, 100), no en wei.
      - La dApp convierte automáticamente el valor a wei (la unidad mínima del token) antes de enviarlo al contrato.
      - Si el token tiene 18 decimales (como la mayoría de los ERC20), 1 token = 1 000 000 000 000 000 000 (1e18) wei.
      - Ejemplo: Si quieres aprobar 10 TokenA, escribe “10” en el campo de monto. La dApp enviará 10 000 000 000 000 000 000 wei al contrato.
      - Puedes aprobar exactamente el monto que vas a intercambiar, o un poco más si prefieres no repetir el approve en cada swap.

5. **Swap Tokens**
   - In the **Swap** section:
     - Select the direction (TokenA → TokenB or TokenB → TokenA).
     - Enter the amount to swap.
     - Set your desired slippage tolerance (default: 1%).
     - The minimum amount to receive will be calculated automatically.
     - Click **Swap** and confirm the transaction in your wallet.

6. **View Price and Pool Info**
   - The UI displays the current price and liquidity pool reserves in real time.

7. **Done!**
   - You can repeat the process, swap in both directions, and explore all features.

---

## How to Run Locally

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
2. **Start Hardhat node and deploy contracts:**
   ```bash
   cd packages/hardhat
   npx hardhat node
   npx hardhat deploy --network localhost
   ```
3. **Run the front-end:**
   ```bash
   cd packages/nextjs
   yarn dev
   # or
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Coverage

- The project uses Hardhat for testing and coverage.
- To run tests and check coverage:
  ```bash
  cd packages/hardhat
  npx hardhat test
  npx hardhat coverage
  ```
- **Coverage achieved:** >50% (see `coverage/` folder for detailed report)

---

## Features Implemented
- Connect wallet (RainbowKit, wagmi)
- Approve tokens for swap
- Swap TokenA ↔ TokenB (with slippage and min received auto-calculation)
- View price and pool reserves
- Faucet for test tokens
- Responsive, user-friendly UI
- Full NatSpec documentation in contracts
- Test coverage ≥ 50%

---

## Instructor Notes
- All contract addresses are declared above.
- The UI guides the user through every required step: connect, approve, swap, and view info.
- The codebase is clean, well-documented, and ready for review.
- For any questions, contact: eduardomoreno2503@gmail.com

---

## Verification
- All contracts are verified and source code is available in the repository.
- To verify on a block explorer, use the provided source and ABI files in `artifacts/`.

---

## Interacción con Etherscan

La dApp SimpleSwap facilita la auditoría y seguimiento de las operaciones en la blockchain mediante enlaces directos a Etherscan:

- **Contratos desplegados:**
  - [SimpleSwap en Etherscan](https://etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18)
  - [TokenA en Etherscan](https://etherscan.io/address/0xa00dC451faB5B80145d636EeE6A9b794aA81D48C)
  - [TokenB en Etherscan](https://etherscan.io/address/0x99Cd59d18C1664Ae32baA1144E275Eee34514115)

- **Transacciones:**
  - Cada vez que realizas un swap o apruebas tokens, la interfaz muestra el hash de la transacción con un enlace directo a Etherscan para su consulta y verificación.

- **Cómo usarlo:**
  1. Realiza cualquier operación (swap, approve) desde la dApp.
  2. Al finalizar, haz clic en el hash de la transacción que aparece en pantalla.
  3. Se abrirá Etherscan mostrando todos los detalles de la operación, permitiendo auditar el resultado y el estado en la red.

Esto garantiza transparencia y confianza, permitiendo a cualquier usuario o evaluador verificar el funcionamiento real del sistema en la blockchain pública.
 
**Ejemplo visual:**

![Hash de transacción en la UI](https://simpleswap-dapp.vercel.app/screenshot-txhash.png)

```
Transacción enviada: 
0x1234abcd...5678efgh
Ver en Etherscan
```

Al hacer clic en "Ver en Etherscan", se abre la página de la transacción en el block explorer, mostrando todos los detalles y confirmaciones.

---

## Author
Eduardo Moreno

---

## Capturas de pantalla y pruebas funcionales

Consulta el archivo [`README-capturas.md`](./README-capturas.md) para ver capturas de pantalla y el detalle de todas las pruebas funcionales realizadas sobre el despliegue en Vercel.
