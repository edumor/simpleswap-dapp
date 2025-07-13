"use client";

import Link from "next/link";
import { LiquidityPoolInfo } from "../components/LiquidityPoolInfo";
import { ShowPrice } from "../components/ShowPrice";
import { TokenApprove } from "../components/TokenApprove";
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
            <h2 className="text-xl font-bold mb-2">Instrucciones de uso</h2>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Conecta tu billetera usando el botón de la esquina superior derecha.</li>
              <li>
                Si no tienes tokens, utiliza el <b>Faucet</b> para obtener TokenA y TokenB de prueba.
              </li>
              <li>
                Aprueba el uso de tus tokens con el contrato SimpleSwap usando el formulario <b>Approve Token</b>.
              </li>
              <li>Consulta el precio actual de intercambio entre TokenA y TokenB.</li>
              <li>Visualiza el estado de la pool de liquidez.</li>
              <li>
                Realiza swaps entre TokenA y TokenB usando el formulario <b>Swap Tokens</b>.
              </li>
            </ol>
            <p className="mt-2 text-sm text-gray-500">
              Recuerda aprobar el token que deseas intercambiar antes de hacer un swap.
            </p>
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
