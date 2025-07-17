"use client";

import Link from "next/link";
import { LiquidityPoolInfo } from "../components/LiquidityPoolInfo";
import { ShowPrice } from "../components/ShowPrice";
import { TokenApprove } from "../components/TokenApprove";
import { TokenBalances } from "../components/TokenBalances";
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
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="mb-6 p-4 bg-base-200 rounded">
            <h2 className="text-xl font-bold mb-2">How to Use</h2>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Connect your wallet using the button in the top right corner.</li>
              <li>
                If you don&apos;t have tokens, use the <b>Faucet</b> to get test TokenA and TokenB.
              </li>
              <li>
                Approve your tokens for the SimpleSwap contract using the <b>Approve Token</b> form.
              </li>
              <li>Check the current price between TokenA and TokenB.</li>
              <li>View the liquidity pool status and contract addresses below.</li>
              <li>
                Swap between TokenA and TokenB using the <b>Swap Tokens</b> form.
              </li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Remember to approve the token you want to swap before making a swap.
            </p>
          </div>

          {/* Token Faucet for TokenA and TokenB */}
          <TokenFaucet />

          <div className="mb-6 p-4 bg-base-200 rounded">
            <h2 className="text-lg font-bold mb-2">Contract Addresses (Sepolia)</h2>
            <ul className="ml-2">
              <li>
                <b>TokenA:</b> <span className="font-mono">0xeecbd1B96Fc8f10B08F8dD4462A0c2ed9dB291AA</span>
              </li>
              <li>
                <b>TokenB:</b> <span className="font-mono">0x82177DC90F6ed68fDA2a008c1d026cDF0B4E0d63</span>
              </li>
              <li>
                <b>SimpleSwap:</b> <span className="font-mono">0x93Aa1766Cf4a79267634F2E8669a1c87518791c5</span>
              </li>
            </ul>
          </div>

          <div className="mb-6 p-4 bg-base-200 rounded">
            <h2 className="text-lg font-bold mb-2">Your Token Balances</h2>
            {/* Token balances for connected user */}
            <TokenBalances address={connectedAddress} />
          </div>
          <TokenApprove />
          <ShowPrice />
          <FaucetButton />
          <LiquidityPoolInfo />
          <TokenSwap />
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
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
