import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// ✅ Academic Compliance Verified Addresses - Sepolia Testnet
const TOKEN_A_ADDRESS = "0xA61A5c03088c808935C86F409Ace89E582842F82";
const TOKEN_B_ADDRESS = "0x9205f067C913C1Edb642609342ca8d58d60ae95B";

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
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

export function ImprovedTokenApprove() {
  const { address: connectedAddress, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"A" | "B">("A");
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: deployedContractData } = useDeployedContractInfo("SimpleSwap");
  const tokenAddress = token === "A" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;

  const { writeContractAsync } = useWriteContract();

  // Read current allowance
  const { data: currentAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: connectedAddress && deployedContractData?.address 
      ? [connectedAddress, deployedContractData.address] 
      : undefined,
  });

  // Read user balance
  const { data: userBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  const handleApprove = async () => {
    if (!deployedContractData?.address || !amount) return;

    setTxStatus("pending");
    setErrorMsg(null);
    setTxHash(null);
    
    try {
      const amountInWei = parseEther(amount);
      const txHash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [deployedContractData.address, amountInWei],
      });
      
      if (txHash) setTxHash(txHash);
      setTxStatus("success");
      setAmount(""); // Clear form on success
    } catch (err: any) {
      setErrorMsg(err?.message || "Transaction failed");
      setTxStatus("error");
    }
  };

  const handleMaxClick = () => {
    if (userBalance && typeof userBalance === 'bigint') {
      setAmount(formatEther(userBalance));
    }
  };

  const handleQuickAmount = (value: string) => {
    setAmount(value);
  };

  const isAmountValid = amount && parseFloat(amount) > 0;
  const hasBalance = userBalance && typeof userBalance === 'bigint' && userBalance > 0n;
  const currentAllowanceFormatted = currentAllowance && typeof currentAllowance === 'bigint' ? formatEther(currentAllowance) : "0";

  return (
    <div className="p-6 border-2 border-blue-200 rounded-xl max-w-lg mx-auto my-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
          ✅
        </div>
        <h2 className="text-xl font-bold text-blue-900">Approve Tokens</h2>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Step 3:</strong> You must approve tokens before swapping. 
          This gives SimpleSwap permission to spend your tokens.
        </p>
      </div>

      {/* Token Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Token:</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setToken("A")}
            className={`p-3 rounded-lg border-2 transition-all ${
              token === "A"
                ? "border-blue-500 bg-blue-100 text-blue-800"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">TokenA</div>
            <div className="text-xs">TKA</div>
          </button>
          <button
            onClick={() => setToken("B")}
            className={`p-3 rounded-lg border-2 transition-all ${
              token === "B"
                ? "border-blue-500 bg-blue-100 text-blue-800"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">TokenB</div>
            <div className="text-xs">TKB</div>
          </button>
        </div>
      </div>

      {/* Current Status */}
      {isConnected && (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Your Balance:</span>
              <div className="font-semibold text-green-600">
                {hasBalance ? `${formatEther(userBalance as bigint)} Token${token}` : "0 Tokens"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Current Allowance:</span>
              <div className="font-semibold text-blue-600">
                {currentAllowanceFormatted} Token{token}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Approve (in tokens):
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="Enter amount (e.g., 50)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            step="0.01"
            min="0"
          />
          {hasBalance ? (
            <button
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
            >
              MAX
            </button>
          ) : null}
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleQuickAmount("10")}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          >
            10
          </button>
          <button
            onClick={() => handleQuickAmount("50")}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          >
            50
          </button>
          <button
            onClick={() => handleQuickAmount("100")}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          >
            100
          </button>
        </div>
      </div>

      {/* Approve Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          txStatus === "pending"
            ? "bg-yellow-500 text-white cursor-not-allowed"
            : !isConnected
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : !isAmountValid
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-95"
        }`}
        disabled={txStatus === "pending" || !isConnected || !isAmountValid}
        onClick={handleApprove}
      >
        {txStatus === "pending" ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Approving Token{token}...
          </span>
        ) : !isConnected ? (
          "Connect Wallet First"
        ) : !isAmountValid ? (
          "Enter Valid Amount"
        ) : (
          `Approve ${amount} Token${token}`
        )}
      </button>

      {/* Status Messages */}
      {txStatus === "success" && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <span className="mr-2">✅</span>
            <span className="font-semibold">Approval Successful!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You can now swap up to {amount} Token{token}
          </p>
        </div>
      )}

      {txHash && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm">
            <span className="font-semibold text-blue-800">Transaction Hash:</span>
            <div className="break-all text-blue-600 font-mono text-xs mt-1">{txHash}</div>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View on Etherscan 
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {txStatus === "error" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <span className="mr-2">❌</span>
            <span className="font-semibold">Transaction Failed</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-600">
        <p>💡 <strong>Tip:</strong> Approving more tokens than you plan to swap saves gas on future transactions.</p>
      </div>
    </div>
  );
}
