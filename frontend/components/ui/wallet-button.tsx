"use client";

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export const WalletButton: FC = () => {
    const { publicKey, wallet, disconnect, connecting, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        if (connected) {
            toast.success('Wallet connected successfully!');
        } else {
            toast.info('Wallet disconnected.');
        }
    }, [connected]);

    const handleWalletClick = () => {
        if (!wallet || !connected) {
            setVisible(true);
        } else {
            disconnect().catch((error) => {
                console.error('Failed to disconnect:', error);
                toast.error('Failed to disconnect. Please try again.');
            });
        }
    };

    const copyAddress = async () => {
        if (publicKey) {
            try {
                await navigator.clipboard.writeText(publicKey.toBase58());
                setCopying(true);
                toast.success('Address copied to clipboard!');
                setTimeout(() => setCopying(false), 1500);
            } catch (error) {
                console.error('Failed to copy address:', error);
                toast.error('Failed to copy address. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                onClick={handleWalletClick}
                variant="outline"
                className="bg-black text-primary-foreground hover:bg-primary/90"
                disabled={connecting}
            >
                {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet'}
            </Button>
            {connected && publicKey && (
                <Button
                    onClick={copyAddress}
                    variant="outline"
                    className="bg-black text-secondary-foreground hover:bg-secondary/50"
                    disabled={copying}
                >
                    {copying ? 'Copied!' : `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
                </Button>
            )}
        </div>
    );
};
