"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, ExternalLinkIcon } from "@heroicons/react/24/outline";

interface Step {
  number: number;
  title: string;
  description: string;
  details: string[];
  link?: {
    text: string;
    url: string;
  };
}

const steps: Step[] = [
  {
    number: 1,
    title: "Install MetaMask",
    description: "MetaMask is a crypto wallet that secures your private keys and lets you interact with Web3 apps. It's browser-based and free.",
    details: [
      "MetaMask is a browser extension that acts as your digital wallet for cryptocurrency",
      "It stores your private keys securely and signs transactions on your behalf",
      "Available for Chrome, Firefox, Safari, and Edge",
    ],
    link: {
      text: "Download MetaMask",
      url: "https://metamask.io",
    },
  },
  {
    number: 2,
    title: "Connect to Sepolia Testnet",
    description: "SimpleSwap runs on the Sepolia testnet. MetaMask will automatically prompt you to switch networks when you connect.",
    details: [
      "Sepolia is a free test network for Ethereum developers",
      "Any transactions on Sepolia have no real-world value",
      "You can manually switch networks in MetaMask if needed: click the network dropdown at the top",
    ],
    link: undefined,
  },
  {
    number: 3,
    title: "Get Test ETH",
    description: "You need Sepolia ETH to pay gas fees. Get free test ETH from a faucet using your wallet address.",
    details: [
      "Faucets distribute free test tokens to valid Ethereum addresses",
      "These tokens only work on the test network—they have no real value",
      "You may need to verify your address or wait for a confirmation",
    ],
    link: {
      text: "Sepolia Faucet",
      url: "https://www.sepoliafaucet.com",
    },
  },
  {
    number: 4,
    title: "Connect Your Wallet",
    description: "Click the 'Connect Wallet' button in the top-right corner of SimpleSwap to connect your MetaMask wallet to the app.",
    details: [
      "MetaMask will open and ask for permission to connect",
      "Review the permissions and approve to continue",
      "Your wallet address will appear once connected",
    ],
    link: undefined,
  },
  {
    number: 5,
    title: "Get Test Tokens",
    description: "Use the Faucet section to mint free TKA and TKB tokens for testing swaps.",
    details: [
      "Click the 'Faucet' button to mint test tokens",
      "You'll receive equal amounts of TokenA (TKA) and TokenB (TKB)",
      "Tokens appear in your wallet instantly after the transaction confirms",
    ],
    link: undefined,
  },
  {
    number: 6,
    title: "Approve Tokens",
    description: "Before swapping, you must approve the SimpleSwap contract to use your tokens. This is a standard Web3 security measure.",
    details: [
      "Click 'Approve' to grant SimpleSwap permission to transfer your tokens",
      "Each token requires a separate approval transaction",
      "You only need to approve once per token (or increase the allowance later)",
    ],
    link: undefined,
  },
  {
    number: 7,
    title: "Swap!",
    description: "Enter the amount you want to swap, select which tokens to exchange, and complete your first Web3 transaction.",
    details: [
      "Enter an amount of TokenA or TokenB you wish to swap",
      "The app will calculate the swap amount automatically",
      "Review the transaction details and confirm in MetaMask",
      "Your new tokens will arrive instantly after confirmation",
    ],
    link: undefined,
  },
];

export const WalletGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [showDeveloperSection, setShowDeveloperSection] = useState(false);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((n) => n !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Main Collapse Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-between transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span>How to Get Started with SimpleSwap</span>
        </span>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>

      {/* Guide Content */}
      {isOpen && (
        <div className="mt-6 space-y-4">
          {/* Steps Container */}
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
              >
                {/* Step Header */}
                <button
                  onClick={() => toggleStep(step.number)}
                  className="w-full bg-white hover:bg-gray-50 px-4 py-4 flex items-start gap-4 transition-colors"
                >
                  {/* Step Circle */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {expandedSteps.includes(step.number) ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedSteps.includes(step.number) && (
                  <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-3">
                    {/* Details List */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm text-gray-700"
                        >
                          <span className="text-blue-500 font-bold mt-0.5">
                            •
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* External Link */}
                    {step.link && (
                      <div className="pt-2">
                        <a
                          href={step.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium text-sm transition-colors"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                          {step.link.text}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">
              For Developers
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Developer Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowDeveloperSection(!showDeveloperSection)}
              className="w-full bg-white hover:bg-gray-50 px-4 py-4 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="text-lg">👨‍💻</span>
                <h3 className="font-bold text-lg text-gray-900">
                  Technical Details & Resources
                </h3>
              </div>
              {showDeveloperSection ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showDeveloperSection && (
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-4">
                {/* Tech Stack */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Tech Stack
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">Frontend:</span>
                      <p>Next.js, React, Tailwind CSS, DaisyUI</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">Web3:</span>
                      <p>Wagmi, Viem, MetaMask, Sepolia Testnet</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">Smart Contracts:</span>
                      <p>Solidity, Hardhat, OpenZeppelin</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">Deployment:</span>
                      <p>Sepolia Testnet, Vercel</p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="pt-2 space-y-2">
                  <a
                    href="https://github.com/edumor/simpleswap-dapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white hover:bg-black rounded font-medium transition-colors"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    View on GitHub
                  </a>
                  <a
                    href="https://sepolia.etherscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium transition-colors"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    Sepolia Etherscan (Contract Verification)
                  </a>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">💡 Tip:</span> All contracts are verified on Etherscan. Search for contract addresses on{" "}
                    <a
                      href="https://sepolia.etherscan.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:opacity-80"
                    >
                      Sepolia Etherscan
                    </a>{" "}
                    to view source code and transaction history.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <span className="font-semibold">⚠️ Remember:</span> All tokens and transactions on Sepolia testnet are for testing only and have no real-world value. Never enter real wallet seed phrases or private keys.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
