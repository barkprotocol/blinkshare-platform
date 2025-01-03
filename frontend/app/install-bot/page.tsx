"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Redirect from "../redirect/page";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function InstallBot() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const installBot = () => {
      try {
        const url = new URL(window.location.href);
        const redirect = url.searchParams.get('redirect') === 'true';
        const guild_id = url.searchParams.get('guild_id');

        const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL;

        if (!DISCORD_CLIENT_ID || !APP_BASE_URL) {
          throw new Error("Missing required environment variables");
        }

        const baseUrl = new URL('https://discord.com/oauth2/authorize');
        baseUrl.searchParams.set('client_id', DISCORD_CLIENT_ID);
        baseUrl.searchParams.set('permissions', '268463105');
        baseUrl.searchParams.set('integration_type', '0');
        baseUrl.searchParams.set('scope', 'bot applications.commands');

        if (guild_id) {
          baseUrl.searchParams.set('guild_id', guild_id);
        }

        if (redirect) {
          baseUrl.searchParams.set('redirect_uri', `${APP_BASE_URL}/redirect`);
          baseUrl.searchParams.set('response_type', 'code');
        }

        router.push(baseUrl.toString());
      } catch (err) {
        console.error("Error in InstallBot:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    installBot();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-[300px] h-[20px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Redirect />;
}

