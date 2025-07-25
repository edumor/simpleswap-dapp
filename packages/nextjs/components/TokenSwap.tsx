import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

const SIMPLE_SWAP_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function TokenSwap() {
  const { address, isConnected } = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState("1"); // default 1%
  const [amountOutMin, setAmountOutMin] = useState("");
  const [tokenFrom, setTokenFrom] = useState("A");

  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");

  // Derivados de tokenFrom
  const fromAddress = tokenFrom === "A" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
  const toAddress = tokenFrom === "A" ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS;
  const path = [fromAddress, toAddress];
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hora

  // Obtener reservas actuales usando el mapping reserves
  const { data: reserveIn } = useReadContract({
    address: deployedContractData?.address,
    abi: [
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
    ],
    functionName: "reserves",
    args: [fromAddress, toAddress],
  });

  const { data: reserveOut } = useReadContract({
    address: deployedContractData?.address,
    abi: [
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
    ],
    functionName: "reserves",
    args: [toAddress, fromAddress],
  });

  // Llamada a getAmountOut para calcular automáticamente el mínimo a recibir
  const { data: amountOutData } = useReadContract({
    address: deployedContractData?.address,
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "reserveIn", type: "uint256" },
          { internalType: "uint256", name: "reserveOut", type: "uint256" },
        ],
        name: "getAmountOut",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
      },
    ],
    functionName: "getAmountOut",
    args:
      amountIn && reserveIn !== undefined && reserveOut !== undefined
        ? [BigInt(amountIn), reserveIn, reserveOut]
        : undefined,
  });

  // (Ya no se usa setReserves, reserves)

  // Actualizar amountOutMin automáticamente según getAmountOut y slippage
  useEffect(() => {
    if (amountOutData) {
      const slippagePct = parseFloat(slippage) / 100;
      const minOut = BigInt(amountOutData - (amountOutData * BigInt(Math.floor(slippagePct * 10000))) / 10000n);
      setAmountOutMin(minOut > 0n ? minOut.toString() : "0");
    } else {
      setAmountOutMin("");
    }
  }, [amountOutData, slippage]);

  const { writeContractAsync } = useWriteContract();
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!deployedContractData?.address) return;

    setTxStatus("pending");
    setErrorMsg(null);
    setTxHash(null);
    try {
      const txHash = await writeContractAsync({
        address: deployedContractData.address,
        abi: SIMPLE_SWAP_ABI,
        functionName: "swapExactTokensForTokens",
        args: [amountIn ? BigInt(amountIn) : 0n, amountOutMin ? BigInt(amountOutMin) : 0n, path, address, deadline],
      });
      if (txHash) setTxHash(txHash);
      setTxStatus("success");
    } catch (err: any) {
      setErrorMsg(err?.message || "Error");
      setTxStatus("error");
    }
  };

  // Validaciones visuales
  const inputError = !amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0;

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-4 bg-base-100">
      <h2 className="text-lg font-bold mb-2">Swap Tokens</h2>
      <p className="text-sm text-gray-500 mb-2">
        Intercambia TokenA por TokenB o viceversa. Recuerda aprobar el token antes de hacer swap.
      </p>
      <div className="mb-2">
        <label className="mr-2">De:</label>
        <select value={tokenFrom} onChange={e => setTokenFrom(e.target.value)} className="border rounded px-2 py-1">
          <option value="A">TokenA</option>
          <option value="B">TokenB</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Amount to swap (in wei)</label>
        <input
          type="number"
          placeholder="Enter the amount in wei (e.g., 1000000000000000000 for 1 token with 18 decimals)"
          value={amountIn}
          onChange={e => setAmountIn(e.target.value)}
          className={`border px-2 py-1 rounded w-full ${inputError ? "border-red-500" : ""}`}
        />
        <div className="text-xs text-blue-600 mt-1">
          <b>Note:</b> Enter the amount in <b>wei</b> (the smallest unit, usually 18 decimals for ERC20).
        </div>
        {inputError && <div className="text-xs text-red-500 mt-1">Enter a valid amount greater than 0.</div>}
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Slippage (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={slippage}
          onChange={e => setSlippage(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Minimum amount to receive (in wei, auto)</label>
        <input
          type="text"
          value={amountOutMin}
          readOnly
          className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-700"
        />
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        disabled={txStatus === "pending" || inputError || !amountOutMin || !isConnected}
        onClick={handleSwap}
      >
        {txStatus === "pending" ? "Realizando swap..." : "Swap"}
      </button>
      {txStatus === "success" && <div className="text-green-600 mt-2">¡Swap realizado con éxito!</div>}
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

export default TokenSwap;
