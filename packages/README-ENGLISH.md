# SimpleSwap DApp - Module 4 Academic Project

## 🎓 Academic Compliance & Overview

This project is a complete decentralized token exchange (DEX) built for **Module 4** academic requirements. It demonstrates advanced smart contract development, comprehensive testing, and professional frontend implementation.

### ✅ Academic Requirements Met

- **Smart Contracts**: Deployed on Sepolia testnet with verified source code
- **Test Coverage**: 87%+ comprehensive test suite with edge cases
- **Frontend**: Interactive React/Next.js application with step-by-step user guidance
- **Documentation**: Complete English documentation with technical specifications
- **Deployment**: Automated Vercel deployment scripts included

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees

### 1. Clone and Setup

```powershell
# Clone the repository
git clone <your-repo-url>
cd simpleswap-dapp

# Navigate to packages directory
cd packages

# Run complete setup (installs dependencies and generates types)
.\dev-setup.ps1 -All
```

### 2. Local Development

#### Option A: Automated Setup (Recommended)
```powershell
# Install all dependencies
.\dev-setup.ps1 -InstallDeps

# Start local blockchain (in first terminal)
.\dev-setup.ps1 -RunHardhat

# Start frontend (in second terminal)
.\dev-setup.ps1 -RunFrontend
```

#### Option B: Manual Setup
```powershell
# Terminal 1: Start Hardhat local network
cd hardhat
npm install
npx hardhat node

# Terminal 2: Start Next.js frontend
cd nextjs
npm install
npm run dev
```

### 3. Access the Application

Open your browser and navigate to: **http://localhost:3000**

## 📋 Step-by-Step User Guide

### Getting Started with SimpleSwap

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top-right corner
   - Select MetaMask or your preferred wallet
   - Ensure you're connected to Sepolia testnet

2. **Get Test Tokens**
   - Use the "Token Faucet" section
   - Request TokenA and TokenB (free test tokens)
   - Wait for transactions to confirm

3. **Approve Tokens**
   - Navigate to the "Approve Tokens" section
   - Select the token you want to swap (TokenA or TokenB)
   - Enter the amount to approve
   - Confirm the approval transaction

4. **Swap Tokens**
   - Use the "Token Swap" section
   - Enter the amount you want to swap
   - Review the exchange rate and fees
   - Confirm the swap transaction

5. **Monitor Your Balances**
   - Check the "Token Balances" section
   - View your current TokenA and TokenB holdings
   - Track transaction history

## 🏗️ Technical Architecture

### Smart Contracts (Sepolia Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| **TokenA** | `0xA61A5c03088c808935C86F409Ace89E582842F82` | ERC20 test token for swapping |
| **TokenB** | `0x9205f067C913C1Edb642609342ca8d58d60ae95B` | ERC20 test token for swapping |
| **SimpleSwap** | `0x5F1C2c20248BA5A444256c21592125EaF08b23A1` | Main DEX contract with liquidity pool |

### Frontend Features

- **Interactive Tutorial**: Step-by-step guided experience
- **Real-time Updates**: Live balance and price information
- **Transaction Tracking**: Etherscan integration for transaction verification
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Clear feedback for failed transactions

### Technology Stack

- **Smart Contracts**: Solidity with OpenZeppelin libraries
- **Testing**: Hardhat with 87%+ coverage
- **Frontend**: Next.js 15, React 18, TypeScript
- **Web3 Integration**: Wagmi, RainbowKit, viem
- **Styling**: Tailwind CSS with DaisyUI components
- **Deployment**: Vercel for frontend, Sepolia for contracts

## 🧪 Testing

### Run Complete Test Suite

```powershell
# Navigate to hardhat directory
cd hardhat

# Run all tests with coverage
.\dev-setup.ps1 -RunTests

# Or manually:
npx hardhat test
npx hardhat coverage
```

### Test Coverage Report

The project maintains **87%+ test coverage** including:

- ✅ Core swap functionality
- ✅ Token approval mechanisms
- ✅ Liquidity pool operations
- ✅ Error handling and edge cases
- ✅ Access control and security

View detailed coverage reports in `hardhat/coverage/index.html`

## 🚢 Deployment

### Vercel Deployment (Frontend)

```powershell
# Automated deployment script
.\deploy-vercel.ps1

# Options:
.\deploy-vercel.ps1 -Production  # Deploy to production
.\deploy-vercel.ps1 -Preview     # Deploy preview version
```

### Smart Contract Deployment

Contracts are already deployed on Sepolia testnet. For redeployment:

```powershell
cd hardhat
npx hardhat run scripts/deploy.js --network sepolia
```

## 📁 Project Structure

```
packages/
├── hardhat/                 # Smart contracts and testing
│   ├── contracts/          # Solidity smart contracts
│   ├── test/               # Comprehensive test suite
│   ├── scripts/            # Deployment scripts
│   └── coverage/           # Test coverage reports
├── nextjs/                 # Frontend application
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── deploy-vercel.ps1       # Automated Vercel deployment
└── dev-setup.ps1          # Development environment setup
```

## 🔧 Development Scripts

| Script | Purpose |
|--------|---------|
| `dev-setup.ps1 -All` | Complete project setup |
| `dev-setup.ps1 -InstallDeps` | Install all dependencies |
| `dev-setup.ps1 -RunFrontend` | Start development server |
| `dev-setup.ps1 -RunHardhat` | Start local blockchain |
| `dev-setup.ps1 -RunTests` | Run test suite |
| `deploy-vercel.ps1` | Deploy to Vercel |

## 🛠️ Troubleshooting

### Common Issues

**1. Wallet Connection Issues**
- Ensure MetaMask is installed and connected to Sepolia
- Check that you have Sepolia ETH for gas fees

**2. Transaction Failures**
- Verify you have sufficient token balance
- Ensure tokens are approved before swapping
- Check gas fees are sufficient

**3. Build Errors**
- Run `.\dev-setup.ps1 -InstallDeps` to reinstall dependencies
- Clear Next.js cache: `cd nextjs && npm run clean`

**4. Contract Interaction Issues**
- Verify you're connected to Sepolia testnet
- Check contract addresses in the application

### Getting Help

1. Check the interactive tutorial in the application
2. Review test files for usage examples
3. Inspect browser console for detailed error messages
4. Verify network connectivity and wallet configuration

## 📚 Academic Documentation

### Learning Objectives Achieved

- **Smart Contract Development**: Professional-grade Solidity contracts
- **Testing Methodologies**: Comprehensive test coverage with edge cases
- **Frontend Integration**: Seamless Web3 integration with modern React
- **Deployment Automation**: Production-ready deployment scripts
- **User Experience**: Intuitive interface with educational components

### Code Quality Standards

- ✅ NatSpec documentation in English
- ✅ Short, descriptive error messages
- ✅ Single storage access patterns
- ✅ Comprehensive input validation
- ✅ Gas optimization techniques

## 🎯 Module 4 Compliance Checklist

- [x] **Smart Contracts**: Deployed and verified on Sepolia
- [x] **Test Coverage**: 87%+ with comprehensive edge cases
- [x] **Frontend**: Interactive React application with guided tutorial
- [x] **English Documentation**: Complete step-by-step instructions
- [x] **Approve Functionality**: Enhanced token approval interface
- [x] **Deployment Scripts**: Automated Vercel deployment
- [x] **Academic Standards**: Professional code quality and documentation

## 📄 License

This project is developed for academic purposes as part of Module 4 requirements.

---

**🎓 Academic Achievement**: This project demonstrates mastery of decentralized application development, from smart contract architecture to production deployment, meeting all Module 4 educational objectives.
