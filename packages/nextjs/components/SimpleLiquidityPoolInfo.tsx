"use client";

import React from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

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
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "getPrice",
    outputs: [{ name: "price", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

interface SimpleLiquidityPoolInfoProps {
  simpleSwapAddress: string;
  tokenAAddress: string;
  tokenBAddress: string;
}

export function SimpleLiquidityPoolInfo({
  simpleSwapAddress,
  tokenAAddress,
  tokenBAddress,
}: SimpleLiquidityPoolInfoProps) {
  const { data: reserves } = useReadContract({
    address: simpleSwapAddress as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: [tokenAAddress as `0x${string}`, tokenBAddress as `0x${string}`],
  });

  const { data: price } = useReadContract({
    address: simpleSwapAddress as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [tokenAAddress as `0x${string}`, tokenBAddress as `0x${string}`],
  });

  // Type the reserves properly
  const typedReserves = reserves as [bigint, bigint] | undefined;
  const typedPrice = price as bigint | undefined;

  return (
    <div className="bg-base-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Liquidity Pool Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-200 p-4 rounded">
            <p className="font-medium mb-2">Token A Reserve</p>
            <p className="text-lg font-bold">{typedReserves ? formatUnits(typedReserves[0], 18) : "0"}</p>
            <p className="text-sm text-gray-600">Wei: {typedReserves ? typedReserves[0].toString() : "0"}</p>
          </div>

          <div className="bg-base-200 p-4 rounded">
            <p className="font-medium mb-2">Token B Reserve</p>
            <p className="text-lg font-bold">{typedReserves ? formatUnits(typedReserves[1], 18) : "0"}</p>
            <p className="text-sm text-gray-600">Wei: {typedReserves ? typedReserves[1].toString() : "0"}</p>
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded">
          <p className="font-medium mb-2">Current Price (Token A in terms of Token B)</p>
          <p className="text-lg font-bold">{typedPrice ? formatUnits(typedPrice, 18) : "0"}</p>
          <p className="text-sm text-gray-600">1 Token A = {typedPrice ? formatUnits(typedPrice, 18) : "0"} Token B</p>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>All amounts are displayed in both human-readable format and Wei (smallest unit)</p>
          <p>Wei is the smallest denomination of tokens (1 token = 10^18 wei)</p>
        </div>
      </div>
    </div>
  );
}
