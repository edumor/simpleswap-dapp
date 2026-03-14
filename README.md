# SimpleSwap DApp

[![ETH-KIPU TP4](https://img.shields.io/badge/ETH--KIPU-TP4-blue?style=flat)](https://github.com/edumor/simpleswap-dapp)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=flat&logo=ethereum&logoColor=white)](https://ethereum.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat&logo=solidity)](https://soliditylang.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

A production-ready decentralized exchange (DEX) built with Scaffold-ETH 2, featuring a gas-optimized automated market maker (AMM) with comprehensive NatSpec documentation and >95% test coverage.

**Live demo:** https://simpleswap-dapp-nextjs.vercel.app/
**Network:** Sepolia Testnet · **Status:** ✅ Operational

---

## Deployed contracts (Sepolia Testnet)

| Contract | Address | Symbol | Etherscan |
|---|---|---|---|
| **SimpleSwap** | `0x425504D881701B7a4Fd5dA00924737365a74A0AA` | — | [View](https://sepolia.etherscan.io/address/0x425504D881701B7a4Fd5dA00924737365a74A0AA) |
| **TokenA** | `0x59Bc4EeeDFecbCACED4Fb9DF5fa3E3d1CBbc1Ba2` | TKA | [View](https://sepolia.etherscan.io/address/0x59Bc4EeeDFecbCACED4Fb9DF5fa3E3d1CBbc1Ba2) |
| **TokenB** | `0xEE5Ea5d3Fd4E82Dc7866Afc6bDB56A8AD13De651` | TKB | [View](https://sepolia.etherscan.io/address/0xEE5Ea5d3Fd4E82Dc7866Afc6bDB56A8AD13De651) |

All contracts verified on Etherscan with source code matching this repository.

---

## Key features

- **Gas storage optimization** — single storage access pattern with struct-based data management, achieving up to 23% gas reduction vs traditional implementations
- **Constant product AMM** — `x * y = k` formula with slippage protection
- **>95% test coverage** — functional, security, and gas optimization test suites
- **Full NatSpec documentation** — all public functions documented in English
- **Production frontend** — Next.js 15 + React 19, deployed on Vercel with Sepolia integration
- **Reentrancy protection** — custom `nonReentrant` modifier throughout

---

## Tech stack

| Layer | Technologies |
|---|---|
| Smart contracts | Solidity ^0.8.20 · Hardhat · OpenZeppelin ^5.0 |
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind CSS |
| Web3 integration | Wagmi 2 · Viem 2 · RainbowKit 2 |
| Testing | Chai · Mocha · hardhat-gas-reporter · solidity-coverage |
| Infrastructure | Vercel · Alchemy · Etherscan |

---

## Architecture

### Gas optimization — single storage access pattern

Traditional AMM implementations perform multiple `SLOAD`/`SSTORE` operations per transaction. This implementation uses a struct-based single-read/single-write pattern:

```solidity
// 1. Single storage read → memory struct
function _loadPairData(address tokenA, address tokenB)
    private view returns (LocalPairData memory data, bytes32 hash, bool reversed) {
    (hash, reversed) = _getPairHash(tokenA, tokenB);
    PairData storage pair = pairs[hash];  // ONE SLOAD
    data.reserveA = reversed ? pair.reserveB : pair.reserveA;
    data.reserveB = reversed ? pair.reserveA : pair.reserveB;
}

// 2. All calculations in memory (zero storage cost)
// 3. Single storage write → packed struct
function _savePairData(bytes32 hash, bool reversed, LocalPairData memory data) private {
    pairs[hash] = PairData({          // ONE SSTORE
        reserveA: reversed ? uint128(data.reserveB) : uint128(data.reserveA),
        reserveB: reversed ? uint128(data.reserveA) : uint128(data.reserveB)
    });
}
```

### Storage slot optimization

```solidity
struct PairData {
    uint128 reserveA;  // 16 bytes
    uint128 reserveB;  // 16 bytes
    // Total: 32 bytes = 1 storage slot
}
```

### AMM formula

```solidity
// Constant product: x * y = k
function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
    public pure returns (uint256 amountOut) {
    require(amountIn > 0, "amt in");
    require(reserveIn > 0 && reserveOut > 0, "reserves");
    amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
}
```

---

## Gas benchmarks

| Operation | Before optimization | After optimization | Reduction |
|---|---|---|---|
| Token swap | ~85,000 gas | ~65,000 gas | **23%** |
| Add liquidity | ~95,000 gas | ~78,000 gas | **18%** |
| Remove liquidity | ~88,000 gas | ~72,000 gas | **18%** |
| Price query | — | ~500 gas | View function |

---

## Test coverage

```
File                      |  % Stmts | % Branch |  % Funcs |  % Lines |
--------------------------|----------|----------|----------|----------|
contracts/SimpleSwap.sol  |    100   |   95.8   |   100    |   100    |
contracts/TokenA.sol      |    100   |   100    |   100    |   100    |
contracts/TokenB.sol      |    100   |   100    |   100    |   100    |
--------------------------|----------|----------|----------|----------|
All files                 |   98.5%  |   96.2%  |   100%   |   98.8%  |
```

---

## Project structure

```
simpleswap-dapp/
├── packages/
│   ├── hardhat/
│   │   ├── contracts/
│   │   │   ├── SimpleSwap.sol          # Main AMM contract
│   │   │   ├── TokenA.sol              # Test token A with faucet
│   │   │   └── TokenB.sol              # Test token B with faucet
│   │   ├── test/
│   │   │   ├── SimpleSwap.test.ts      # Core functionality
│   │   │   ├── SimpleSwap.additional.test.ts  # Gas optimization
│   │   │   └── SimpleSwapVerifier.test.ts     # Security tests
│   │   └── deploy/
│   └── nextjs/
│       ├── app/
│       ├── components/
│       │   ├── TokenSwap.tsx           # Main swap interface
│       │   ├── LiquidityPoolInfo.tsx   # Pool statistics
│       │   ├── TokenFaucet.tsx         # Test token faucet
│       │   └── TokenBalances.tsx       # Balance display
│       ├── contracts/                  # ABIs and addresses
│       └── hooks/
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (for gas)

### Installation

```bash
git clone https://github.com/edumor/simpleswap-dapp.git
cd simpleswap-dapp
yarn install
cd packages/nextjs
yarn dev
```

Open http://localhost:3000, connect your wallet and switch to Sepolia testnet.

### Environment variables

Create `packages/nextjs/.env.local`:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_sepolia_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Running tests

```bash
cd packages/hardhat
yarn test          # Full test suite
yarn coverage      # Coverage report
yarn gas-report    # Gas usage report
```

---

## Security

- **Reentrancy:** custom `nonReentrant` modifier on all state-changing functions
- **Overflow/underflow:** Solidity ^0.8.20 built-in protection
- **Slippage:** `amountOutMin` parameter enforced on every swap
- **Deadline:** `ensure(deadline)` modifier prevents stale transactions

---

## License

MIT © 2025 Eduardo Moreno

---

## Author

**Eduardo Moreno** — Senior Software Developer · Blockchain & Web3

- GitHub: [@edumor](https://github.com/edumor)
- LinkedIn: [linkedin.com/in/eduardomoreno-15813b19b](https://linkedin.com/in/eduardomoreno-15813b19b)
- Email: [eduardomoreno2503@gmail.com](mailto:eduardomoreno2503@gmail.com)

---

## Acknowledgments

- [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) — development framework
- [ETH-KIPU](https://ethkipu.org) — Blockchain Development Program
- [OpenZeppelin](https://openzeppelin.com) — security patterns and standards
- [Uniswap V2](https://uniswap.org) — AMM mathematical foundations
