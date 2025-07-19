import { defineChain } from "viem";
import { mainnet, sepolia } from "viem/chains";

// Your chains imported from viem/chains
const chains = [
  sepolia, // Sepolia como red principal para desarrollo/demo
  mainnet, // Mainnet disponible para futuro
] as const;

const scaffoldConfig = {
  targetNetworks: chains,
  pollingInterval: 30000,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  onlyLocalBurnerWallet: false, // Permitir cualquier wallet
} as const;

export default scaffoldConfig;

/**
 * Gives the block explorer transaction URL.
 * @param network
 * @param txnHash
 * @dev returns empty string if the network is localChain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames: Record<number, string> = {
    1: "https://etherscan.io/tx/",
    5: "https://goerli.etherscan.io/tx/",
    11155111: "https://sepolia.etherscan.io/tx/",
  };

  const blockExplorerTxURL = chainNames[chainId];

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}${txnHash}`;
}

/**
 * Gives the block explorer Address URL.
 * @param network - wagmi chain object
 * @param address
 * @dev returns empty string if the network is localChain
 */
export function getBlockExplorerAddressLink(chainId: number, address: string) {
  const chainNames: Record<number, string> = {
    1: "https://etherscan.io/address/",
    5: "https://goerli.etherscan.io/address/",
    11155111: "https://sepolia.etherscan.io/address/",
  };

  const blockExplorerURL = chainNames[chainId];

  if (!blockExplorerURL) {
    return "";
  }

  return `${blockExplorerURL}${address}`;
}

/**
 * Gets the price of ETH based on Native Token/DAI trading pair from Uniswap SDK
 */
export const getTargetNetworks = () => {
  return chains;
};
