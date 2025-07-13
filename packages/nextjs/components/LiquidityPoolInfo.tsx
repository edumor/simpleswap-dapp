import { useContractRead } from "wagmi";

const SIMPLE_SWAP_ADDRESS = "0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18";
const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";

const SIMPLE_SWAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export function LiquidityPoolInfo() {
  const { data, isLoading, error, refetch } = useContractRead({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SIMPLE_SWAP_ABI,
    functionName: "getReserves",
    args: [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS],
  });

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-4">
      <h2 className="text-lg font-bold mb-2">Liquidity Pool</h2>
      {isLoading && <div>Loading pool info...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      {Array.isArray(data) && (
        <div className="text-blue-700 font-mono">
          Reserve TokenA: {Number(data[0] as bigint) / 1e18}
          <br />
          Reserve TokenB: {Number(data[1] as bigint) / 1e18}
        </div>
      )}
      <button className="mt-2 px-3 py-1 bg-gray-200 rounded" onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  );
}

export default LiquidityPoolInfo;
