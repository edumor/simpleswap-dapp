import { useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

const SIMPLE_SWAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "reserves",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "totalLiquidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export function LiquidityPoolInfo() {
  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");

  const { data: reserveA, isLoading: loadingReserveA } = useContractRead({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "reserves",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  const { data: reserveB, isLoading: loadingReserveB } = useContractRead({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "reserves",
    args: [TOKEN_B_ADDRESS, TOKEN_A_ADDRESS],
  });

  const { data: totalLiq, isLoading: loadingLiquidity } = useContractRead({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "totalLiquidity",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  const isLoading = loadingReserveA || loadingReserveB || loadingLiquidity;

  return (
    <div className="p-4 border-2 border-blue-400 rounded max-w-md mx-auto my-4 bg-base-100">
      <h2 className="text-xl font-bold mb-2 text-blue-800">Liquidity Pool Status</h2>
      <div className="mb-2 text-sm">
        <b>SimpleSwap Contract:</b> <span className="font-mono">{deployedContractData?.address}</span>
        <br />
        <b>TokenA:</b> <span className="font-mono">{TOKEN_A_ADDRESS}</span>
        <br />
        <b>TokenB:</b> <span className="font-mono">{TOKEN_B_ADDRESS}</span>
      </div>
      {isLoading && <div>Loading pool info...</div>}
      {reserveA !== undefined && reserveB !== undefined && (
        <div className="text-blue-900 font-mono text-lg mb-2">
          <div>
            <b>Reserve TokenA:</b> {Number(reserveA as bigint) / 1e18} <span className="text-xs">(A)</span>
          </div>
          <div>
            <b>Reserve TokenB:</b> {Number(reserveB as bigint) / 1e18} <span className="text-xs">(B)</span>
          </div>
          <div>
            <b>Total Liquidity:</b> {totalLiq ? (Number(totalLiq as bigint) / 1e18).toFixed(6) : "0"}{" "}
            <span className="text-xs">(LP)</span>
          </div>
          <div className="mt-2 text-base text-green-800">
            <b>Price:</b>{" "}
            {Number(reserveB as bigint) > 0
              ? (Number(reserveA as bigint) / Number(reserveB as bigint)).toFixed(6)
              : "-"}{" "}
            TokenA per TokenB
            <br />
            <b>Price:</b>{" "}
            {Number(reserveA as bigint) > 0
              ? (Number(reserveB as bigint) / Number(reserveA as bigint)).toFixed(6)
              : "-"}{" "}
            TokenB per TokenA
          </div>
        </div>
      )}
      {!isLoading && (!reserveA || !reserveB) && <div className="text-gray-600">No liquidity data available</div>}
    </div>
  );
}

export default LiquidityPoolInfo;
