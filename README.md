

# SimpleSwap DApp

Decentralized application (dApp) for swapping two ERC20 tokens (TokenA and TokenB) using a custom AMM contract. Includes smart contracts (Solidity, Hardhat), modern front-end (Next.js, Scaffold-ETH 2, wagmi, RainbowKit), wallet integration, and automated tests.

---

## Features
- Connect wallet (RainbowKit, wagmi)
- Approve tokens for swap
- Swap TokenA ↔ TokenB (with slippage and min received auto-calculation)
- View price and pool reserves
- Faucet for test tokens
- Responsive, user-friendly UI
- Full NatSpec documentation in contracts
- Test coverage ≥ 50%

---

## Contract Addresses (Sepolia)
## 🚀 Contract Deployments

### 🎯 **SimpleSwap Contract (Main AMM)**
| Property | Value |
|----------|-------|
| **Contract Address** | [`0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`](https://sepolia.etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18) |
| **Type** | AMM Contract |
| **Network** | Sepolia Testnet |
| **Compiler** | Solidity v0.8.20 |
| **Optimization** | Enabled (200 runs) |
| **License** | MIT |
| **Verification Status** | ✅ [Verified on Etherscan](https://sepolia.etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18#code) |
| **Purpose** | Main AMM implementation |

### 🪙 **TokenA (Test Token)**
| Property | Value |
|----------|-------|
| **Contract Address** | [`0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`](https://sepolia.etherscan.io/address/0xa00dC451faB5B80145d636EeE6A9b794aA81D48C) |
| **Type** | ERC20 Token |
| **Network** | Sepolia Testnet |
| **Symbol** | TKA |
| **Verification Status** | ✅ [Verified on Etherscan](https://sepolia.etherscan.io/address/0xa00dC451faB5B80145d636EeE6A9b794aA81D48C#code) |
| **Purpose** | Test token for AMM operations |

### 🪙 **TokenB (Test Token)**
| Property | Value |
|----------|-------|
| **Contract Address** | [`0x99Cd59d18C1664Ae32baA1144E275Eee34514115`](https://sepolia.etherscan.io/address/0x99Cd59d18C1664Ae32baA1144E275Eee34514115) |
| **Type** | ERC20 Token |
| **Network** | Sepolia Testnet |
| **Symbol** | TKB |
| **Verification Status** | ✅ [Verified on Etherscan](https://sepolia.etherscan.io/address/0x99Cd59d18C1664Ae32baA1144E275Eee34514115#code) |
| **Purpose** | Test token for AMM operations |

## 📋 Contract Verification
Successfully verified by the official verifier contract:
- **Verifier Contract**: [`0x9f8f02dab384dddf1591c3366069da3fb0018220`](https://sepolia.etherscan.io/address/0x9f8f02dab384dddf1591c3366069da3fb0018220)
- **Verification Transaction**: [`0xa20b46207cb1448d5cf9986551738b275e0bb04e59e2c4c405302d04db911611`](https://sepolia.etherscan.io/tx/0xa20b46207cb1448d5cf9986551738b275e0bb04e59e2c4c405302d04db911611)
- **Verification Status**: ✅ **PASSED** - All tests completed successfully
- **Verification Date**: July 5, 2025

## Live Demo
Interact with the deployed dApp: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

---

## How to Use
1. **Open the dApp**: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)
2. **Connect your wallet** (MetaMask, WalletConnect, etc.)
3. **Get test tokens** using the Faucet (if needed)
4. **Approve tokens** before swapping (enter the amount in wei)
5. **Swap tokens** in either direction (TokenA ↔ TokenB, enter the amount in wei)
6. **View pool reserves and price** in real time
7. **Audit transactions** via Etherscan links (the dApp shows the transaction hash after each action)

---

## Development & Testing

### Requirements
- Node.js >= 18
- Hardhat
- Yarn or npm

### Local Setup
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

### Testing & Coverage
- The project uses Hardhat for testing and coverage.
- To run tests and check coverage:
  ```bash
  cd packages/hardhat
  npx hardhat test
  npx hardhat coverage
  ```
- **Coverage achieved:** ≥50% (see `coverage/` folder for detailed report)

---

## Screenshots
Main features of the dApp:


![Main Page](./packages/nextjs/public/screenshots/screenshot-main.png)
![Wallet Connect](./packages/nextjs/public/screenshots/screenshot-wallet.png)
![Token Balances](./packages/nextjs/public/screenshots/screenshot-balances.png)
![Faucet](./packages/nextjs/public/screenshots/screenshot-main.png)
![Approve](./packages/nextjs/public/screenshots/screenshot-approve.png)
![Swap](./packages/nextjs/public/screenshots/screenshot-swap.png)
![Swap TokenA to TokenB](./packages/nextjs/public/screenshots/screenshot-swap-a-b.png)
![Swap TokenB to TokenA](./packages/nextjs/public/screenshots/screenshot-swap-b-a.png)
![Pool Info](./packages/nextjs/public/screenshots/screenshot-pool.png)
![Price](./packages/nextjs/public/screenshots/screenshot-price.png)
![Transaction Hash](./packages/nextjs/public/screenshots/screenshot-txhash.png)

---


## Etherscan Integration

The SimpleSwap dApp makes it easy to audit and track blockchain operations with direct links to Etherscan:

- **Deployed contracts:**
  - [SimpleSwap on Etherscan](https://etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18)
  - [TokenA on Etherscan](https://etherscan.io/address/0xa00dC451faB5B80145d636EeE6A9b794aA81D48C)
  - [TokenB on Etherscan](https://etherscan.io/address/0x99Cd59d18C1664Ae32baA1144E275Eee34514115)
- **Transactions:**
  - Every time you perform a swap or approve tokens, the interface displays the transaction hash with a direct link to Etherscan for review and verification.

**Visual example:**

![Transaction hash in the UI](https://simpleswap-dapp.vercel.app/screenshot-txhash.png)

```
Transaction sent:
0x1234abcd...5678efgh
View on Etherscan
```

---

## Author
Eduardo Moreno

---


## Screenshots and Functional Tests

See the file [`README-capturas.md`](./README-capturas.md) for screenshots and details of all functional tests performed on the Vercel deployment.

---

## Important Note on Amounts (Wei)

All token amounts in the dApp must now be entered in **wei**, which is the smallest unit according to the token's decimals (usually 18 decimals for ERC20 tokens). The UI requires you to enter values in wei (e.g., "1000000000000000000" for 1 token with 18 decimals). All contract interactions use the value you provide directly, so make sure to enter the correct amount in wei.

- **Example:** If you want to approve or swap 1 token (with 18 decimals), enter `1000000000000000000` in the amount field.
- **Always enter amounts in wei in the UI.**
- **All balances and pool values are displayed in human-readable decimal format, but inputs must be in wei.**
## Example Screenshots for Practical Requirements

Below are screenshots demonstrating each main requirement:

### 1. Wallet Connection
Shows the wallet connect modal and successful connection.
![Wallet Connect](https://simpleswap-dapp.vercel.app/screenshot-wallet.png)

### 2. Swap TokenA → TokenB
User swaps TokenA for TokenB using the swap form.
![Swap TokenA to TokenB](https://simpleswap-dapp.vercel.app/screenshot-swap-a-b.png)

### 3. Swap TokenB → TokenA
User swaps TokenB for TokenA using the swap form.
![Swap TokenB to TokenA](https://simpleswap-dapp.vercel.app/screenshot-swap-b-a.png)

### 4. Price Display
The UI shows the current price of TokenA in terms of TokenB and vice versa, updated in real time.
![Price Display](https://simpleswap-dapp.vercel.app/screenshot-price.png)


# SimpleSwap DApp – Practical Assignment (Module 3)

---

## Project Overview
SimpleSwap is a decentralized application (dApp) for swapping two ERC20 tokens (TokenA and TokenB) using a custom AMM contract. The project includes:
- Smart contracts (Solidity, Hardhat)
- Modern front-end (Next.js, Scaffold-ETH 2, wagmi, RainbowKit)
- Full wallet integration and user-friendly UI
- Automated tests and coverage (Hardhat)

---

## Contract Addresses (Sepolia)
- **SimpleSwap:** `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
- **TokenA:** `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
- **TokenB:** `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`

---

## Live Demo
Interact with the deployed dApp:
**https://simpleswap-dapp-nextjs.vercel.app/**

---

## Instructor/User Guide: How to Evaluate the dApp

1. **Open the dApp**
   - Go to [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

2. **Connect your wallet**
   - Click "Connect Wallet" (top right).
   - Select MetaMask, WalletConnect, etc.
   - Make sure your wallet is on the **Sepolia** network.

3. **Verify contract addresses**
   - The dApp is connected to:
     - TokenA: `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
     - TokenB: `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`
     - SimpleSwap: `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
   - These addresses are visible in the UI and/or codebase.

4. **Get test tokens (Faucet)**
   - Use the "Faucet" section to mint TokenA and TokenB to your wallet.

5. **View the liquidity pool**
   - The UI displays the current pool reserves for TokenA and TokenB.
   - If the pool is empty, a message will indicate no liquidity is available.
   - If there is liquidity, you will see the balances and the current price (e.g., 1 TokenA = 1 TokenB if balanced).

6. **Approve tokens**
   - In the "Approve" section, select the token and amount to approve.
   - Enter the amount in decimal units (e.g., 10, not in wei).
   - Click "Approve" and confirm in your wallet.

7. **Swap tokens**
   - In the "Swap" section, select TokenA → TokenB or vice versa.
   - Enter the amount to swap (must not exceed your balance or pool reserves).
   - Click "Swap" and confirm in your wallet.
   - The dApp will show the transaction hash and a link to Etherscan.

8. **Check real-time price and pool info**
   - The UI updates the price and pool reserves after each swap.

9. **Audit transactions**
   - After each operation, click the transaction hash to view details on Etherscan.

---

## Front-End Usage Instructions

1. **Connect your wallet** (MetaMask, WalletConnect, etc.)
2. **Get test tokens** using the Faucet (if available)
3. **Approve tokens** before swapping
4. **Swap tokens** in either direction
5. **View pool reserves and price** in real time
6. **Audit transactions** via Etherscan links

---

## Pool and Contract Info in the UI
- The dApp displays:
  - Pool reserves for TokenA and TokenB
  - Current price (TokenA/TokenB)
  - Contract addresses in use (visible in the UI or via the code)

---

## Development & Testing Environment

### Requirements
- Node.js >= 18
- Hardhat
- Yarn or npm

### Local Setup
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
- **Coverage achieved:** ≥50% (see `coverage/` folder for detailed report)

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

## Example Transaction Hash in the UI

After each swap or approve, the dApp displays the transaction hash and a direct link to Etherscan for auditing:

```
Transaction sent:
0x1234abcd...5678efgh
View on Etherscan
```

Clicking "View on Etherscan" opens the transaction details in the block explorer.

---


---

## Example Screenshots

Below are example screenshots of the main dApp features:

### Main Page
Shows the dApp title, wallet connect button, and navigation.
![Main Page](https://simpleswap-dapp.vercel.app/screenshot-main.png)

### Pool Info and Price
Displays current reserves for TokenA and TokenB, and the real-time price.
![Pool Info](https://simpleswap-dapp.vercel.app/screenshot-pool.png)

### Swap Tokens
Form to swap TokenA for TokenB or vice versa, with amount and slippage settings.
![Swap Form](https://simpleswap-dapp.vercel.app/screenshot-swap.png)

### Approve Tokens
Approve the contract to spend your tokens before swapping.
![Approve Form](https://simpleswap-dapp.vercel.app/screenshot-approve.png)

### Transaction Hash Display
After each action, the dApp shows the transaction hash and a link to Etherscan.
![Transaction Hash](https://simpleswap-dapp.vercel.app/screenshot-txhash.png)

---

## Author
Eduardo Moreno

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
    - **What amount should I enter?**
      - Enter the amount in decimal units (for example, 1, 10, 100), not in wei.
      - The dApp automatically converts the value to wei (the token's smallest unit) before sending it to the contract.
      - If the token has 18 decimals (like most ERC20), 1 token = 1 000 000 000 000 000 000 (1e18) wei.
      - Example: If you want to approve 10 TokenA, write “10” in the amount field. The dApp will send 10 000 000 000 000 000 000 wei to the contract.
      - You can approve exactly the amount you want to swap, or a bit more if you prefer not to repeat the approve for every swap.

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


## Etherscan Usage

The SimpleSwap dApp makes it easy to audit and track blockchain operations with direct links to Etherscan:

- **Deployed contracts:**
  - [SimpleSwap on Etherscan](https://etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18)
  - [TokenA on Etherscan](https://etherscan.io/address/0xa00dC451faB5B80145d636EeE6A9b794aA81D48C)
  - [TokenB on Etherscan](https://etherscan.io/address/0x99Cd59d18C1664Ae32baA1144E275Eee34514115)

- **Transactions:**
  - Every time you perform a swap or approve tokens, the interface displays the transaction hash with a direct link to Etherscan for review and verification.

- **How to use:**
  1. Perform any operation (swap, approve) from the dApp.
  2. When finished, click the transaction hash that appears on the screen.
  3. Etherscan will open showing all the details of the operation, allowing you to audit the result and status on the public network.

This ensures transparency and trust, allowing any user or reviewer to verify the real operation of the system on the public blockchain.

**Visual example:**

![Transaction hash in the UI](https://simpleswap-dapp.vercel.app/screenshot-txhash.png)

```
Transaction sent:
0x1234abcd...5678efgh
View on Etherscan
```

When you click "View on Etherscan", the transaction page opens in the block explorer, showing all details and confirmations.

---

## Author
Eduardo Moreno

---

## Capturas de pantalla y pruebas funcionales

Consulta el archivo [`README-capturas.md`](./README-capturas.md) para ver capturas de pantalla y el detalle de todas las pruebas funcionales realizadas sobre el despliegue en Vercel.
