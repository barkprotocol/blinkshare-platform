'use client';

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ThemeProvider } from "@/lib/contexts/theme-provider";
import { PrivyProvider } from "@privy-io/react-auth";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "sonner";

import "@solana/wallet-adapter-react-ui/styles.css";

type LayoutWrapperProps = { children: React.ReactNode };

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!privyAppId) {
    console.error("Privy app ID is missing. Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment variables.");
    toast.error("Configuration error. Please contact support.");
    return null;
  }

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ], [network]);

  return (
    <ErrorBoundary>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ThemeProvider>
              <PrivyProvider
                appId={privyAppId}
                config={{
                  appearance: {
                    landingHeader: 'Sign in with Discord',
                    showWalletLoginFirst: false,
                    walletChainType: "solana-only",
                    walletList: ["detected_solana_wallets", "phantom"],
                  },
                  loginMethods: ["discord"],
                  embeddedWallets: { createOnLogin: "all-users" },
                }}
              >
                {children}
              </PrivyProvider>
            </ThemeProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
};

export default LayoutWrapper;
