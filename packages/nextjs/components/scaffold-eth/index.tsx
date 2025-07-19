// Placeholder components for Scaffold ETH
export const Address = ({ address }: { address?: string }) => {
  return (
    <div className="font-mono text-sm">
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
    </div>
  );
};

export const RainbowKitCustomConnectButton = () => {
  return (
    <button className="btn btn-primary">
      Connect Wallet
    </button>
  );
};

export const FaucetButton = () => {
  return null; // Hidden for now
};

export const BlockieAvatar = () => {
  return null;
};

export const ProgressBar = () => {
  return null;
};
