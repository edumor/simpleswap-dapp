// ...existing code...
import { useContractRead } from "wagmi";

const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";
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

  return (
    <ul>
      <li>
        <b>TokenA (wei):</b> {balanceA != null ? balanceA.toString() : "-"}
      </li>
      <li>
        <b>TokenB (wei):</b> {balanceB != null ? balanceB.toString() : "-"}
      </li>
    </ul>
  );
}
