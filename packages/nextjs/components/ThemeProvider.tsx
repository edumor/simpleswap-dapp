"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
