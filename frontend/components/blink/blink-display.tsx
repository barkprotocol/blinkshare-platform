'use client'

import React, { useContext } from 'react'
import '@dialectlabs/blinks/index.css'
import { useAction, Blink } from "@dialectlabs/blinks"
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { ThemeContext } from '@/lib/contexts/theme-provider'
import { BlinkCardSkeleton } from '../skeletons/blink-skeleton'

interface BlinkPreviewProps {
  serverId: string
  code?: string
}

export const BlinkDisplay: React.FC<BlinkPreviewProps> = ({ serverId, code }) => {
  const { isDark } = useContext(ThemeContext);

  // Constructing the API URL dynamically
  const actionApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}?showRoles=true${code ? `&code=${code}` : ''}`;

  // Solana wallet adapter initialization
  const { adapter } = useActionSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!);
  
  // Fetch action and loading state
  const { action, isLoading } = useAction({ url: actionApiUrl, adapter });

  // Setting style preset based on the theme
  const stylePreset = isDark ? 'x-dark' : 'default';

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div className="w-full h-full overflow-hidden rounded-lg">
        {isLoading || !action ? (
          <BlinkCardSkeleton />
        ) : (
          <Blink action={action!} websiteText="blinkshare.fun" stylePreset={stylePreset} />
        )}
      </div>
    </div>
  );
}
