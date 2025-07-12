import React, { useState } from "react";
import { WagmiConfig, createConfig, http, useReadContract, useSimulateContract, useWriteContract, useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import TokenAAbi from "./abi/TokenA.json";
import TokenBAbi from "./abi/TokenB.json";
import SimpleSwapAbi from "./abi/SimpleSwap.json";

const TOKEN_A_ADDRESS = "0xa00dC451faB5B80145d636EeE6A9b794aA81D48C";
const TOKEN_B_ADDRESS = "0x99Cd59d18C1664Ae32baA1144E275Eee34514115";
const SIMPLE_SWAP_ADDRESS = "0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18";

const config = getDefaultConfig({
  appName: "SimpleSwap dApp",
  projectId: "simpleswap-dapp",
  chains: [sepolia],
});
const queryClient = new QueryClient();

function App() {
  const { isConnected } = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState<'A' | 'B'>('A');
  const [price, setPrice] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveMsg, setApproveMsg] = useState<string | null>(null);

  // Consulta de balances del pool (en wei)
  const { data: poolBalanceA } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: TokenAAbi,
    functionName: "balanceOf",
    args: [SIMPLE_SWAP_ADDRESS],
  });
  const { data: poolBalanceB } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: TokenBAbi,
    functionName: "balanceOf",
    args: [SIMPLE_SWAP_ADDRESS],
  });

  // Consulta allowance
  const { data: allowanceA } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: TokenAAbi,
    functionName: "allowance",
    args: [isConnected ? window.ethereum.selectedAddress : undefined, SIMPLE_SWAP_ADDRESS],
    query: { enabled: isConnected && tokenIn === 'A' },
  });
  const { data: allowanceB } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: TokenBAbi,
    functionName: "allowance",
    args: [isConnected ? window.ethereum.selectedAddress : undefined, SIMPLE_SWAP_ADDRESS],
    query: { enabled: isConnected && tokenIn === 'B' },
  });

  // Consulta de precio
  const { refetch: refetchPrice } = useReadContract({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SimpleSwapAbi,
    functionName: 'getAmountOut',
    args: [
      tokenIn === 'A' ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS,
      tokenIn === 'A' ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
      amountIn ? BigInt(amountIn) : 0n,
    ],
    query: { enabled: false },
  });

  // Simular swap
  const { refetch: refetchSim } = useSimulateContract({
    address: SIMPLE_SWAP_ADDRESS,
    abi: SimpleSwapAbi,
    functionName: 'swap',
    args: [
      tokenIn === 'A' ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS,
      tokenIn === 'A' ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS,
      amountIn ? BigInt(amountIn) : 0n,
    ],
    query: { enabled: false },
  });

  // Escribir swap y approve
  const { writeContractAsync } = useWriteContract();

  const handleCheckPrice = async () => {
    setIsFetchingPrice(true);
    const res = await refetchPrice();
    setIsFetchingPrice(false);
    if (res.data) setPrice(res.data.toString());
    else setPrice(null);
  };

  const handleApprove = async () => {
    setApproveMsg(null);
    setIsApproving(true);
    try {
      const tokenAddress = tokenIn === 'A' ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
      const tokenAbi = tokenIn === 'A' ? TokenAAbi : TokenBAbi;
      await writeContractAsync({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'approve',
        args: [SIMPLE_SWAP_ADDRESS, amountIn ? BigInt(amountIn) : 0n],
      });
      setApproveMsg('Aprobación enviada. Espera confirmación en tu wallet.');
    } catch (err: any) {
      setApproveMsg(err?.message || 'Error al aprobar');
    }
    setIsApproving(false);
  };

  const handleSwap = async () => {
    setSwapError(null);
    setSuccessMsg(null);
    setIsSwapping(true);
    const sim = await refetchSim();
    if (!sim.data) {
      setSwapError('No se pudo simular la transacción.');
      setIsSwapping(false);
      return;
    }
    try {
      await writeContractAsync(sim.data.request);
      setSuccessMsg('Transacción enviada. Esperando confirmación...');
    } catch (err: any) {
      setSwapError(err?.message || 'Error al hacer swap');
    }
    setIsSwapping(false);
  };

  // Balances de usuario
  const { address, isConnected } = useAccount();
  const { data: userBalanceA } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: TokenAAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { data: userBalanceB } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: TokenBAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Determinar si allowance es suficiente
  const allowance = tokenIn === 'A' ? allowanceA : allowanceB;
  const needsApprove = amountIn && allowance !== undefined && BigInt(amountIn) > BigInt(allowance || 0);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-950">
              <h1 className="text-2xl font-bold tracking-tight">SimpleSwap dApp</h1>
              <ConnectButton />
            </header>
            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold mb-4 text-center">Pool de Liquidez</h2>
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">TokenA en pool:</span>
                    <span className="font-mono">{poolBalanceA !== undefined && poolBalanceA !== null ? poolBalanceA.toString() : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">TokenB en pool:</span>
                    <span className="font-mono">{poolBalanceB !== undefined && poolBalanceB !== null ? poolBalanceB.toString() : '--'}</span>
                  </div>
                  <div className="flex justify-between mt-4 border-t border-gray-700 pt-4">
                    <span className="font-medium">Tu balance TokenA:</span>
                    <span className="font-mono">{userBalanceA !== undefined && userBalanceA !== null ? userBalanceA.toString() : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tu balance TokenB:</span>
                    <span className="font-mono">{userBalanceB !== undefined && userBalanceB !== null ? userBalanceB.toString() : '--'}</span>
                  </div>
                </div>
                {/* Swap form */}
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-center">Swap</h3>
                  <div className="mb-4 flex gap-2 items-center justify-center">
                    <label className="font-medium">De:</label>
                    <select value={tokenIn} onChange={e => setTokenIn(e.target.value as 'A' | 'B')} className="bg-gray-900 border border-gray-700 rounded px-2 py-1">
                      <option value="A">TokenA</option>
                      <option value="B">TokenB</option>
                    </select>
                  </div>
                  <div className="mb-4 flex gap-2 items-center justify-center">
                    <label className="font-medium">Cantidad (wei):</label>
                    <input
                      type="number"
                      min="0"
                      value={amountIn}
                      onChange={e => setAmountIn(e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded px-2 py-1 w-48 font-mono"
                    />
                  </div>
                  <div className="flex gap-2 justify-center mb-2">
                    <button onClick={handleCheckPrice} disabled={!amountIn || isFetchingPrice} className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded disabled:opacity-50">
                      {isFetchingPrice ? 'Consultando...' : 'Consultar precio'}
                    </button>
                    <button onClick={handleSwap} disabled={!amountIn || isSwapping || needsApprove} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded disabled:opacity-50">
                      {isSwapping ? 'Swapping...' : 'Swap'}
                    </button>
                    <button onClick={handleApprove} disabled={!amountIn || isApproving || !needsApprove} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded disabled:opacity-50">
                      {isApproving ? 'Aprobando...' : 'Aprobar'}
                    </button>
                  </div>
                  {price && (
                    <div className="text-center text-green-400 mb-2">
                      <strong>Recibirás:</strong> {price} {tokenIn === 'A' ? 'TokenB' : 'TokenA'} (wei)
                    </div>
                  )}
                  {swapError && <div className="text-red-400 text-center mb-2">{swapError}</div>}
                  {successMsg && <div className="text-green-400 text-center mb-2">{successMsg}</div>}
                  {approveMsg && <div className="text-yellow-400 text-center mb-2">{approveMsg}</div>}
                </div>
              </div>
            </main>
            <footer className="text-center text-gray-500 py-4 text-xs border-t border-gray-800 bg-gray-950">
              Powered by Scaffold-ETH 2, wagmi, RainbowKit & TailwindCSS
            </footer>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;
