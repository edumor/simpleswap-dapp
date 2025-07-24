"use client";

import React from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

interface SimpleTokenBalancesProps {
  tokenAAddress: string;
  tokenBAddress: string;
  userAddress: string;
}

export function SimpleTokenBalances({ tokenAAddress, tokenBAddress, userAddress }: SimpleTokenBalancesProps) {
  const { data: balanceA } = useReadContract({
    address: tokenAAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  });

  const { data: balanceB } = useReadContract({
    address: tokenBAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  });

  return (
    <div className="bg-base-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Token Balances</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-base-200 rounded">
          <div>
            <p className="font-medium">Token A</p>
            <p className="text-sm text-gray-600">Wei: {balanceA?.toString() || "0"}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{balanceA ? formatUnits(balanceA as bigint, 18) : "0"}</p>
            <p className="text-sm text-gray-600">tokens</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-base-200 rounded">
          <div>
            <p className="font-medium">Token B</p>
            <p className="text-sm text-gray-600">Wei: {balanceB?.toString() || "0"}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{balanceB ? formatUnits(balanceB as bigint, 18) : "0"}</p>
            <p className="text-sm text-gray-600">tokens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
