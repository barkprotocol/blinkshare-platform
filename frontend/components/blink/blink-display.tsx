'use client';

import React, { useContext, useMemo } from 'react';
import '@dialectlabs/blinks/index.css';
import { useAction, Blink } from '@dialectlabs/blinks';
import { ThemeContext } from '@/lib/contexts/theme-provider';
import { BlinkCardSkeleton } from '../skeletons/blink-skeleton';
import { useSolanaWalletAdapter } from '@/hooks/use-solana wallet-adapter';
import { toast } from 'sonner';

interface BlinkDisplayProps {
  serverId: string;
  code?: string;
}

export const BlinkDisplay: React.FC<BlinkDisplayProps> = ({ serverId, code }) => {
  const { isDark } = useContext(ThemeContext);
  const { wallet } = useSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!);

  const actionApiUrl = useMemo(() => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}?showRoles=true`;
    return code ? `${baseUrl}&code=${code}` : baseUrl;
  }, [serverId, code]);

  const { action, isLoading } = useAction({ url: actionApiUrl });

  const stylePreset = isDark ? 'x-dark' : 'default';

  // Handle cases where the action fails to load
  if (!action && !isLoading) {
    toast.error('Failed to fetch Blink action. Please try again later.');
    return (
      <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900 text-center text-red-700 dark:text-red-200">
        An error occurred while loading the Blink. Please try again later.
      </div>
    );
  }

  if (!wallet?.connected) {
    return (
      <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
        Please connect your wallet to view this Blink.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-lg">
      <div className="w-full h-full overflow-hidden rounded-lg">
        {isLoading ? (
          <BlinkCardSkeleton />
        ) : (
          action && (
            <Blink
                action={action}
                websiteText="blinkshare.fun"
                stylePreset={stylePreset} adapter={{
                  pathPattern: '',
                  apiPath: ''
                }}            />
          )
        )}
      </div>
    </div>
  );
};
