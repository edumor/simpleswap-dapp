module.exports = {
  skipFiles: ['test/', 'node_modules/'],
  mocha: {
    timeout: 100000
  },
  configureYulOptimizer: true,
  solcOptimizerDetails: {
    yul: false,
  }
};
