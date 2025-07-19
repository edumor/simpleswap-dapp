"use client";

import { ScaffoldEthApp } from "~/components/ScaffoldEthApp";

export const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return <ScaffoldEthApp>{children}</ScaffoldEthApp>;
};
