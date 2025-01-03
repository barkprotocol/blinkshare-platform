'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";

export const WalletButton: FC = () => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();

    const [isClient, setIsClient] = useState(false);

    // Set isClient to true after the component has mounted to avoid SSR issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleWalletClick = () => {
        if (!wallet) {
            setVisible?.(true);
        } else {
            disconnect?.();
        }
    };

    // If not on the client yet, don't render the button to avoid SSR mismatch
    if (!isClient) {
        return null;
    }

    return (
        <Button
            onClick={handleWalletClick}
            variant="outline"
            className="bg-black text-white hover:bg-gray-950 focus:ring-2 focus:ring-gray-950 rounded-md px-4 py-3 text-sm transition-all duration-200 ease-in-out"
        >
            {publicKey ? 'Disconnect Wallet' : 'Connect Wallet'}
        </Button>
    );
};
