// Centralized contract addresses for SimpleSwap DApp
// These addresses are deployed on Sepolia Testnet (Chain ID: 11155111)

export const CONTRACT_ADDRESSES = {
  SIMPLE_SWAP: "0x5F1C2c20248BA5A444256c21592125EaF08b23A1" as `0x${string}`,
  TOKEN_A: "0xA61A5c03088c808935C86F409Ace89E582842F82" as `0x${string}`,
  TOKEN_B: "0x9205f067C913C1Edb642609342ca8d58d60ae95B" as `0x${string}`,
} as const;

export const ETHERSCAN_BASE_URL = "https://sepolia.etherscan.io/address";

export const getEtherscanLink = (address: string) =>
  `${ETHERSCAN_BASE_URL}/${address}`;

export const NETWORK = {
  name: "Sepolia Testnet",
  chainId: 11155111,
} as const;
