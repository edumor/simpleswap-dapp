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
    <div className="p-4 border-2 border-blue-400 rounded max-w-md mx-auto my-4 bg-base-100">
      <h2 className="text-xl font-bold mb-2 text-blue-800">Liquidity Pool Status</h2>
      <div className="mb-2 text-sm">
        <b>SimpleSwap Contract:</b> <span className="font-mono">{SIMPLE_SWAP_ADDRESS}</span>
        <br />
        <b>TokenA:</b> <span className="font-mono">{TOKEN_A_ADDRESS}</span>
        <br />
        <b>TokenB:</b> <span className="font-mono">{TOKEN_B_ADDRESS}</span>
      </div>
      {isLoading && <div>Loading pool info...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      {Array.isArray(data) && (
        <div className="text-blue-900 font-mono text-lg mb-2">
          <div>
            <b>Reserve TokenA:</b> {Number(data[0] as bigint) / 1e18} <span className="text-xs">(A)</span>
          </div>
          <div>
            <b>Reserve TokenB:</b> {Number(data[1] as bigint) / 1e18} <span className="text-xs">(B)</span>
          </div>
          <div className="mt-2 text-base text-green-800">
            <b>Price:</b>{" "}
            {Number(data[1] as bigint) > 0 ? (Number(data[0] as bigint) / Number(data[1] as bigint)).toFixed(6) : "-"}{" "}
            TokenA per TokenB
            <br />
            <b>Price:</b>{" "}
            {Number(data[0] as bigint) > 0 ? (Number(data[1] as bigint) / Number(data[0] as bigint)).toFixed(6) : "-"}{" "}
            TokenB per TokenA
          </div>
        </div>
      )}
      <button className="mt-2 px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded font-semibold" onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  );
}

export default LiquidityPoolInfo;
