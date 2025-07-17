# SimpleSwap DApp

A decentralized exchange (DEX) application built with Scaffold-ETH 2, featuring an optimized automated market maker (AMM) for token swapping without fees.

## 🎯 Project Overview

This DApp implements a gas-optimized SimpleSwap contract that enables users to:
- Add/remove liquidity to token pairs
- Swap tokens using the constant product formula (x * y = k)
- View real-time prices and liquidity pool information
- Interact with ERC-20 tokens with faucet functionality

## 🚀 Deployed Contracts (Sepolia Testnet)

- **SimpleSwap**: `0x93Aa1766Cf4a79267634F2E8669a1c87518791c5`
- **TokenA**: `0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA`
- **TokenB**: `0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63`

###  Contract Verification Status| Contract | Address | Status | Symbol | Transactions | Etherscan ||----------|---------|--------|--------|--------------|-----------|| **SimpleSwap** |  |  Verified & Operational | - | Active | [View](https://sepolia.etherscan.io/address/0x93Aa1766Cf4a79267634F2E8669a1c87518791c5) || **TokenA** |  |  Verified & Operational | TKA | 2+ transactions | [View](https://sepolia.etherscan.io/address/0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA) || **TokenB** |  |  Verified & Operational | TKB | 2+ transactions | [View](https://sepolia.etherscan.io/address/0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63) |> ** Last Updated**: July 17, 2025  > ** Verification**: All contracts are verified on Etherscan and fully operational on Sepolia testnet  > ** Status**: Ready for production interaction with the frontend
### 🔗 Etherscan Links
- [SimpleSwap Contract](https://sepolia.etherscan.io/address/0x93Aa1766Cf4a79267634F2E8669a1c87518791c5)
- [TokenA Contract](https://sepolia.etherscan.io/address/0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA)
- [TokenB Contract](https://sepolia.etherscan.io/address/0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63)

## ✨ Key Features

### 🏗️ Smart Contract Architecture

#### Advanced Gas Optimization
- **Single Storage Access Pattern**: Each function performs only ONE storage read/write operation
- **Struct-Based Data Management**: `PairData` and `LocalPairData` structs minimize storage slots
- **Memory Caching**: All operations work in memory before committing to storage

#### Code Quality Standards
- **Complete NatSpec Documentation**: All functions, parameters, and returns documented in English
- **Short Error Messages**: Optimized error strings (`"expired"`, `"min amt"`, `"bad path"`, etc.)
- **Professional Code Structure**: Clean, readable, and maintainable code

### 🎨 Frontend Features
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Wallet Integration**: RainbowKit for seamless wallet connections
- **Real-time Data**: Live price feeds and liquidity information
- **Token Faucet**: Easy access to test tokens for development
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.20
- **OpenZeppelin**: Standard ERC-20 implementations
- **Gas Optimization**: Advanced storage access patterns

### Frontend
- **Next.js**: 15.2.3
- **React**: 19.0.0
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **DaisyUI**: Component library

### Web3 Integration
- **Wagmi**: 2.15.6 - React hooks for Ethereum
- **Viem**: 2.31.1 - TypeScript interface for Ethereum
- **RainbowKit**: 2.2.7 - Wallet connection UI

## 📋 How to Use

1. **Connect Wallet**: Use the connect button in the top-right corner
2. **Get Test Tokens**: Use the faucet to obtain TokenA and TokenB
3. **Approve Tokens**: Approve tokens for the SimpleSwap contract
4. **Check Prices**: View current exchange rates between tokens
5. **Add Liquidity**: Provide liquidity to earn from trades
6. **Swap Tokens**: Exchange between TokenA and TokenB

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm
- MetaMask or compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/edumor/simpleswap-dapp.git

# Navigate to the project
cd simpleswap-dapp/packages/nextjs

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Environment Setup

Create a `.env.local` file with:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## 📊 Contract Architecture

### Storage Optimization Pattern

```solidity
// 1. Load data ONCE
(LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(tokenA, tokenB);

// 2. Work in memory
data.reserveA += amountIn;
data.reserveB -= amountOut;

// 3. Save ONCE
_savePairData(hash, rev, data);
```

### Key Functions

#### Core Trading Functions
- `addLiquidity()` - Add liquidity to token pairs
- `removeLiquidity()` - Remove liquidity from pools
- `swapExactTokensForTokens()` - Execute token swaps

#### View Functions
- `getPrice()` - Get current token price
- `getReserves()` - Get pool reserves
- `getAmountOut()` - Calculate swap output

### Events
- `Swap` - Emitted on token swaps
- `LiquidityAction` - Emitted on liquidity changes

## 🔧 Development

### Scripts

```bash
# Development
yarn dev          # Start dev server
yarn build        # Build for production
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
yarn check-types  # TypeScript type checking
```

### Project Structure

```
packages/nextjs/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── TokenSwap.tsx      # Main swap interface
│   ├── TokenBalances.tsx  # Balance display
│   ├── TokenFaucet.tsx    # Token faucet
│   └── ...
├── contracts/             # Contract ABIs and addresses
│   ├── deployedContracts.ts
│   └── source/
│       └── SimpleSwap.sol # Contract source code
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── styles/               # CSS styles
```

## 🌐 Live Demo

- **Production**: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111

## 🔒 Security Considerations

- **Slippage Protection**: Minimum amount validations
- **Deadline Protection**: Time-based transaction expiry
- **Overflow Protection**: SafeMath-equivalent validations
- **Reentrancy Prevention**: State updates before external calls

## 📈 Gas Optimization Highlights

### Before vs After Optimization

| Function | Traditional Approach | Optimized Approach | Gas Saved |
|----------|---------------------|-------------------|-----------|
| Swap | Multiple storage reads | Single storage read | ~2,000 gas |
| Add Liquidity | Multiple storage writes | Single storage write | ~1,500 gas |
| Remove Liquidity | Separate state updates | Batched updates | ~1,200 gas |

### Key Optimizations

1. **Struct Packing**: Related data grouped in single storage slots
2. **Memory Caching**: Work in memory, commit once to storage
3. **Deterministic Hashing**: Consistent pair identification
4. **Short Error Messages**: Reduced deployment and execution costs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Eduardo Moreno**
- GitHub: [@edumor](https://github.com/edumor)
- Email: eduardomoreno2503@gmail.com

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://scaffoldeth.io/)
- Powered by [Ethereum](https://ethereum.org/)
- Deployed on [Vercel](https://vercel.com/)

---

⚡ **Live Demo**: [https://simpleswap-dapp-nextjs.vercel.app/](https://simpleswap-dapp-nextjs.vercel.app/)
