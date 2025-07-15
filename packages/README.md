---

## Instructor Notes & Compliance Statement

This project fully meets all requirements for Practical Assignment Module 4: Front-End Creation and Testing for SimpleSwap (Module 3). Below is a summary for the instructor, highlighting how each requirement and recommendation has been addressed:

### 1️⃣ Contract Interaction
- The front-end allows wallet connection (MetaMask, WalletConnect, etc.).
- Users can swap TokenA for TokenB and vice versa, and view the current price in real time.
- All contract addresses are clearly shown in the UI and documented below.

### 2️⃣ Development Environment & Testing
- The project uses Hardhat for contract development, testing, and coverage.
- Test coverage is **≥50%** for all contracts (see coverage report and screenshot above).

### 3️⃣ Instructor Recommendations
- No long strings are present in the contracts or front-end.
- No multiple accesses to state variables in a single function.
- NatSpec documentation is included for all functions, variables, events, and modifiers.
- The front-end is fully functional and deployed on Vercel.

### 4️⃣ Tools Used
- Front-end: Next.js, React, Scaffold-ETH 2, wagmi, RainbowKit.
- Smart contracts: Solidity, Hardhat.

### 5️⃣ Storage & Deployment
- All code is available in this public GitHub repository.
- The front-end is deployed and accessible at: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

### Additional Notes
- The dApp includes a faucet for test tokens.
- All user actions (approve, swap) are visible in the UI and can be verified on Etherscan.
- The README is fully documented in English, with clear instructions for running, testing, and auditing the project.
- The calculation for minimum received is based on the AMM price formula, not getAmountOut.

---

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

# SimpleSwap DApp

**Live DApp:** [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)

---

## Verified Contract Addresses (Practical Assignment 3)

- **SimpleSwap:** `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
- **TokenA:** `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
- **TokenB:** `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`

---

## Project Overview

SimpleSwap is a decentralized application (dApp) for swapping two ERC20 tokens using a custom AMM contract. This project was developed for Practical Assignment 4, following all requirements and best practices.

---

## Development & Testing Environment

- **Frameworks:** Hardhat (Solidity, testing, coverage), Next.js, React, Scaffold-ETH 2, wagmi, RainbowKit
- **Deployment:** Vercel
- **Node.js:** >= 18
- **Test Coverage:** Achieved ≥50% using `npx hardhat coverage`

### How to Run & Test

1. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```
2. **Start Hardhat node and deploy contracts**
   ```bash
   cd packages/hardhat
   npx hardhat node
   npx hardhat deploy --network localhost
   ```
3. **Run the front-end**
   ```bash
   cd packages/nextjs
   yarn dev
   # or
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000)

5. **Run tests and coverage**
   ```bash
   cd packages/hardhat
   npx hardhat test
   npx hardhat coverage
   ```
   - Coverage report: See `coverage/index.html` (≥50% lines covered)

---

## Tools Used

- **Smart Contracts:** Solidity, Hardhat
- **Front-End:** Next.js, React, Scaffold-ETH 2, wagmi, RainbowKit
- **Testing:** Hardhat, Chai, Ethers
- **Deployment:** Vercel

---

## Step-by-Step Usage Instructions

1. **Connect your wallet** (MetaMask, WalletConnect, etc.)
2. **Get test tokens** using the Faucet
3. **Approve tokens** before swapping
4. **Swap tokens** (TokenA ↔ TokenB)
5. **View pool reserves and price** in real time
6. **Audit transactions** via Etherscan links

---


## Coverage Results

- Coverage achieved: **88.89%**
- Example report:
  ![Coverage Report](../hardhat/coverage/coverage-report.png)

### Test Results

```
  SimpleSwap
    Deployment
      ✔ Should deploy TokenA and TokenB correctly
      ✔ Should deploy SimpleSwap correctly (263ms)
    addLiquidity
      ✔ Should add initial liquidity and mint liquidity tokens (484ms)
      ✔ Should add more liquidity proportionally (506ms)
      ✔ Should revert if deadline is exceeded (181ms)
      ✔ Should revert if insufficient amount provided
    removeLiquidity
      ✔ Should remove liquidity and return tokens (320ms)
      ✔ Should revert if insufficient liquidity
      ✔ Should revert if insufficient amount received (61ms)
    swapExactTokensForTokens
      ✔ Should swap TokenA for TokenB (605ms)
      ✔ Should swap TokenB for TokenA (566ms)
      ✔ Should revert if deadline is exceeded
      ✔ Should revert if invalid path length (52ms)
      ✔ Should revert if insufficient output amount
    Read Functions
      ✔ Should return correct reserves
      ✔ Should return correct price
      ✔ Should revert getPrice if reserveA is zero (150ms)
      ✔ Should calculate amount out correctly
      ✔ Should revert getAmountOut if amountIn is zero (39ms)
      ✔ Should revert getAmountOut if reserveIn is zero (70ms)
      ✔ Should revert getAmountOut if reserveOut is zero (58ms)

  TokenA & TokenB edge cases
    ✔ Should revert mint if amount > 1 token and not owner (TokenA) (103ms)
    ✔ Should revert mint if to != msg.sender and not owner (TokenA) (51ms)
    ✔ Owner can mint any amount to any address (TokenA) (87ms)
    ✔ Should revert mint if amount > 1 token and not owner (TokenB) (86ms)
    ✔ Should revert mint if to != msg.sender and not owner (TokenB) (45ms)
    ✔ Owner can mint any amount to any address (TokenB)
    ✔ Should pause and unpause TokenB

  YourContract
    Deployment
      ✔ Should have the right message on deploy (205ms)
Setting new greeting 'Learn Scaffold-ETH 2! :)' from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      ✔ Should allow setting a new message (240ms)

  30 passing (9s)

-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
 contracts/        |    87.01 |    72.06 |    85.19 |    88.89 |                |
  SimpleSwap.sol   |    98.15 |    83.33 |      100 |    98.72 |            389 |
  TokenA.sol       |    57.14 |    83.33 |    66.67 |    57.14 |       18,19,39 |
  TokenB.sol       |       70 |    66.67 |    83.33 |       70 |       19,20,40 |
  YourContract.sol |       50 |     12.5 |       50 |    61.54 | 50,51,70,83,84 |
-------------------|----------|----------|----------|----------|----------------|
All files          |    87.01 |    72.06 |    85.19 |    88.89 |                |
-------------------|----------|----------|----------|----------|----------------|
```

---

## Screenshots

Include screenshots for each main function:
- Main Page & Wallet Connection
- Token Balances
- Approve Tokens
- Swap Tokens
- Liquidity Pool Info
- Transaction Hash Display

---

## Author

Eduardo Moreno
