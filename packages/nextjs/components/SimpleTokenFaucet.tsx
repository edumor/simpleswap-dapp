"use client";

import React, { useState } from "react";
import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const ERC20_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface SimpleTokenFaucetProps {
  tokenAAddress: string;
  tokenBAddress: string;
}

export function SimpleTokenFaucet({ tokenAAddress, tokenBAddress }: SimpleTokenFaucetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  const handleMintTokenA = async () => {
    setIsLoading(true);
    try {
      writeContract(
        {
          address: tokenAAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "mint",
          args: [
            "0x0000000000000000000000000000000000000000", // This will be replaced by the actual user address
            parseUnits("100", 18), // Mint 100 tokens
          ],
        },
        {
          onSuccess: () => {
            notification.success("Token A minted successfully!");
            setIsLoading(false);
          },
          onError: error => {
            console.error("Mint error:", error);
            notification.error("Mint failed!");
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Mint error:", error);
      notification.error("Mint failed!");
      setIsLoading(false);
    }
  };

  const handleMintTokenB = async () => {
    setIsLoading(true);
    try {
      writeContract(
        {
          address: tokenBAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "mint",
          args: [
            "0x0000000000000000000000000000000000000000", // This will be replaced by the actual user address
            parseUnits("100", 18), // Mint 100 tokens
          ],
        },
        {
          onSuccess: () => {
            notification.success("Token B minted successfully!");
            setIsLoading(false);
          },
          onError: error => {
            console.error("Mint error:", error);
            notification.error("Mint failed!");
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Mint error:", error);
      notification.error("Mint failed!");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Token Faucet</h2>
      <p className="text-sm mb-4 text-gray-600">Get test tokens to interact with the SimpleSwap protocol</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={handleMintTokenA} disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Minting..." : "Get 100 Token A"}
        </button>
        <button onClick={handleMintTokenB} disabled={isLoading} className="btn btn-secondary">
          {isLoading ? "Minting..." : "Get 100 Token B"}
        </button>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: If minting fails, the tokens might not have a public mint function.</p>
        <p>In that case, please use an external faucet or contact the contract owner.</p>
      </div>
    </div>
  );
}
