import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

// Convert Solana wallet connectors
const solanaConnectors = toSolanaWalletConnectors();

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId="your-privy-app-id" // Use your actual Privy app ID
      config={{
        appearance: {
          walletChainType: 'ethereum-and-solana',
          // Customize appearance as needed
          accentColor: '#6A6FF5',
          theme: '#FFFFFF',
          logo: 'https://auth.privy.io/logos/privy-logo.png',
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        loginMethods: [
          'email', 'wallet', 'google', 'github', 'discord', 'telegram', 'twitter',
        ],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default App;
