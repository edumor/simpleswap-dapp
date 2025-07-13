import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";

const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";
const SIMPLE_SWAP_ADDRESS = "0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18";

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

export function TokenApprove() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("A");
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tokenAddress = token === "A" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;

  const { writeContractAsync } = useWriteContract();

  const handleApprove = async () => {
    setTxStatus("pending");
    setErrorMsg(null);
    try {
      await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [SIMPLE_SWAP_ADDRESS, amount ? parseEther(amount) : 0n],
      });
      setTxStatus("success");
    } catch (err: any) {
      setErrorMsg(err?.message || "Error");
      setTxStatus("error");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-4 bg-base-100">
      <h2 className="text-lg font-bold mb-2">Approve Token</h2>
      <div className="mb-2">
        <label className="mr-2">Token:</label>
        <select value={token} onChange={e => setToken(e.target.value)} className="border rounded px-2 py-1">
          <option value="A">TokenA</option>
          <option value="B">TokenB</option>
        </select>
      </div>
      <div className="mb-2">
        <input
          type="number"
          placeholder="Amount to approve"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        disabled={txStatus === "pending" || !isConnected || !amount}
        onClick={handleApprove}
      >
        {txStatus === "pending" ? "Approving..." : "Approve"}
      </button>
      {txStatus === "success" && <div className="text-green-600 mt-2">Approval successful!</div>}
      {txStatus === "error" && <div className="text-red-600 mt-2">Error: {errorMsg}</div>}
    </div>
  );
}

export default TokenApprove;
