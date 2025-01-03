'use client';

import { FC, ReactNode, useState } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || WalletAdapterNetwork.Devnet;

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProviderComponent: FC<WalletProviderProps> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export const WalletButton = () => {
  const { connected, wallet, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletAction = async () => {
    setIsLoading(true);
    try {
      if (connected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error(`Failed to ${connected ? 'disconnect' : 'connect'} wallet:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWalletAction}
      disabled={isLoading}
      className={`text-white bg-black border border-white hover:bg-gray-900 hover:text-gray-100 ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {isLoading ? 'Connecting...' : connected ? `Disconnect from ${wallet?.adapter.name}` : 'Connect Wallet'}
    </Button>
  );
};
