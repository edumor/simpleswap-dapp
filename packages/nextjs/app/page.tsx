"use client";

import Link from "next/link";
import { ImprovedTokenApprove } from "../components/ImprovedTokenApprove";
import { StepByStepGuide } from "../components/StepByStepGuide";
import { WalletGuide } from "../components/WalletGuide";
import { EnhancedTokenBalances } from "../components/EnhancedTokenBalances";
import { EnhancedPoolInfo } from "../components/EnhancedPoolInfo";
import { EnhancedPriceInfo } from "../components/EnhancedPriceInfo";
import { TokenFaucet } from "../components/TokenFaucet";
import { TokenSwap } from "../components/TokenSwap";
import { FaucetButton } from "../components/scaffold-eth/FaucetButton";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SimpleSwap DEX
            </h1>
            <h2 className="text-lg sm:text-xl text-gray-600 mb-6 font-light">
              Decentralized Token Exchange powered by an optimized AMM
            </h2>
            <div className="flex justify-center items-center space-x-2 flex-col">
              <p className="my-2 font-medium text-sm sm:text-base">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
          </div>

          {/* Protocol Features Banner */}
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-bold">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Protocol Features</h3>
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              Optimized for efficiency and security: Advanced gas optimization techniques, comprehensive security audit coverage,
              and extensive test suite (87%+ coverage) ensure reliable token exchange operations on Sepolia testnet.
            </p>
          </div>

          {/* Wallet Guide for New Users */}
          <WalletGuide />

          {/* Step by Step Guide */}
          <StepByStepGuide />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Token Faucet */}
              <TokenFaucet />

              {/* Token Balances */}
              <div className="p-6 sm:p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm">
                <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                    💰
                  </div>
                  Token Balances
                </h2>
                {connectedAddress ? (
                  <EnhancedTokenBalances
                    tokenAAddress="0xA61A5c03088c808935C86F409Ace89E582842F82"
                    tokenBAddress="0x9205f067C913C1Edb642609342ca8d58d60ae95B"
                    userAddress={connectedAddress}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">Connect your wallet to view balances</p>
                )}
              </div>

              {/* Price Information */}
              <EnhancedPriceInfo />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Token Approve */}
              <ImprovedTokenApprove />

              {/* Token Swap */}
              <TokenSwap />
            </div>
          </div>

          {/* Protocol Information Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Smart Contracts */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <h2 className="text-lg font-bold mb-4 text-blue-900">Smart Contracts</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded-lg border gap-2">
                  <div>
                    <span className="font-semibold text-blue-800 text-sm">TokenA:</span>
                    <div className="font-mono text-xs text-gray-600 break-all">0xA61A5c03088c808935C86F409Ace89E582842F82</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">✓ Verified</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded-lg border gap-2">
                  <div>
                    <span className="font-semibold text-blue-800 text-sm">TokenB:</span>
                    <div className="font-mono text-xs text-gray-600 break-all">0x9205f067C913C1Edb642609342ca8d58d60ae95B</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">✓ Verified</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded-lg border gap-2">
                  <div>
                    <span className="font-semibold text-blue-800 text-sm">SimpleSwap Router:</span>
                    <div className="font-mono text-xs text-gray-600 break-all">0x5F1C2c20248BA5A444256c21592125EaF08b23A1</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">✓ Verified</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-700 mt-4 p-3 bg-blue-100 rounded-lg">
                All contracts implement best practices: comprehensive NatSpec documentation, optimized error handling, and efficient storage patterns.
              </p>
            </div>

            {/* Liquidity Pool Information */}
            <EnhancedPoolInfo />
          </div>

          {/* Additional Tools */}
          <div className="mt-8 text-center">
            <FaucetButton />
          </div>

          {/* Protocol Information Footer */}
          <div className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200 rounded-xl text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">SimpleSwap Protocol</h3>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              Production-grade DEX infrastructure with automated testing, continuous deployment, and comprehensive protocol monitoring
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ 87%+ Test Coverage</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Sepolia Testnet</span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">✓ Gas Optimized</span>
            </div>
          </div>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
