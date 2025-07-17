// ...existing code...
import React, { useState } from "react";
import { useContractRead, useWriteContract } from "wagmi";

const TOKEN_A_ADDRESS = "0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA";
const TOKEN_B_ADDRESS = "0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63";
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
];

export function TokenBalances({ address }: { address?: string }) {
  const { data: balanceA } = useContractRead({
    address: TOKEN_A_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });
  const { data: balanceB } = useContractRead({
    address: TOKEN_B_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const [faucetStatus, setFaucetStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [faucetMsg, setFaucetMsg] = useState<string>("");
  const { writeContractAsync } = useWriteContract();
  const handleFaucet = async () => {
    if (!address) return;
    setFaucetStatus("pending");
    setFaucetMsg("");
    try {
      // Mint 1 token (1e18 wei) to the connected wallet in both TokenA and TokenB
      const txA = await writeContractAsync({
        address: TOKEN_A_ADDRESS,
        abi: [
          {
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "public",
            type: "function",
          },
        ],
        functionName: "mint",
        args: [address, BigInt("1000000000000000000")],
      });
      const txB = await writeContractAsync({
        address: TOKEN_B_ADDRESS,
        abi: [
          {
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "public",
            type: "function",
          },
        ],
        functionName: "mint",
        args: [address, BigInt("1000000000000000000")],
      });
      setFaucetMsg(`Faucet successful!\nTokenA tx: ${txA}\nTokenB tx: ${txB}`);
      setFaucetStatus("success");
    } catch {
      setFaucetMsg("Error requesting faucet");
      setFaucetStatus("error");
    }
  };
  return (
    <div>
      <div style={{ marginBottom: "8px", color: "#d97706", fontWeight: "bold" }}>
        ⚠️ The balances shown below correspond to the currently connected wallet. If you connect a different wallet, you
        will see the balances for that wallet only.
      </div>
      <ul>
        <li>
          <b>TokenA (wei):</b> {balanceA != null ? balanceA.toString() : "-"}
        </li>
        <li>
          <b>TokenB (wei):</b> {balanceB != null ? balanceB.toString() : "-"}
        </li>
      </ul>
      <button
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
        disabled={faucetStatus === "pending" || !address}
        onClick={handleFaucet}
      >
        {faucetStatus === "pending" ? "Requesting Faucet..." : "Get Test Tokens (Faucet)"}
      </button>
      {faucetMsg && (
        <div style={{ marginTop: "8px", color: faucetStatus === "error" ? "#dc2626" : "#059669" }}>{faucetMsg}</div>
      )}
    </div>
  );
}
