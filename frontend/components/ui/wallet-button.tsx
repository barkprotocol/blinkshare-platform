'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";

export const WalletButton: FC = () => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();

    const handleWalletClick = () => {
        if (!wallet) {
            setVisible?.(true);
        } else {
            disconnect?.();
        }
    };

    return (
        <Button
            onClick={handleWalletClick}
            variant="outline"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-1 focus:ring-primary rounded-md px-4 py-3 text-sm"
        >
            {publicKey ? 'Disconnect Wallet' : 'Connect Wallet'}
        </Button>
    );
};
