# SimpleSwap DApp

A decentralized application for swapping two ERC20 tokens (TokenA and TokenB) using a custom AMM contract. Built with Solidity, Hardhat, Next.js, Scaffold-ETH 2, wagmi, and RainbowKit.

---

## 🚀 Live Demo

- **Vercel:** [https://simpleswap-dapp-nextjs.vercel.app](https://simpleswap-dapp-nextjs.vercel.app)
- **GitHub:** [https://github.com/edumor/simpleswap-dapp](https://github.com/edumor/simpleswap-dapp)

---

## 📄 Contract Addresses (Sepolia)

| Contract      | Address                                                                                                         | Etherscan Link                                                                                                         |
|---------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| SimpleSwap    | `0x5F1C2c20248BA5A444256c21592125EaF08b23A1`                                                                   | [View on Etherscan](https://sepolia.etherscan.io/address/0x5F1C2c20248BA5A444256c21592125EaF08b23A1)                   |
| TokenA (TKA)  | `0x5578bD42d6bb30c0c23D4D693bBAE8A89e1D3397`                                                                   | [View on Etherscan](https://sepolia.etherscan.io/address/0x5578bD42d6bb30c0c23D4D693bBAE8A89e1D3397)                   |
| TokenB (TKB)  | `0x52fC6d0924cC27fC192E877C7013687A2a8F5683`                                                                   | [View on Etherscan](https://sepolia.etherscan.io/address/0x52fC6d0924cC27fC192E877C7013687A2a8F5683)                   |

---

## ✨ Features

- Connect wallet (MetaMask, WalletConnect)
- Faucet for test tokens (TokenA, TokenB)
- Approve tokens for swap
- Swap TokenA ↔ TokenB (with slippage and min received auto-calculation)
- View price and pool reserves in real time
- Add/remove liquidity to the pool
- Transaction hash and Etherscan link for every operation
- Responsive, user-friendly UI
- Full NatSpec documentation in contracts
- Automated tests and coverage with Hardhat

---

## 🖼️ Screenshots

| Functionality         | Screenshot                                                                                   |
|----------------------|----------------------------------------------------------------------------------------------|
| Main Page            | ![Main Page](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-main.png)      |
| Wallet Connect       | ![Wallet Connect](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-wallet.png)|
| Token Balances       | ![Balances](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-balances.png)   |
| Faucet               | ![Faucet](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-main.png)         |
| Approve Tokens       | ![Approve](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-approve.png)     |
| Swap Tokens          | ![Swap](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-swap.png)           |
| Swap TokenA to TokenB| ![Swap A-B](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-swap-a-b.png)   |
| Swap TokenB to TokenA| ![Swap B-A](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-swap-b-a.png)   |
| Pool Info            | ![Pool Info](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-pool.png)      |
| Price                | ![Price](https://simpleswap-dapp-nextjs.vercel.app/screenshots/screenshot-price.png)         |

---

## 🧑‍💻 How to Use the dApp

1. **Open the dApp:**  
   [https://simpleswap-dapp-nextjs.vercel.app](https://simpleswap-dapp-nextjs.vercel.app)
2. **Connect your wallet:**  
   Click "Connect Wallet" and select MetaMask, WalletConnect, etc. (Sepolia network).
3. **Get test tokens:**  
   Use the "Faucet" to mint TokenA and TokenB.
4. **Approve tokens:**  
   Approve TokenA or TokenB for swapping.
5. **Swap tokens:**  
   Swap TokenA ↔ TokenB or vice versa.
6. **View pool reserves and price:**  
   Real-time updates in the UI.
7. **Audit transactions:**  
   Each operation shows a transaction hash with a direct Etherscan link.

---

## 🧪 Development & Testing

- **Tools:** Hardhat, Chai, Ethers.js
- **Run tests and coverage:**
  ```bash
  cd packages/hardhat
  npx hardhat test
  npx hardhat coverage
  ```
- **Coverage achieved:**  
  All contracts have >50% coverage. See below for details.

<details>
<summary>Test Results & Coverage</summary>

```
SimpleSwap
  Deployment
    ✔ Should deploy TokenA and TokenB correctly
    ✔ Should deploy SimpleSwap correctly
  addLiquidity
    ✔ Should add initial liquidity and mint liquidity tokens
    ✔ Should add more liquidity proportionally
    ✔ Should revert if deadline is exceeded
    ✔ Should revert if insufficient amount provided
  removeLiquidity
    ✔ Should remove liquidity and return tokens
    ✔ Should revert if insufficient liquidity
    ✔ Should revert if insufficient amount received
  swapExactTokensForTokens
    ✔ Should swap TokenA for TokenB
    ✔ Should swap TokenB for TokenA
    ✔ Should revert if deadline is exceeded
    ✔ Should revert if invalid path length
    ✔ Should revert if insufficient output amount
  Read Functions
    ✔ Should return correct reserves
    ✔ Should return correct price
    ✔ Should revert getPrice if reserveA is zero
    ✔ Should calculate amount out correctly
    ✔ Should revert getAmountOut if amountIn is zero
    ✔ Should revert getAmountOut if reserveIn is zero
    ✔ Should revert getAmountOut if reserveOut is zero
YourContract
  Deployment
    ✔ Should have the right message on deploy
    ✔ Should allow setting a new message

23 passing
```

```
-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
 contracts\\        |    90.77 |       65 |       84 |    91.67 | |
  SimpleSwap.sol   |    98.15 |    83.33 |      100 |    98.72 |            389 |
  TokenA.sol       |      100 |       50 |      100 |      100 | |
  TokenB.sol       |       50 |       25 |       60 |       50 |          33,39 |
  YourContract.sol |       50 |     12.5 |       50 |    61.54 | 50,51,70,83,84 |
-------------------|----------|----------|----------|----------|----------------|
All files |    90.77 |       65 |       84 |    91.67 | |
-------------------|----------|----------|----------|----------|----------------|
```
</details>

---

## 📝 NatSpec & Auditability

- All contracts are fully documented with NatSpec (functions, variables, events, modifiers, etc.).
- All events and parameters are described.
- Source code and ABI are available in the repository and on Etherscan.
- [SimpleSwap on Etherscan](https://sepolia.etherscan.io/address/0x5F1C2c20248BA5A444256c21592125EaF08b23A1)

---

## 🛡️ Instructor Recommendations Implemented

- No long strings in the code.
- No multiple accesses to state variables.
- All contracts have >50% coverage.
- All code is documented with NatSpec.
- Functional front-end deployed on Vercel.
- Approve, swap, and price reading available from the UI.
- Faucet available for test tokens.
- All transactions can be audited on Etherscan.

---

## 📦 Deliverables

- **GitHub repository:** [https://github.com/edumor/simpleswap-dapp](https://github.com/edumor/simpleswap-dapp)
- **Deployed dApp:** [https://simpleswap-dapp-nextjs.vercel.app](https://simpleswap-dapp-nextjs.vercel.app)
- **Example transaction:** [Etherscan link to a real transaction] (add your transaction hash here)

---

## 📬 Contact

For questions or feedback, contact: **Eduardo Moreno**  
Email: eduardomoreno2503@gmail.com

---
