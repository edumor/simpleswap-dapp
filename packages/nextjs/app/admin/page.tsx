"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatEther, parseEther } from "viem";
import { SEPOLIA_CONTRACTS, TOKEN_INFO, SEPOLIA_URLS } from "~/contracts/addresses";
import { useTokenBalance, useApproveToken } from "~/hooks/contracts/useContracts";
import type { NextPage } from "next";

const AdminPage: NextPage = () => {
  const [mintAmount, setMintAmount] = useState("1000");
  
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Balances de tokens
  const { data: tokenABalance } = useTokenBalance(SEPOLIA_CONTRACTS.TokenA, address);
  const { data: tokenBBalance } = useTokenBalance(SEPOLIA_CONTRACTS.TokenB, address);

  const connectWallet = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  // Nota: Los tokens desplegados pueden no tener función mint pública
  // Esta página es informativa para mostrar balances y direcciones

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 max-w-4xl mx-auto">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Token Administration</span>
          <span className="block text-2xl mb-2">SimpleSwap - Sepolia Testnet</span>
        </h1>

        {/* Connection Status */}
        <div className="bg-base-100 shadow-lg rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Wallet Connection</h2>
          
          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4">Connect your wallet to interact with the contracts</p>
              <button className="btn btn-primary" onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-2"><strong>Connected Address:</strong></p>
              <p className="font-mono text-sm bg-base-200 p-2 rounded mb-4">{address}</p>
              <button className="btn btn-ghost btn-sm" onClick={() => disconnect()}>
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Contract Information */}
        <div className="bg-base-100 shadow-lg rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Contract Addresses</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-200 rounded-lg">
              <div>
                <div className="font-semibold">SimpleSwap Contract</div>
                <div className="font-mono text-sm">{SEPOLIA_CONTRACTS.SimpleSwap}</div>
              </div>
              <a 
                href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.SimpleSwap}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm mt-2 sm:mt-0"
              >
                View on Etherscan
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-200 rounded-lg">
              <div>
                <div className="font-semibold">Token A ({TOKEN_INFO.TokenA.symbol})</div>
                <div className="font-mono text-sm">{SEPOLIA_CONTRACTS.TokenA}</div>
              </div>
              <a 
                href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.TokenA}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm mt-2 sm:mt-0"
              >
                View on Etherscan
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-200 rounded-lg">
              <div>
                <div className="font-semibold">Token B ({TOKEN_INFO.TokenB.symbol})</div>
                <div className="font-mono text-sm">{SEPOLIA_CONTRACTS.TokenB}</div>
              </div>
              <a 
                href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.TokenB}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm mt-2 sm:mt-0"
              >
                View on Etherscan
              </a>
            </div>
          </div>
        </div>

        {/* Token Balances */}
        {isConnected && (
          <div className="bg-base-100 shadow-lg rounded-3xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-center">Your Token Balances</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-base-200 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {tokenABalance ? formatEther(tokenABalance) : "0.00"}
                </div>
                <div className="text-lg font-semibold">{TOKEN_INFO.TokenA.symbol}</div>
                <div className="text-sm text-gray-500">{TOKEN_INFO.TokenA.name}</div>
              </div>

              <div className="bg-base-200 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-secondary">
                  {tokenBBalance ? formatEther(tokenBBalance) : "0.00"}
                </div>
                <div className="text-lg font-semibold">{TOKEN_INFO.TokenB.symbol}</div>
                <div className="text-sm text-gray-500">{TOKEN_INFO.TokenB.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions for Getting Test Tokens */}
        <div className="bg-base-100 shadow-lg rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center">How to Get Test Tokens</h2>
          
          <div className="space-y-6">
            <div className="alert alert-info">
              <div>
                <h3 className="font-bold">For Professors/Evaluators:</h3>
                <p>Contact the developer to get test tokens minted to your address, or use the contract owner functions if available.</p>
              </div>
            </div>

            <div className="steps steps-vertical lg:steps-horizontal">
              <div className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Step 1: Get Sepolia ETH</div>
                  <div className="text-sm">Get test ETH from <a href={SEPOLIA_URLS.faucet} target="_blank" rel="noopener noreferrer" className="link">Sepolia Faucet</a></div>
                </div>
              </div>
              
              <div className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Step 2: Connect Wallet</div>
                  <div className="text-sm">Connect MetaMask or another wallet to Sepolia network</div>
                </div>
              </div>
              
              <div className="step step-primary">
                <div className="text-left">
                  <div className="font-semibold">Step 3: Get Test Tokens</div>
                  <div className="text-sm">Contact admin or use mint function if available</div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Network Configuration:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Network Name:</strong> Sepolia Testnet</li>
                <li><strong>RPC URL:</strong> https://sepolia.infura.io/v3/YOUR_PROJECT_ID</li>
                <li><strong>Chain ID:</strong> 11155111</li>
                <li><strong>Currency Symbol:</strong> ETH</li>
                <li><strong>Block Explorer:</strong> https://sepolia.etherscan.io</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-800">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Any wallet can connect and use the swap functionality</li>
                <li>• Approval is required for any ERC20 token before swapping</li>
                <li>• All transactions are publicly visible on Sepolia Etherscan</li>
                <li>• This is a testnet - no real money involved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
