"use client";

import React, { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const ERC20_ABI = [
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
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

interface SimpleTokenApproveProps {
  tokenAddress: string;
  spenderAddress: string;
  tokenName: string;
}

export function SimpleTokenApprove({ tokenAddress, spenderAddress, tokenName }: SimpleTokenApproveProps) {
  const { address: connectedAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: connectedAddress ? [connectedAddress, spenderAddress as `0x${string}`] : undefined,
  });

  const handleApprove = async () => {
    if (!connectedAddress) return;

    setIsLoading(true);
    try {
      // Approve a large amount (effectively unlimited)
      const maxAmount = parseUnits("1000000", 18); // 1M tokens

      writeContract(
        {
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [spenderAddress as `0x${string}`, maxAmount],
        },
        {
          onSuccess: () => {
            notification.success(`${tokenName} approved successfully!`);
            setIsLoading(false);
          },
          onError: error => {
            console.error("Approve error:", error);
            notification.error(`${tokenName} approval failed!`);
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Approve error:", error);
      notification.error(`${tokenName} approval failed!`);
      setIsLoading(false);
    }
  };

  const isApproved = allowance && (allowance as bigint) > BigInt(0);

  return (
    <div className="bg-base-200 p-4 rounded">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{tokenName}</h3>
        <div className={`badge ${isApproved ? "badge-success" : "badge-warning"}`}>
          {isApproved ? "Approved" : "Not Approved"}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        Current allowance: {allowance ? formatUnits(allowance as bigint, 18) : "0"}
      </p>

      <button
        onClick={handleApprove}
        disabled={isLoading || !connectedAddress}
        className={`btn btn-sm w-full ${isApproved ? "btn-outline" : "btn-primary"}`}
      >
        {isLoading ? "Approving..." : isApproved ? "Re-approve" : "Approve"}
      </button>

      <p className="text-xs text-gray-500 mt-2">Approving allows the SimpleSwap contract to spend your tokens</p>
    </div>
  );
}
