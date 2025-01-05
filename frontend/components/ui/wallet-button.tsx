'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';

export const WalletButton = () => {
  const { connected, wallet, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Handle wallet connection or disconnection
  const handleWalletAction = async () => {
    setIsLoading(true);
    try {
      if (connected) {
        // Disconnecting
        console.debug(`Disconnecting from ${wallet?.adapter?.name || 'Wallet'}`);
        await disconnect();
      } else {
        // Connecting
        console.debug(`Connecting to ${wallet?.adapter?.name || 'Wallet'}`);
        await connect();
      }
    } catch (error) {
      console.error(`Failed to ${connected ? 'disconnect' : 'connect'} wallet:`, error);
      alert(`An error occurred while trying to ${connected ? 'disconnect' : 'connect'} the wallet.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWalletAction}
      disabled={isLoading}
      className={`text-white bg-black border-1 border-white hover:bg-gray-900 hover:text-gray-100 hover:border-gray-400 ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {isLoading
        ? 'Connecting...'
        : connected
        ? `Disconnect from ${wallet?.adapter?.name || 'Wallet'}`
        : 'Connect Wallet'}
    </Button>
  );
};
