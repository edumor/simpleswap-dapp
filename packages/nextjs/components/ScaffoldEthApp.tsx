"use client";

import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { Web3Providers } from "~/components/Web3Providers";
import { ReactNode } from "react";

interface ScaffoldEthAppProps {
  children: ReactNode;
}

export function ScaffoldEthApp({ children }: ScaffoldEthAppProps) {
  return (
    <Web3Providers>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </Web3Providers>
  );
}