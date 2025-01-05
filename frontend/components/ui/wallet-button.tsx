"use client";

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";

export const WalletButton: FC = () => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copying, setCopying] = useState(false);

    const handleWalletClick = () => {
        if (!wallet) {
            setVisible?.(true);
        } else {
            disconnect?.();
        }
    };

    const copyAddress = async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey.toBase58());
            setCopying(true);
            setTimeout(() => setCopying(false), 400);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                onClick={handleWalletClick}
                variant="outline"
                className="bg-black text-primary-foreground hover:bg-primary/90"
            >
                {publicKey ? 'Disconnect' : 'Connect Wallet'}
            </Button>
            {publicKey && (
                <Button
                    onClick={copyAddress}
                    variant="outline"
                    className="bg-black text-secondary-foreground hover:bg-secondary/50"
                >
                    {copying ? 'Copied!' : `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
                </Button>
            )}
        </div>
    );
};