'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { serverId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading process or server validation
  useEffect(() => {
    if (serverId) {
      // Simulate an API call or validation check
      setTimeout(() => setIsLoading(false), 1000); // Mock loading time
    }
  }, [serverId]);

  // Check if serverId exists, if not display an error state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-8">
        <p className="text-center text-gray-700 dark:text-gray-300">Loading server...</p>
      </div>
    );
  }

  if (!serverId) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-8">
        <p className="text-center text-gray-700 dark:text-gray-300">Server not found or ID is missing</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/servers')}
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Servers
          </Button>
        </div>
      </div>
      <div className="rounded-lg bg-gray-100 p-4 shadow-lg dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
