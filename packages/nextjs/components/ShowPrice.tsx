import { useContractRead } from "wagmi";

const SIMPLE_SWAP_ADDRESS = "0x06eA28a8ADf22736778A54802CeEbcBeC14B3B34";
const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";

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
  const { data, isLoading, error, refetch } = useContractRead({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getPrice",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-4">
      <h2 className="text-lg font-bold mb-2">TokenA/TokenB Price</h2>
      {isLoading && <div>Loading price...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      {typeof data === "bigint" && (
        <div className="text-blue-700 font-mono">1 TokenA = {Number(data) / 1e18} TokenB</div>
      )}
      <button className="mt-2 px-3 py-1 bg-gray-200 rounded" onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  );
}

export default ShowPrice;
