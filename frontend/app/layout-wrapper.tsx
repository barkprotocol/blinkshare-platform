'use client';

import React, { useMemo } from "react";
import "./styles/globals.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import ContextProvider from "@/lib/contexts/context-provider";
import { ThemeProvider } from "@/lib/contexts/theme-provider";
import { PrivyProvider } from "@privy-io/react-auth";

require("@solana/wallet-adapter-react-ui/styles.css");

type LayoutWrapperProps = { children: React.ReactNode; };

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  // Ensure Privy app ID is set in environment variables
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    console.error("Privy app ID is missing. Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment variables.");
    // Optionally handle the case if the environment variable is missing
    // e.g., redirect to an error page, or disable relevant features.
  }

  // Setting up the Solana network and wallet adapters
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <ContextProvider>
            <ThemeProvider>
              <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
                config={{
                  appearance: {
                    landingHeader: 'Sign in with Discord',
                    showWalletLoginFirst: false,
                    walletChainType: "solana-only",
                    walletList: ["detected_solana_wallets", "phantom"]
                  },
                  loginMethods: ["discord"],
                  embeddedWallets: { createOnLogin: "all-users" },
                }}
              >
                {children}
              </PrivyProvider>
            </ThemeProvider>
          </ContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default LayoutWrapper;
