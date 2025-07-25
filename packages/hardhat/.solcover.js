module.exports = {
  skipFiles: [
    'test/', 
    'node_modules/',
    'coverage/',
    'artifacts/',
    'cache/'
  ],
  measureStatementCoverage: true,
  measureFunctionCoverage: true,
  measureLineCoverage: true,
  measureBranchCoverage: true,
  configureYulOptimizer: false,
  istanbulReporter: ['html', 'lcov', 'text', 'json-summary'],
  providerOptions: {
    gasLimit: 300000000,
    gasPrice: 1,
    allowUnlimitedContractSize: true,
    callGasLimit: 50000000
  },
  mocha: {
    timeout: 600000,
    enableTimeouts: false
  }
};
