## 🧪 Test Results & Coverage (Hardhat)

### Last run: July 14, 2025

#### Test Results

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

#### Contract Coverage

```
-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
 contracts\        |    90.77 |       65 |       84 |    91.67 | |
  SimpleSwap.sol   |    98.15 |    83.33 |      100 |    98.72 |            389 |
  TokenA.sol       |      100 |       50 |      100 |      100 | |
  TokenB.sol       |       50 |       25 |       60 |       50 |          33,39 |
  YourContract.sol |       50 |     12.5 |       50 |    61.54 | 50,51,70,83,84 |
-------------------|----------|----------|----------|----------|----------------|
All files |    90.77 |       65 |       84 |    91.67 | |
-------------------|----------|----------|----------|----------|----------------|
```

> All tests are passing and global coverage is above 90%.
