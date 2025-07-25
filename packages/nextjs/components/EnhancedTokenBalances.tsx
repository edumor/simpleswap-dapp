import { useReadContract } from "wagmi";
import { formatEther } from "viem";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
] as const;

interface EnhancedTokenBalancesProps {
  tokenAAddress: string;
  tokenBAddress: string;
  userAddress: string;
}

export function EnhancedTokenBalances({ tokenAAddress, tokenBAddress, userAddress }: EnhancedTokenBalancesProps) {
  // TokenA data
  const { data: balanceA, isLoading: loadingBalanceA, refetch: refetchBalanceA } = useReadContract({
    address: tokenAAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  });

  const { data: nameA } = useReadContract({
    address: tokenAAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
  });

  const { data: symbolA } = useReadContract({
    address: tokenAAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: decimalsA } = useReadContract({
    address: tokenAAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  // TokenB data
  const { data: balanceB, isLoading: loadingBalanceB, refetch: refetchBalanceB } = useReadContract({
    address: tokenBAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  });

  const { data: nameB } = useReadContract({
    address: tokenBAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
  });

  const { data: symbolB } = useReadContract({
    address: tokenBAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: decimalsB } = useReadContract({
    address: tokenBAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const isLoading = loadingBalanceA || loadingBalanceB;

  const handleRefresh = () => {
    refetchBalanceA();
    refetchBalanceB();
  };

  const balanceABigInt = balanceA ? balanceA as bigint : 0n;
  const balanceBBigInt = balanceB ? balanceB as bigint : 0n;

  return (
    <div className="p-6 border-2 border-purple-200 rounded-xl max-w-2xl mx-auto my-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            💰
          </div>
          <h2 className="text-xl font-bold text-purple-900">Your Token Balances</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          {isLoading ? "⟳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* User Address */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-purple-100">
        <div className="text-sm font-medium text-gray-700 mb-1">Wallet Address:</div>
        <div className="font-mono text-xs bg-gray-100 px-3 py-2 rounded break-all">
          {userAddress}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading token balances...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* TokenA Balance */}
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                A
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  {(nameA as string) || "TokenA"} ({(symbolA as string) || "TKA"})
                </h3>
                <div className="text-xs text-gray-600 font-mono">
                  {tokenAAddress}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Balance (Wei Format):</div>
                <div className="font-mono text-sm bg-green-50 p-3 rounded border break-all">
                  {balanceABigInt.toString()} wei
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Balance (Human Readable):</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatEther(balanceABigInt)} {(symbolA as string) || "TKA"}
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <div>Decimals: {decimalsA?.toString() || "18"}</div>
                <div>Contract: {tokenAAddress.slice(0, 6)}...{tokenAAddress.slice(-4)}</div>
              </div>

              {/* Balance Status */}
              <div className={`p-2 rounded text-center text-sm ${
                balanceABigInt > 0n 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {balanceABigInt > 0n ? "✅ Has Balance" : "⚠️ No Balance"}
              </div>
            </div>
          </div>

          {/* TokenB Balance */}
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                B
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">
                  {(nameB as string) || "TokenB"} ({(symbolB as string) || "TKB"})
                </h3>
                <div className="text-xs text-gray-600 font-mono">
                  {tokenBAddress}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Balance (Wei Format):</div>
                <div className="font-mono text-sm bg-blue-50 p-3 rounded border break-all">
                  {balanceBBigInt.toString()} wei
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Balance (Human Readable):</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatEther(balanceBBigInt)} {(symbolB as string) || "TKB"}
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <div>Decimals: {decimalsB?.toString() || "18"}</div>
                <div>Contract: {tokenBAddress.slice(0, 6)}...{tokenBAddress.slice(-4)}</div>
              </div>

              {/* Balance Status */}
              <div className={`p-2 rounded text-center text-sm ${
                balanceBBigInt > 0n 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {balanceBBigInt > 0n ? "✅ Has Balance" : "⚠️ No Balance"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Summary */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100">
        <h3 className="font-semibold text-purple-800 mb-3">Balance Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">
              {formatEther(balanceABigInt)}
            </div>
            <div className="text-sm text-green-600">{(symbolA as string) || "TokenA"}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 font-medium">+</div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">
              {formatEther(balanceBBigInt)}
            </div>
            <div className="text-sm text-blue-600">{(symbolB as string) || "TokenB"}</div>
          </div>
        </div>

        {/* Wei Totals */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total {(symbolA as string) || "TokenA"} (wei):</span>
              <span className="font-mono text-xs">{balanceABigInt.toString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total {(symbolB as string) || "TokenB"} (wei):</span>
              <span className="font-mono text-xs">{balanceBBigInt.toString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Note */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <div className="text-sm text-purple-800">
          <span className="font-semibold">🎓 Academic Note:</span> Balances are displayed in both wei 
          (the smallest unit on Ethereum where 1 ether = 10^18 wei) and human-readable format. 
          Wei format is essential for precise smart contract calculations.
        </div>
      </div>
    </div>
  );
}
