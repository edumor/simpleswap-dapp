"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatEther, parseEther } from "viem";
import { SEPOLIA_CONTRACTS, TOKEN_INFO, SEPOLIA_URLS } from "~/contracts/addresses";
import { 
  useGetReserves, 
  useGetAmountOut, 
  useTokenBalance, 
  useTokenAllowance, 
  useApproveToken, 
  useSwapTokens 
} from "~/hooks/contracts/useContracts";
import type { NextPage } from "next";

const SwapPage: NextPage = () => {
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [isReversed, setIsReversed] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Determinar tokens según la dirección
  const tokenIn = isReversed ? SEPOLIA_CONTRACTS.TokenB : SEPOLIA_CONTRACTS.TokenA;
  const tokenOut = isReversed ? SEPOLIA_CONTRACTS.TokenA : SEPOLIA_CONTRACTS.TokenB;
  const tokenInInfo = isReversed ? TOKEN_INFO.TokenB : TOKEN_INFO.TokenA;
  const tokenOutInfo = isReversed ? TOKEN_INFO.TokenA : TOKEN_INFO.TokenB;

  // Hooks de contratos
  const { data: reserves } = useGetReserves(SEPOLIA_CONTRACTS.TokenA, SEPOLIA_CONTRACTS.TokenB);
  const { data: tokenInBalance } = useTokenBalance(tokenIn, address);
  const { data: tokenOutBalance } = useTokenBalance(tokenOut, address);
  const { data: allowance } = useTokenAllowance(tokenIn, address, SEPOLIA_CONTRACTS.SimpleSwap);
  
  const { approve, isPending: isApproving, isConfirmed: isApproved } = useApproveToken();
  const { swap, isPending: isSwapping, isConfirmed: isSwapped } = useSwapTokens();

  // Calcular precio de salida
  const amountInWei = tokenAAmount ? parseEther(tokenAAmount) : 0n;
  const reserveIn = reserves && reserves.length >= 2 ? (isReversed ? reserves[1] : reserves[0]) : 0n;
  const reserveOut = reserves && reserves.length >= 2 ? (isReversed ? reserves[0] : reserves[1]) : 0n;
  
  const { data: amountOut } = useGetAmountOut(
    amountInWei > 0n ? amountInWei.toString() : undefined,
    reserveIn > 0n ? reserveIn.toString() : undefined,
    reserveOut > 0n ? reserveOut.toString() : undefined
  );

  // Actualizar amount out cuando cambie el cálculo
  useEffect(() => {
    if (amountOut && amountOut > 0n) {
      setTokenBAmount(formatEther(amountOut));
    } else if (!tokenAAmount) {
      setTokenBAmount("");
    }
  }, [amountOut, tokenAAmount]);

  // Verificar si necesita aprobación
  const needsApproval = allowance !== undefined && amountInWei > 0n && allowance < amountInWei;

  const handleApprove = () => {
    if (!tokenAAmount || !parseEther(tokenAAmount)) return;
    approve(tokenIn, SEPOLIA_CONTRACTS.SimpleSwap, parseEther(tokenAAmount));
  };

  const handleSwap = () => {
    if (!tokenAAmount || !amountOut || !address) return;
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60); // 20 minutos
    const amountOutMin = (amountOut * 95n) / 100n; // 5% slippage
    
    swap(
      parseEther(tokenAAmount),
      amountOutMin,
      tokenIn,
      tokenOut,
      address,
      deadline
    );
  };

  const handleReverse = () => {
    setIsReversed(!isReversed);
    setTokenAAmount(tokenBAmount);
    setTokenBAmount(tokenAAmount);
  };

  const connectWallet = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Token Swap</span>
          <span className="block text-2xl mb-2">SimpleSwap Exchange</span>
          <span className="block text-sm text-gray-500">Deployed on Sepolia Testnet</span>
        </h1>

        <div className="flex justify-center">
          <div className="bg-base-100 shadow-lg rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-center">Swap Tokens</h2>
            
            {/* Contract Addresses */}
            <div className="mb-4 p-3 bg-base-200 rounded-lg text-xs">
              <div className="font-semibold mb-2">Contract Addresses:</div>
              <div>SimpleSwap: <a href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.SimpleSwap}`} target="_blank" rel="noopener noreferrer" className="link">{SEPOLIA_CONTRACTS.SimpleSwap}</a></div>
              <div>Token A: <a href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.TokenA}`} target="_blank" rel="noopener noreferrer" className="link">{SEPOLIA_CONTRACTS.TokenA}</a></div>
              <div>Token B: <a href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.TokenB}`} target="_blank" rel="noopener noreferrer" className="link">{SEPOLIA_CONTRACTS.TokenB}</a></div>
            </div>
            
            {/* Token Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">From ({tokenInInfo.symbol})</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="0.0"
                  className="input input-bordered flex-1 mr-2"
                  value={tokenAAmount}
                  onChange={(e) => setTokenAAmount(e.target.value)}
                />
                <button className="btn btn-outline">{tokenInInfo.symbol}</button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Balance: {tokenInBalance ? formatEther(tokenInBalance) : "0.00"} {tokenInInfo.symbol}
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center mb-4">
              <button className="btn btn-circle btn-sm" onClick={handleReverse}>
                ↕️
              </button>
            </div>

            {/* Token Output */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">To ({tokenOutInfo.symbol})</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="0.0"
                  className="input input-bordered flex-1 mr-2"
                  value={tokenBAmount}
                  readOnly
                />
                <button className="btn btn-outline">{tokenOutInfo.symbol}</button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Balance: {tokenOutBalance ? formatEther(tokenOutBalance) : "0.00"} {tokenOutInfo.symbol}
              </div>
            </div>

            {/* Connect/Approve/Swap Button */}
            {!isConnected ? (
              <button className="btn btn-primary w-full mb-4" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : needsApproval ? (
              <button 
                className="btn btn-warning w-full mb-4" 
                onClick={handleApprove}
                disabled={isApproving || !tokenAAmount}
              >
                {isApproving ? "Approving..." : `Approve ${tokenInInfo.symbol}`}
              </button>
            ) : (
              <button 
                className="btn btn-primary w-full mb-4" 
                onClick={handleSwap}
                disabled={isSwapping || !tokenAAmount || !amountOut}
              >
                {isSwapping ? "Swapping..." : "Swap Tokens"}
              </button>
            )}

            {/* Disconnect */}
            {isConnected && (
              <button className="btn btn-ghost btn-sm w-full" onClick={() => disconnect()}>
                Disconnect Wallet
              </button>
            )}

            {/* Exchange Rate */}
            <div className="text-center text-sm text-gray-500 mt-4">
              {reserves && reserves.length >= 2 && reserves[0] > 0n && reserves[1] > 0n ? (
                <div>
                  <div>1 {TOKEN_INFO.TokenA.symbol} = {(Number(formatEther(reserves[1])) / Number(formatEther(reserves[0]))).toFixed(6)} {TOKEN_INFO.TokenB.symbol}</div>
                  <div>Pool Fee: 0.3%</div>
                </div>
              ) : (
                <div>Pool not initialized</div>
              )}
            </div>
          </div>
        </div>

        {/* Pool Information */}
        <div className="mt-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">Pool Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Token A Reserve</div>
              <div className="text-lg font-bold">
                {reserves && reserves.length >= 2 ? formatEther(reserves[0]) : "0.00"} {TOKEN_INFO.TokenA.symbol}
              </div>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Token B Reserve</div>
              <div className="text-lg font-bold">
                {reserves && reserves.length >= 2 ? formatEther(reserves[1]) : "0.00"} {TOKEN_INFO.TokenB.symbol}
              </div>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Your Address</div>
              <div className="text-sm font-mono break-all">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure you're connected to Sepolia testnet</li>
            <li>Get test ETH from <a href={SEPOLIA_URLS.faucet} target="_blank" rel="noopener noreferrer" className="link">Sepolia Faucet</a></li>
            <li>You need Token A or Token B to trade (contact admin for test tokens)</li>
            <li>Approve the token first, then swap</li>
            <li>Check transactions on <a href={`${SEPOLIA_URLS.etherscan}/address/${SEPOLIA_CONTRACTS.SimpleSwap}`} target="_blank" rel="noopener noreferrer" className="link">Sepolia Etherscan</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
