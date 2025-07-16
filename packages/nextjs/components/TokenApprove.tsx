import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";

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
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");
  const tokenAddress = token === "A" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;

  const { writeContractAsync } = useWriteContract();

  const handleApprove = async () => {
    if (!deployedContractData?.address) return;

    setTxStatus("pending");
    setErrorMsg(null);
    setTxHash(null);
    try {
      const txHash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [deployedContractData.address, amount ? BigInt(amount) : 0n],
      });
      if (txHash) setTxHash(txHash);
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
        <label className="block text-xs text-gray-500 mb-1">Amount to approve (in wei)</label>
        <input
          type="number"
          placeholder="Enter the amount in wei (e.g., 1000000000000000000 for 1 token with 18 decimals)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <div className="text-xs text-blue-600 mt-1">
          <b>Note:</b> Enter the amount in <b>wei</b> (the smallest unit, usually 18 decimals for ERC20).
        </div>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        disabled={txStatus === "pending" || !isConnected || !amount}
        onClick={handleApprove}
      >
        {txStatus === "pending" ? "Approving..." : "Approve"}
      </button>
      {txStatus === "success" && <div className="text-green-600 mt-2">Approval successful!</div>}
      {txHash && (
        <div className="text-xs text-gray-700 mt-2">
          Transaction hash: <span style={{ wordBreak: "break-all" }}>{txHash}</span>
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Etherscan
          </a>
        </div>
      )}
      {txStatus === "error" && <div className="text-red-600 mt-2">Error: {errorMsg}</div>}
    </div>
  );
}

export default TokenApprove;
