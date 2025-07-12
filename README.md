# SimpleSwap dApp

>A modern Scaffold-ETH 2 style dApp to interact with the SimpleSwap contract on Sepolia. Swap TokenA for TokenB and vice versa, check pool/user balances, and get token prices. Built with Vite, React, TypeScript, wagmi, RainbowKit, and TailwindCSS.

## Deployed Contracts (Sepolia)

- **SimpleSwap:** `0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18`
- **TokenA:** `0xa00dC451faB5B80145d636EeE6A9b794aA81D48C`
- **TokenB:** `0x99Cd59d18C1664Ae32baA1144E275Eee34514115`

---

## 1. Project Overview

This dApp allows users to:

- Connect their wallet (RainbowKit + wagmi)
- Swap TokenA for TokenB and vice versa
- Approve tokens for swapping
- Query the price of one token in terms of the other
- View pool and user balances for both tokens

---

## 2. How to Use (Assignment Requirement)

> **Requirement:** Develop a front-end that allows interaction with the SimpleSwap contract. The front-end must connect a wallet and enable functions to swap TokenA for TokenB and vice versa, as well as obtain the price of one token in terms of the other.

### Steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dApp locally:**
   ```bash
   npm run dev
   ```

3. **Connect your wallet:**
   - Use the "Connect Wallet" button (top right). Make sure your wallet is set to Sepolia.

4. **Swap tokens:**
   - Select the token to swap (TokenA or TokenB).
   - Enter the amount (in wei).
   - If needed, click "Approve" to allow the contract to spend your tokens.
   - Click "Swap" to execute the swap.

5. **Query price:**
   - Enter an amount and click "Check Price" to see how much of the other token you would receive.

6. **View balances:**
   - Pool and user balances for both tokens are displayed in the UI.

---

## 3. Development Environment & Testing

This project uses **Hardhat** for smart contract development and testing. The contract and tests are located in the `/hardhat` directory.

### Running Tests

```bash
cd hardhat
npm install
npx hardhat test
```

### Coverage

```bash
npx hardhat coverage
```

> **Note:** You must achieve at least 50% coverage for the SimpleSwap contract to meet the assignment requirements.

---

## 4. Project Structure

```
Scaffold-ETH 2/
├── src/
│   ├── App.tsx         # Main dApp UI and logic
│   └── abi/            # Contract ABIs (SimpleSwap, TokenA, TokenB)
├── hardhat/
│   ├── contracts/      # Solidity contracts
│   └── test/           # Hardhat tests
├── package.json        # Front-end dependencies
├── README.md           # This file
└── ...
```

---

## 5. Environment Variables

Create a `.env` file if you need to override default RPC endpoints or add API keys. Example:

```env
VITE_RPC_URL=your_sepolia_rpc_url
```

---

## 6. Technologies Used

- Vite + React + TypeScript
- wagmi + RainbowKit
- TailwindCSS
- Hardhat
- Ethers.js

---

## 7. License

MIT

---

## Development & Testing Box

> **Development & Testing:**
>
> - Use Hardhat for contract development and testing.
> - Run `npx hardhat test` to execute tests.
> - Run `npx hardhat coverage` to check test coverage (must be ≥ 50%).
> - Expand tests in `hardhat/test/SimpleSwap.test.js` to cover all contract logic.
> - Example test and contract templates are provided.
