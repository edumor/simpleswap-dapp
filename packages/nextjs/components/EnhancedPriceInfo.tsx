import { useState } from "react";
import { useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";
const SIMPLE_SWAP_ADDRESS = "0x5F1C2c20248BA5A444256c21592125EaF08b23A1";

const SIMPLE_SWAP_ABI = [
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
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "reserveIn", type: "uint256" },
      { internalType: "uint256", name: "reserveOut", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
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
] as const;

export function EnhancedPriceInfo() {
  const [simulationAmount, setSimulationAmount] = useState("1");
  const [selectedDirection, setSelectedDirection] = useState<"AtoB" | "BtoA">("AtoB");

  // Get basic price from contract
  const { data: priceAtoB, isLoading: loadingPriceAtoB, refetch: refetchPriceAtoB } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  const { data: priceBtoA, isLoading: loadingPriceBtoA, refetch: refetchPriceBtoA } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS],
  });

  // Get reserves for manual calculation
  const { data: reservesAB, isLoading: loadingReservesAB } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  // Extract individual reserves from the getReserves result
  const reserveA = reservesAB ? (reservesAB as [bigint, bigint])[0] : 0n;
  const reserveB = reservesAB ? (reservesAB as [bigint, bigint])[1] : 0n;

  // Simulate swap amount
  const simulationAmountWei = simulationAmount ? parseEther(simulationAmount) : 0n;
  
  const { data: simulatedOutputAtoB, isLoading: loadingSimAtoB } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS as `0x${string}`,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getAmountOut",
    args: selectedDirection === "AtoB" 
      ? [simulationAmountWei, reserveA, reserveB]
      : [simulationAmountWei, reserveB, reserveA],
  });

  const isLoading = loadingPriceAtoB || loadingPriceBtoA || loadingReservesAB;

  const handleRefreshAll = () => {
    refetchPriceAtoB();
    refetchPriceBtoA();
  };

  // Calculate manual exchange rates from reserves
  const reserveABigInt = reserveA;
  const reserveBBigInt = reserveB;

  return (
    <div className="p-6 border-2 border-green-200 rounded-xl max-w-2xl mx-auto my-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            💱
          </div>
          <h2 className="text-xl font-bold text-green-900">Token Price Information</h2>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLoading ? "⟳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading price information...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contract Prices */}
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-4">Contract getPrice() Results (Wei)</h3>
            
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">TokenA → TokenB Price:</div>
                <div className="font-mono text-sm bg-green-50 p-2 rounded border">
                  {priceAtoB ? (priceAtoB as bigint).toString() : "0"} wei
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">TokenB → TokenA Price:</div>
                <div className="font-mono text-sm bg-blue-50 p-2 rounded border">
                  {priceBtoA ? (priceBtoA as bigint).toString() : "0"} wei
                </div>
              </div>
            </div>
          </div>

          {/* Reserve-Based Calculations */}
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-4">Reserve-Based Calculations (Wei)</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Pool Reserves (Wei):</div>
                <div className="space-y-2">
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                    TokenA: {reserveABigInt.toString()} wei
                  </div>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                    TokenB: {reserveBBigInt.toString()} wei
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Manual Price Calculation (Wei):</div>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded border">
                    <div className="text-sm text-green-800 font-mono">
                      1 TokenA = {reserveBBigInt > 0n ? ((reserveBBigInt * parseEther("1")) / reserveABigInt).toString() : "0"} wei TokenB
                    </div>
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded border">
                    <div className="text-sm text-blue-800 font-mono">
                      1 TokenB = {reserveABigInt > 0n ? ((reserveABigInt * parseEther("1")) / reserveBBigInt).toString() : "0"} wei TokenA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Simulation */}
      <div className="mt-6 bg-white p-4 rounded-lg border border-green-100">
        <h3 className="font-semibold text-green-800 mb-4">Swap Simulation</h3>
        
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
              type="number"
              value={simulationAmount}
              onChange={(e) => setSimulationAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction:</label>
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value as "AtoB" | "BtoA")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="AtoB">TokenA → TokenB</option>
              <option value="BtoA">TokenB → TokenA</option>
            </select>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Expected Output (Wei):</div>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
              {loadingSimAtoB ? (
                <span className="text-gray-500">Loading...</span>
              ) : simulatedOutputAtoB ? (
                <div>
                  <div className="font-semibold text-green-700 font-mono">
                    {(simulatedOutputAtoB as bigint).toString()} wei {selectedDirection === "AtoB" ? "TokenB" : "TokenA"}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>
        </div>
        
        {simulatedOutputAtoB && simulationAmount && (
          <div className="mt-3 p-3 bg-green-50 rounded border">
            <div className="text-sm text-green-800">
              <strong>Exchange Rate (Wei):</strong> 1 {selectedDirection === "AtoB" ? "TokenA" : "TokenB"} = {
                ((simulatedOutputAtoB as bigint * parseEther("1")) / parseEther(simulationAmount)).toString()
              } wei {selectedDirection === "AtoB" ? "TokenB" : "TokenA"}
            </div>
          </div>
        )}
      </div>

      {/* Academic Note */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <div className="text-sm text-green-800">
          <span className="font-semibold">🎓 Academic Note:</span> All prices and amounts are displayed in wei 
          (1 ether = 10^18 wei) for precise blockchain calculations. 
          The getAmountOut function includes slippage and fees.
        </div>
      </div>
    </div>
  );
}
