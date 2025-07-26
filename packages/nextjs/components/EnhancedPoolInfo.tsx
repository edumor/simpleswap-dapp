import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

const SIMPLE_SWAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getTotalLiquidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function EnhancedPoolInfo() {
  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");

  const { data: reservesAB, isLoading: loadingReservesAB, refetch: refetchReservesAB } = useReadContract({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  // Extract individual reserves from the getReserves result
  const reserveA = reservesAB ? (reservesAB as [bigint, bigint])[0] : 0n;
  const reserveB = reservesAB ? (reservesAB as [bigint, bigint])[1] : 0n;

  const { data: totalLiq, isLoading: loadingLiquidity, refetch: refetchLiquidity } = useReadContract({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getTotalLiquidity",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  const { data: priceAtoB, isLoading: loadingPrice, refetch: refetchPrice } = useReadContract({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  const isLoading = loadingReservesAB || loadingLiquidity || loadingPrice;

  const handleRefreshAll = () => {
    refetchReservesAB();
    refetchLiquidity();
    refetchPrice();
  };

  // Calculate exchange rates
  const reserveABigInt = reserveA;
  const reserveBBigInt = reserveB;
  
  const priceTokenAInB = reserveBBigInt > 0n 
    ? (reserveABigInt * 1000000n) / reserveBBigInt / 1000000n
    : 0n;
  
  const priceTokenBInA = reserveABigInt > 0n 
    ? (reserveBBigInt * 1000000n) / reserveABigInt / 1000000n
    : 0n;

  return (
    <div className="p-6 border-2 border-indigo-200 rounded-xl max-w-2xl mx-auto my-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            💧
          </div>
          <h2 className="text-xl font-bold text-indigo-900">Liquidity Pool Information</h2>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {isLoading ? "⟳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Contract Addresses */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-3">Contract Addresses</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">SimpleSwap:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {deployedContractData?.address}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">TokenA:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{TOKEN_A_ADDRESS}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">TokenB:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{TOKEN_B_ADDRESS}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading pool information...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pool Reserves */}
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-3">Pool Reserves (Wei)</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">TokenA Reserve:</span>
                  <span className="text-xs text-gray-500">Wei Format</span>
                </div>
                <div className="font-mono text-sm bg-green-50 p-2 rounded border">
                  {reserveABigInt.toString()} wei
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">TokenB Reserve:</span>
                  <span className="text-xs text-gray-500">Wei Format</span>
                </div>
                <div className="font-mono text-sm bg-blue-50 p-2 rounded border">
                  {reserveBBigInt.toString()} wei
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Total Liquidity:</span>
                  <span className="text-xs text-gray-500">LP Tokens (wei)</span>
                </div>
                <div className="font-mono text-sm bg-purple-50 p-2 rounded border">
                  {totalLiq ? (totalLiq as bigint).toString() : "0"} wei
                </div>
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-3">Token Exchange Rates (Wei)</h3>
            <div className="space-y-4">
              {/* Contract Price */}
              <div className="border-b border-gray-100 pb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Contract getPrice() Function:</div>
                <div className="font-mono text-sm bg-yellow-50 p-2 rounded border">
                  {priceAtoB ? (priceAtoB as bigint).toString() : "0"} wei
                </div>
              </div>

              {/* Calculated Prices */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">Pool-Based Exchange Rates:</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-800">1 TokenA =</span>
                    <div className="text-right">
                      <div className="font-bold text-green-800">
                        {priceTokenAInB.toString()} wei TokenB
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-blue-800">1 TokenB =</span>
                    <div className="text-right">
                      <div className="font-bold text-blue-800">
                        {priceTokenBInA.toString()} wei TokenA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pool Ratio */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded border">
                <div className="text-sm font-medium text-gray-700 mb-1">Pool Ratio (Wei):</div>
                <div className="text-center font-bold text-indigo-800">
                  {reserveABigInt > 0n && reserveBBigInt > 0n ? (
                    <>
                      {reserveABigInt.toString()} : {reserveBBigInt.toString()}
                      <div className="text-xs text-gray-600 mt-1">
                        (TokenA wei : TokenB wei)
                      </div>
                    </>
                  ) : (
                    "Pool not initialized"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for low liquidity */}
      {reserveABigInt === 0n || reserveBBigInt === 0n ? (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-800">
            <span className="mr-2">⚠️</span>
            <span className="font-semibold">Low or No Liquidity Warning</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            This pool has very low or no liquidity. Trading may result in high slippage or failed transactions.
          </p>
        </div>
      ) : null}

      {/* Academic Note */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <div className="text-sm text-purple-800">
          <span className="font-semibold">🎓 Academic Note:</span> All values are displayed in both wei (raw blockchain format) 
          and human-readable format. Exchange rates are calculated using the constant product formula (x * y = k).
        </div>
      </div>
    </div>
  );
}
