# Vercel Deployment Fix Guide

## Issues Identified

1. **Lockfile conflicts**: The error `YN0028: The lockfile would have been modified by this install` indicates yarn.lock is out of sync with package.json.

2. **Missing Sepolia deployment files**: Contract deployed on Sepolia but no deployment artifacts.

3. **Dependency version conflicts**: Multiple peer dependency warnings.

## Fixes Applied

### 1. Updated Package Dependencies

- Replaced `@typechain/ethers-v5` with `@typechain/ethers-v6`
- Added missing `@types/node` dependency
- Moved `typechain` and `typescript` to dependencies
- Fixed peer dependency issues

### 2. Created Sepolia Deployment Configuration

- Added `deployments/sepolia/` folder
- Updated SimpleSwap address to: `0x5F1C2c20248BA5A444256c21592125EaF08b23A1`
- Set correct Sepolia chain ID: `11155111`

### 3. Added Utility Scripts

- `yarn fix-deps`: Clean reinstall dependencies
- `yarn update-deployments sepolia`: Update deployment addresses
- `yarn deploy:sepolia`: Deploy specifically to Sepolia

## Steps to Fix Vercel Deployment

### Step 1: Fix Dependencies Locally
```bash
cd packages/hardhat
yarn fix-deps
```

### Step 2: Update Token Addresses (if deployed)
If you have TokenA and TokenB deployed on Sepolia, update them in:
- `scripts/updateDeployments.ts` (lines 13-14)
- Run: `yarn update-deployments sepolia`

### Step 3: Commit and Push Changes
```bash
git add .
git commit -m "fix: resolve dependency conflicts and add Sepolia deployment config"
git push origin master
```

### Step 4: Update Vercel Build Settings
In Vercel dashboard:
1. Go to your project settings
2. Under "Build & Development Settings"
3. Set Build Command to: `cd packages/hardhat && yarn install --frozen-lockfile && yarn compile`
4. Set Install Command to: `yarn install --frozen-lockfile`

## Missing Information Needed

1. **TokenA Sepolia Address**: Update in `scripts/updateDeployments.ts` line 13
2. **TokenB Sepolia Address**: Update in `scripts/updateDeployments.ts` line 14

## Alternative: Deploy Tokens to Sepolia

If tokens aren't deployed yet, run:
```bash
yarn deploy:sepolia
```

This will deploy all contracts (TokenA, TokenB, SimpleSwap) to Sepolia network.
