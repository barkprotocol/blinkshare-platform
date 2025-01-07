"use client";

import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { toast } from "sonner";

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Configure the wallets you want to support (e.g., Phantom, Solflare, Backpack)
  const wallets = useMemo(() => {
    const availableWallets = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];

    // Conditionally add additional wallets (e.g., Phantom) based on environment
    if (process.env.NEXT_PUBLIC_ENABLE_PHANTOM_WALLET === "true") {
      availableWallets.push(new PhantomWalletAdapter());
    }

    return availableWallets;
  }, []);

  // Error handling function for wallet-related errors
  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error:", error);
    toast.error(`Wallet error: ${error.message || "Unknown error"}`);
  }, []);

  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_HELIUS_URL || "https://api.mainnet-beta.solana.com"}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
