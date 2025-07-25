import { useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

// ABI mínima para getPrice
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
];

export function ShowPrice() {
  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");

  const { data, isLoading, error, refetch } = useContractRead({
    address: deployedContractData?.address,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-4">
      <h2 className="text-lg font-bold mb-2">TokenA/TokenB Price (Wei)</h2>
      {isLoading && <div>Loading price...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      {typeof data === "bigint" && (
        <div className="text-blue-700 font-mono">1 TokenA = {data.toString()} TokenB (wei)</div>
      )}
      <button className="mt-2 px-3 py-1 bg-gray-200 rounded" onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  );
}

export default ShowPrice;
