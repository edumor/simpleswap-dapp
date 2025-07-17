import { useEffect, useState } from "react";
import { useAccount, useTransactionReceipt, useWriteContract } from "wagmi";

const TOKEN_A_ADDRESS = "0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA";
const TOKEN_B_ADDRESS = "0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63";
const ERC20_FAUCET_ABI = [
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function TokenFaucet() {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [pending, setPending] = useState(false);

  const { writeContractAsync } = useWriteContract();

  async function faucetA() {
    try {
      setPending(true);
      const hash = await writeContractAsync({
        address: TOKEN_A_ADDRESS,
        abi: ERC20_FAUCET_ABI,
        functionName: "faucet",
      });
      setTxHash(hash as `0x${string}`);
    } catch (e) {
      setPending(false);
    }
  }

  async function faucetB() {
    try {
      setPending(true);
      const hash = await writeContractAsync({
        address: TOKEN_B_ADDRESS,
        abi: ERC20_FAUCET_ABI,
        functionName: "faucet",
      });
      setTxHash(hash as `0x${string}`);
    } catch (e) {
      setPending(false);
    }
  }

  const receipt = useTransactionReceipt({
    hash: txHash,
  });

  // Cuando receipt cambia y existe, la transacción está finalizada
  // y se puede actualizar el estado pending
  useEffect(() => {
    if (receipt) setPending(false);
  }, [receipt]);

  return (
    <div style={{ margin: "1em 0" }}>
      <h3>Token Faucet</h3>
      <button onClick={faucetA} disabled={!address || pending} style={{ marginRight: 8 }}>
        Get TokenA
      </button>
      <button onClick={faucetB} disabled={!address || pending}>
        Get TokenB
      </button>
      {pending && <span style={{ marginLeft: 10 }}>Minting...</span>}
      {txHash && !pending && (
        <div>
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View transaction on Etherscan
          </a>
        </div>
      )}
    </div>
  );
}
