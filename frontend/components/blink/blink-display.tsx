'use client';

import React, { useContext, useEffect, useState } from 'react';
import '@dialectlabs/blinks/index.css';
import { useAction, Blink } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { ThemeContext } from '@/lib/contexts/theme-provider';
import { BlinkCardSkeleton } from '../skeletons/blink-skeleton';

interface BlinkPreviewProps {
  serverId: string;
  code?: string;
}

export const BlinkDisplay: React.FC<BlinkPreviewProps> = ({ serverId, code }) => {
  const { isDark } = useContext(ThemeContext);
  const [error, setError] = useState<string | null>(null);

  // Constructing the API URL dynamically
  const actionApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}?showRoles=true${code ? `&code=${code}` : ''}`;

  // Solana wallet adapter initialization
  const { adapter } = useActionSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!);

  // Fetch action and loading state
  const { action, isLoading, refresh } = useAction({ url: actionApiUrl });

  // Handle errors if action is null or loading fails
  useEffect(() => {
    if (isLoading) {
      setError(null); // Reset error state while loading
    } else if (!action) {
      setError('No Blink data available for this server. Please try again later.');
    } else {
      setError(null); // Reset error if action is loaded successfully
    }
  }, [action, isLoading]);

  // Setting style preset based on the theme
  const stylePreset = isDark ? 'x-dark' : 'default';

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div className="w-full h-full overflow-hidden rounded-lg">
        {/* Display error if any */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Display loading skeleton or the Blink component */}
        {isLoading || !action ? (
          <BlinkCardSkeleton />
        ) : (
          // Make sure to pass the adapter to Blink
          <Blink 
            action={action!} 
            websiteText="blinkshare.fun" 
            stylePreset={stylePreset} 
            adapter={adapter} 
          />
        )}
      </div>
    </div>
  );
};
