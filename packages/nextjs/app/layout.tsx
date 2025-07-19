import "./globals.css";
import { ScaffoldEthApp } from "~/components/ScaffoldEthApp";
import { ThemeProvider } from "~/components/ThemeProvider";
import { getMetadata } from "~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "SimpleSwap - Decentralized Token Exchange",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthAppWithProviders;
