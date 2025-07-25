"use client";

import React, { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { EnhancedTokenBalances } from "~~/components/EnhancedTokenBalances";
import { EnhancedPoolInfo } from "~~/components/EnhancedPoolInfo";
import { EnhancedPriceInfo } from "~~/components/EnhancedPriceInfo";
import { notification } from "~~/utils/scaffold-eth";

// Contract addresses on Sepolia
const SIMPLE_SWAP_ADDRESS = "0x5F1C2c20248BA5A444256c21592125EaF08b23A1";
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const SIMPLE_SWAP_ABI = [
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "getReserves",
    outputs: [
      { name: "reserveA", type: "uint256" },
      { name: "reserveB", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "reserveIn", type: "uint256" },
      { name: "reserveOut", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "getPrice",
    outputs: [{ name: "price", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const SimpleSwapPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // State for swap form
  const [tokenIn, setTokenIn] = useState<"A" | "B">("A");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  // Get reserves
  const { data: reserves } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  // Get price
  const { data: price } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  // Get token balances
  const { data: balanceA } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  const { data: balanceB } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Calculate amount out
  const { data: calculatedAmountOut } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getAmountOut",
    args:
      amountIn && reserves && Array.isArray(reserves)
        ? [
            parseUnits(amountIn, 18),
            tokenIn === "A" ? (reserves as any)[0] : (reserves as any)[1],
            tokenIn === "A" ? (reserves as any)[1] : (reserves as any)[0],
          ]
        : undefined,
  });

  // Update amount out when calculation changes
  useEffect(() => {
    if (calculatedAmountOut) {
      setAmountOut((calculatedAmountOut as bigint).toString());
    }
  }, [calculatedAmountOut]);

  const handleApprove = async (tokenAddress: string, tokenName: string) => {
    if (!connectedAddress) return;

    try {
      writeContract(
        {
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [SIMPLE_SWAP_ADDRESS, parseUnits("1000000", 18)],
        },
        {
          onSuccess: () => {
            notification.success(`${tokenName} approved successfully!`);
          },
          onError: error => {
            console.error("Approve error:", error);
            notification.error(`${tokenName} approval failed!`);
          },
        },
      );
    } catch (error) {
      console.error("Approve error:", error);
      notification.error(`${tokenName} approval failed!`);
    }
  };

  const handleSwap = async () => {
    if (!amountIn || !connectedAddress || !calculatedAmountOut) return;

    try {
      const path = tokenIn === "A" ? [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS] : [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS];
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
      const minAmountOut = ((calculatedAmountOut as bigint) * BigInt(99)) / BigInt(100); // 1% slippage

      writeContract(
        {
          address: SIMPLE_SWAP_ADDRESS,
          abi: SIMPLE_SWAP_ABI,
          functionName: "swapExactTokensForTokens",
          args: [parseUnits(amountIn, 18), minAmountOut, path, connectedAddress, deadline],
        },
        {
          onSuccess: () => {
            notification.success("Swap successful!");
            setAmountIn("");
            setAmountOut("");
          },
          onError: error => {
            console.error("Swap error:", error);
            notification.error("Swap failed!");
          },
        },
      );
    } catch (error) {
      console.error("Swap error:", error);
      notification.error("Swap failed!");
    }
  };

  const switchTokens = () => {
    setTokenIn(tokenIn === "A" ? "B" : "A");
    setAmountIn(amountOut);
    setAmountOut("");
  };

  if (!isConnected) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">SimpleSwap DApp</span>
            <span className="block text-2xl mb-2">Decentralized Token Exchange</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Please connect your wallet to use the SimpleSwap DApp</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">SimpleSwap DApp</h1>
          <p className="text-xl mb-4">Decentralized Token Exchange on Sepolia Testnet</p>
          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">📋 Instructions:</h2>
            <div className="text-sm mb-4 text-gray-700 space-y-1">
              <p>1. Connect your wallet (MetaMask recommended)</p>
              <p>2. Make sure you&apos;re on Sepolia testnet</p>
              <p>3. Approve tokens before swapping</p>
              <p>4. <strong>All amounts are displayed in Wei (1 token = 1,000,000,000,000,000,000 wei)</strong></p>
              <p>5. Use the swap form below to exchange tokens</p>
            </div>
            <div className="bg-blue-50 p-3 rounded text-xs">
              <p className="font-semibold text-blue-800">🔢 Wei Conversion:</p>
              <p className="text-blue-700">• 1 token = 1000000000000000000 wei</p>
              <p className="text-blue-700">• 0.1 token = 100000000000000000 wei</p>
              <p className="text-blue-700">• 0.01 token = 10000000000000000 wei</p>
            </div>
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="bg-base-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contract Addresses (Sepolia)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">SimpleSwap:</p>
              <a
                href={`https://sepolia.etherscan.io/address/${SIMPLE_SWAP_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm break-all"
              >
                {SIMPLE_SWAP_ADDRESS}
              </a>
            </div>
            <div>
              <p className="font-medium">Token A:</p>
              <a
                href={`https://sepolia.etherscan.io/address/${TOKEN_A_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm break-all"
              >
                {TOKEN_A_ADDRESS}
              </a>
            </div>
            <div>
              <p className="font-medium">Token B:</p>
              <a
                href={`https://sepolia.etherscan.io/address/${TOKEN_B_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm break-all"
              >
                {TOKEN_B_ADDRESS}
              </a>
            </div>
          </div>
        </div>

        {/* Token Balances */}
        <div className="bg-base-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Token Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200 p-4 rounded">
              <p className="font-medium">Token A Balance</p>
              <p className="text-lg font-bold">{balanceA ? formatUnits(balanceA as bigint, 18) : "0"} tokens</p>
              <p className="text-sm text-gray-600">Wei: {balanceA ? (balanceA as bigint).toString() : "0"}</p>
            </div>
            <div className="bg-base-200 p-4 rounded">
              <p className="font-medium">Token B Balance</p>
              <p className="text-lg font-bold">{balanceB ? formatUnits(balanceB as bigint, 18) : "0"} tokens</p>
              <p className="text-sm text-gray-600">Wei: {balanceB ? (balanceB as bigint).toString() : "0"}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Pool Information */}
        <EnhancedPoolInfo />

        {/* Enhanced Price Information */}  
        <EnhancedPriceInfo />

        {/* Enhanced Token Balances */}
        {connectedAddress && (
          <EnhancedTokenBalances 
            tokenAAddress={TOKEN_A_ADDRESS} 
            tokenBAddress={TOKEN_B_ADDRESS}
            userAddress={connectedAddress}
          />
        )}

        {/* Token Approval */}
        <div className="bg-base-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Token Approvals</h2>
          <p className="text-sm mb-4 text-gray-600">You must approve tokens before swapping</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleApprove(TOKEN_A_ADDRESS, "Token A")}
              className="btn btn-primary"
              disabled={!connectedAddress}
            >
              Approve Token A
            </button>
            <button
              onClick={() => handleApprove(TOKEN_B_ADDRESS, "Token B")}
              className="btn btn-secondary"
              disabled={!connectedAddress}
            >
              Approve Token B
            </button>
          </div>
        </div>

        {/* Swap Section */}
        <div className="bg-base-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Token Swap (All amounts in Wei)</h2>
          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">From: Token {tokenIn} (Amount in Wei)</label>
                <input
                  type="text"
                  placeholder="Enter amount in wei (e.g., 1000000000000000000 = 1 token)"
                  className="input input-bordered w-full font-mono"
                  value={amountIn}
                  onChange={e => setAmountIn(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {amountIn && !isNaN(Number(amountIn)) ? 
                    `≈ ${formatUnits(BigInt(amountIn || "0"), 18)} tokens` : 
                    "Enter wei amount"
                  }
                </p>
              </div>

              <div className="flex justify-center">
                <button onClick={switchTokens} className="btn btn-circle btn-outline">
                  ↕️
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  To: Token {tokenIn === "A" ? "B" : "A"} (Amount in Wei)
                </label>
                <input
                  type="text"
                  placeholder="Calculated amount out in wei"
                  className="input input-bordered w-full bg-gray-50 font-mono"
                  value={amountOut}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  {amountOut && !isNaN(Number(amountOut)) ? 
                    `≈ ${formatUnits(BigInt(amountOut || "0"), 18)} tokens` : 
                    "Calculated automatically"
                  }
                </p>
              </div>

              <button
                onClick={handleSwap}
                disabled={!amountIn || !calculatedAmountOut}
                className="btn btn-primary w-full"
              >
                Swap Tokens
              </button>

              <div className="text-xs text-gray-500 mt-4 bg-yellow-50 p-3 rounded">
                <p className="font-semibold mb-1">💡 Wei Information:</p>
                <p>• 1 token = 1,000,000,000,000,000,000 wei (18 decimals)</p>
                <p>• All values displayed in wei for precision</p>
                <p>• This uses getAmountOut calculation from the smart contract</p>
                <p>• The swap will use 1% slippage tolerance automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSwapPage;
