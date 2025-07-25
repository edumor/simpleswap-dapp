module.exports = {
  skipFiles: [
    'SimpleSwap.sol', // Saltear SimpleSwap por problemas de gas
    'SimpleSwapVerifier.sol'
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
    grep: "YourContract|TestSqrtHelper|Token", // Solo ejecutar estos tests
    timeout: 100000,
  },
};
