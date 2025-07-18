module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
  },
  ignorePatterns: [
    "artifacts/**",
    "cache/**",
    "contracts/**",
    "node_modules/**",
    "typechain-types/**",
    "coverage/**",
    "*.json",
  ],
  env: {
    node: true,
    es2021: true,
  },
};
