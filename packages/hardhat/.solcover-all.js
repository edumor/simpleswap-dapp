module.exports = {
  skipFiles: [],
  measureBundleSize: false,
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
    grep: "YourContract|OptimizedCoverage", 
    timeout: 300000,
  },
  providerOptions: {
    gasLimit: 0xfffffffffff,
    gasPrice: 0x01,
    blockGasLimit: 0xfffffffffff,
  },
};
