import { useState } from "react";

export function StepByStepGuide() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "🔗 Connect Your Wallet",
      description: "Connect MetaMask or any Web3 wallet to interact with the dApp",
      details: [
        "Click the 'Connect Wallet' button in the top-right corner",
        "Select MetaMask or your preferred wallet",
        "Approve the connection request",
        "Ensure you're on the Sepolia testnet",
      ],
      isCompleted: false,
    },
    {
      title: "🚰 Get Test Tokens",
      description: "Obtain TokenA and TokenB from the faucet for testing",
      details: [
        "Scroll down to the 'Token Faucet' section",
        "Click 'Get TokenA' to receive 100 TokenA",
        "Click 'Get TokenB' to receive 100 TokenB",
        "Wait for transactions to confirm",
        "Check your balance in the 'Token Balances' section",
      ],
      isCompleted: false,
    },
    {
      title: "✅ Approve Tokens",
      description: "Grant permission for SimpleSwap to spend your tokens",
      details: [
        "Go to the 'Approve Tokens' section",
        "Enter the amount you want to approve (e.g., 50)",
        "Select TokenA or TokenB from dropdown",
        "Click 'Approve Token' and confirm transaction",
        "Repeat for the other token if needed",
      ],
      isCompleted: false,
    },
    {
      title: "💱 Check Current Price",
      description: "View the exchange rate between TokenA and TokenB",
      details: [
        "Look at the 'Current Price' section",
        "See how many TokenB you get for 1 TokenA",
        "See how many TokenA you get for 1 TokenB",
        "Prices update in real-time based on pool reserves",
      ],
      isCompleted: false,
    },
    {
      title: "🔄 Perform Token Swap",
      description: "Exchange TokenA for TokenB or vice versa",
      details: [
        "Navigate to the 'Swap Tokens' section",
        "Enter the amount you want to swap",
        "Select direction: TokenA → TokenB or TokenB → TokenA",
        "Set slippage tolerance (default 1%)",
        "Click 'Swap Tokens' and confirm transaction",
        "View transaction hash and check on Etherscan",
      ],
      isCompleted: false,
    },
    {
      title: "📊 Monitor Pool Info",
      description: "View liquidity pool reserves and total liquidity",
      details: [
        "Check the 'Liquidity Pool Information' section",
        "See TokenA and TokenB reserves in the pool",
        "View total liquidity tokens issued",
        "Monitor how your swaps affect pool ratios",
      ],
      isCompleted: false,
    },
  ];

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
        📚 Step-by-Step Guide
      </h2>
      <p className="text-center text-blue-700 mb-6">
        Follow these steps to test the SimpleSwap dApp on Sepolia testnet
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-blue-600">Progress</span>
          <span className="text-sm text-blue-600">{currentStep + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              index === currentStep
                ? "bg-blue-600 text-white"
                : index < currentStep
                ? "bg-green-500 text-white"
                : "bg-blue-200 text-blue-700 hover:bg-blue-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          Step {currentStep + 1}: {steps[currentStep].title}
        </h3>
        <p className="text-blue-700 mb-3">{steps[currentStep].description}</p>
        <ul className="space-y-2">
          {steps[currentStep].details.map((detail, idx) => (
            <li key={idx} className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-blue-800">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Important Notes */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure you&apos;re connected to <strong>Sepolia testnet</strong></li>
          <li>• You need Sepolia ETH for gas fees (get from faucet)</li>
          <li>• Always approve tokens before attempting to swap</li>
          <li>• Transaction confirmations may take 15-30 seconds</li>
          <li>• Check Etherscan links to verify your transactions</li>
        </ul>
      </div>
    </div>
  );
}
