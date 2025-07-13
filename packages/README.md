# SimpleSwap DApp – Practical Assignment (Module 3)

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

## Author
Eduardo Moreno

---

## Capturas de pantalla y pruebas funcionales

Consulta el archivo [`README-capturas.md`](./README-capturas.md) para ver capturas de pantalla y el detalle de todas las pruebas funcionales realizadas sobre el despliegue en Vercel.
