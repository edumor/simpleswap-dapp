// Direcciones de contratos desplegados en Sepolia
export const SEPOLIA_CONTRACTS = {
  SimpleSwap: "0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4",
  TokenA: "0x4efc5e7af7851efB65871c0d54adaC154250126f", 
  TokenB: "0x36ae80FDa8f67605aac4Dd723c70ce70513AB909",
} as const;

// Chain ID de Sepolia
export const SEPOLIA_CHAIN_ID = 11155111;

// URLs útiles para Sepolia
export const SEPOLIA_URLS = {
  etherscan: "https://sepolia.etherscan.io",
  rpc: "https://sepolia.infura.io/v3/",
  faucet: "https://sepoliafaucet.com/",
} as const;

// Información de tokens para la UI
export const TOKEN_INFO = {
  TokenA: {
    symbol: "TKN A",
    name: "Token A",
    decimals: 18,
    address: SEPOLIA_CONTRACTS.TokenA,
  },
  TokenB: {
    symbol: "TKN B", 
    name: "Token B",
    decimals: 18,
    address: SEPOLIA_CONTRACTS.TokenB,
  },
} as const;
