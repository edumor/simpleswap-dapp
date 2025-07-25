module.exports = {
  skipFiles: [
    'SimpleSwap.sol',
    'SimpleSwapVerifier.sol', 
    'TestSqrtHelper.sol',
    'TokenA.sol',
    'TokenB.sol'
  ],
  measureBundleSize: true,
  measureStatementCoverage: true,
  measureFunctionCoverage: true,
  measureBranchCoverage: true,
  measureLineCoverage: true,
  configureYulOptimizer: true,
  solcOptimizerDetails: {
    yul: true,
    yulDetails: {
      stackAllocation: true,
    },
  },
  mocha: {
    grep: "YourContract", // Solo YourContract
    timeout: 100000,
  },
};
