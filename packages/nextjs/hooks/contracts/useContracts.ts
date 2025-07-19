import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { SEPOLIA_CONTRACTS } from "~/contracts/addresses";
import { SIMPLE_SWAP_ABI, ERC20_ABI } from "~/contracts/abis";

// Hook para obtener las reservas del pool
export function useGetReserves(tokenA?: string, tokenB?: string) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.SimpleSwap as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: tokenA && tokenB ? [tokenA as `0x${string}`, tokenB as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenA && tokenB),
    },
  });
}

// Hook para calcular el precio de salida
export function useGetAmountOut(amountIn?: string, reserveIn?: string, reserveOut?: string) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.SimpleSwap as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getAmountOut",
    args: amountIn && reserveIn && reserveOut 
      ? [BigInt(amountIn), BigInt(reserveIn), BigInt(reserveOut)] 
      : undefined,
    query: {
      enabled: !!(amountIn && reserveIn && reserveOut),
    },
  });
}

// Hook para obtener balance de token
export function useTokenBalance(tokenAddress?: string, userAddress?: string) {
  return useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenAddress && userAddress),
    },
  });
}

// Hook para obtener allowance de token
export function useTokenAllowance(tokenAddress?: string, owner?: string, spender?: string) {
  return useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: owner && spender ? [owner as `0x${string}`, spender as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenAddress && owner && spender),
    },
  });
}

// Hook para aprobar tokens
export function useApproveToken() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const approve = (tokenAddress: string, spender: string, amount: bigint) => {
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender as `0x${string}`, amount],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    approve,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

// Hook para hacer swap
export function useSwapTokens() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const swap = (
    amountIn: bigint,
    amountOutMin: bigint,
    tokenIn: string,
    tokenOut: string,
    to: string,
    deadline: bigint
  ) => {
    writeContract({
      address: SEPOLIA_CONTRACTS.SimpleSwap as `0x${string}`,
      abi: SIMPLE_SWAP_ABI,
      functionName: "swapExactTokensForTokens",
      args: [amountIn, amountOutMin, tokenIn as `0x${string}`, tokenOut as `0x${string}`, to as `0x${string}`, deadline],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    swap,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

// Hook para agregar liquidez
export function useAddLiquidity() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const addLiquidity = (
    tokenA: string,
    tokenB: string,
    amountADesired: bigint,
    amountBDesired: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    to: string,
    deadline: bigint
  ) => {
    writeContract({
      address: SEPOLIA_CONTRACTS.SimpleSwap as `0x${string}`,
      abi: SIMPLE_SWAP_ABI,
      functionName: "addLiquidity",
      args: [
        tokenA as `0x${string}`,
        tokenB as `0x${string}`,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to as `0x${string}`,
        deadline,
      ],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    addLiquidity,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
