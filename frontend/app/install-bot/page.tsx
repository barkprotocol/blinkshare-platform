"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Redirect from "../redirect/page";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export default function InstallBot() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const installBot = async () => {
      try {
        const url = new URL(window.location.href);
        const redirect = url.searchParams.get("redirect") === "true";
        const guild_id = url.searchParams.get("guild_id");

        const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL;

        if (!DISCORD_CLIENT_ID || !APP_BASE_URL) {
          throw new Error("Missing required environment variables: DISCORD_CLIENT_ID or APP_BASE_URL.");
        }

        const baseUrl = new URL("https://discord.com/oauth2/authorize");
        baseUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
        baseUrl.searchParams.set("permissions", "268463105");
        baseUrl.searchParams.set("integration_type", "0");
        baseUrl.searchParams.set("scope", "bot applications.commands");

        if (guild_id) {
          baseUrl.searchParams.set("guild_id", guild_id);
        }

        if (redirect) {
          baseUrl.searchParams.set("redirect_uri", `${APP_BASE_URL}/redirect`);
          baseUrl.searchParams.set("response_type", "code");
        }

        await router.push(baseUrl.toString());
      } catch (err) {
        console.error("Error in InstallBot:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    installBot();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" aria-live="polite" aria-busy="true">
        <Skeleton className="w-[300px] h-[20px] mb-4" />
        <Skeleton className="w-[200px] h-[20px]" />
        <span className="sr-only">Loading bot installation page...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <InfoCircledIcon className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Redirect />;
}

