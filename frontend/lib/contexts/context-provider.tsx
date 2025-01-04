"use client";

import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

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

    // You can add more wallets dynamically or based on configuration/environment
    if (process.env.NEXT_PUBLIC_ENABLE_PHANTOM_WALLET === "true") {
      availableWallets.push(new PhantomWalletAdapter());
    }

    return availableWallets;
  }, []);

  const onError = useCallback((error: WalletError) => {
    // Log the error and show some feedback to the user
    console.error("Wallet error:", error);
    // Example: Display an error toast or alert
  }, []);

  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_HELIUS_URL || "https://api.mainnet-beta.solana.com"}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={false}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
