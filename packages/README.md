
## Example Screenshots (Latest UI)

Below are updated screenshots for each main screen and feature:

### 1. Main Page & Wallet Connection
Shows the dApp welcome, wallet connect, and contract addresses.
![Main Page](https://simpleswap-dapp.vercel.app/screenshot-main.png)

### 2. Token Balances
Displays the connected user's TokenA and TokenB balances.
![Token Balances](https://simpleswap-dapp.vercel.app/screenshot-balances.png)

### 3. Approve Tokens
Approve the contract to spend your tokens before swapping.
![Approve](https://simpleswap-dapp.vercel.app/screenshot-approve.png)

### 4. Swap Tokens
Form to swap TokenA for TokenB or vice versa, with amount and slippage settings.
![Swap](https://simpleswap-dapp.vercel.app/screenshot-swap.png)

### 5. Liquidity Pool Info
Shows pool reserves, contract addresses, and calculated price.
![Liquidity Pool](https://simpleswap-dapp.vercel.app/screenshot-pool.png)

### 6. Transaction Hash Display
After each action, the dApp shows the transaction hash and a link to Etherscan.
![Transaction Hash](https://simpleswap-dapp.vercel.app/screenshot-txhash.png)


## Important Note on Amounts and Decimals

All token amounts in the dApp are handled in wei, which is the smallest unit according to the token's decimals (usually 18 decimals for ERC20 tokens). The UI allows you to enter values in decimal format (e.g., "1" for 1 token), but all contract interactions use the correct wei value under the hood. This ensures there is no confusion:

- **Example:** If you enter "1" in the amount field, the dApp will send 1e18 wei to the contract for a token with 18 decimals.
- **Always enter amounts as decimals in the UI.**
- **All balances and pool values are displayed in human-readable decimal format.**
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


## Project Overview
SimpleSwap is a decentralized application (dApp) for swapping two ERC20 tokens (TokenA and TokenB) using a custom AMM contract. The project includes:
- Smart contracts (Solidity, Hardhat)
- Modern front-end (Next.js, Scaffold-ETH 2, wagmi, RainbowKit)
## SimpleSwap DApp – Practical Assignment (Module 3)

### Project Overview
SimpleSwap is a decentralized application (dApp) for swapping two ERC20 tokens (TokenA and TokenB) using a custom AMM contract. The project includes:
- Smart contracts (Solidity, Hardhat)
- Modern front-end (Next.js, Scaffold-ETH 2, wagmi, RainbowKit)
- Full wallet integration and user-friendly UI
- Automated tests and coverage (Hardhat)

### Contract Addresses (Sepolia)
- **SimpleSwap:** `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
- **TokenA:** `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
- **TokenB:** `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`

### Live Demo
Interact with the deployed dApp: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

### Usage Instructions
1. **Connect your wallet** (MetaMask, WalletConnect, etc.)
2. **Get test tokens** using the Faucet (if available)
3. **Approve tokens** before swapping
4. **Swap tokens** in either direction
5. **View pool reserves and price** in real time
6. **Audit transactions** via Etherscan links

### Amounts and Decimals
All token amounts in the dApp are handled in wei (the smallest unit, usually 18 decimals for ERC20 tokens). Enter values in decimal format (e.g., "1" for 1 token); the dApp converts to wei automatically for contract interactions. All balances and pool values are displayed in human-readable decimal format.

### Development & Testing Environment
- Node.js >= 18
- Hardhat
- Yarn or npm

#### Local Setup
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


#### Testing & Coverage
- The project uses Hardhat for testing and coverage.
- To run tests and check coverage:
  ```bash
  cd packages/hardhat
  npx hardhat test
  npx hardhat coverage
  ```
- **Coverage achieved:** ≥50% (see `coverage/` folder for detailed report)

##### Example Coverage Report
Below is an example screenshot of the coverage report generated by Hardhat:

![Coverage Report Example](../hardhat/coverage/index.png)

Open the `coverage/index.html` file in your browser for a detailed interactive report after running `npx hardhat coverage`.

### Features Implemented
- Connect wallet (RainbowKit, wagmi)
- Approve tokens for swap
- Swap TokenA ↔ TokenB (with slippage and min received auto-calculation)
- View price and pool reserves
- Faucet for test tokens
- Responsive, user-friendly UI
- Full NatSpec documentation in contracts
- Test coverage ≥ 50%

### Example Screenshots
See [`README-capturas.md`](./README-capturas.md) for screenshots and details of all functional tests performed on the Vercel deployment.

### Author
Eduardo Moreno
## Development & Testing Environment
