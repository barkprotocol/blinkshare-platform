'use client';

import React, { useEffect, useState } from "react";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus } from 'lucide-react';
import OverlaySpinner from "@/components/ui/overlay-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CoinPatternBg } from "@/components/common/coin-pattern-bg";
import Image from "next/image";

interface Blink {
  id: string;
  name: string;
  description: string;
}

const onConnect = async (owner: boolean) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login${owner ? "?owner=true" : ""}`,
      { headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) {
      throw new Error("Failed to initiate Discord connection");
    }
    const data = await response.json();
    if (data.url) {
      const url = new URL(data.url);
      if (!owner) url.searchParams.append("state", "marketplace");
      window.location.href = url.toString();
    } else {
      throw new Error("No URL returned from login endpoint");
    }
  } catch (error) {
    console.error("Failed to connect Discord", error);
    toast.error("Discord connection failed. Please try again.");
  }
};

const BlinkMarketplaceComponent = () => {
  const [blinks, setBlinks] = useState<Blink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  useEffect(() => {
    const fetchBlinks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlinks(data);
      } catch (error) {
        toast.error("Failed to get blinks");
        console.error("Failed to fetch blinks", error);
        setBlinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlinks();
  }, []);

  useEffect(() => {
    if (!code) return;

    const state = localStorage.getItem("state");
    if (state === "marketplace") return;

    const params = new URLSearchParams(window.location.search);
    params.delete("code");
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [code, router]);

  if (isLoading) return <OverlaySpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <div className="flex-grow">
        <section className="py-16 relative">
          <CoinPatternBg />
          <div className="container mx-auto px-6 sm:px-12 relative z-10 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-8 mt-16 bg-black bg-opacity-60 p-4 rounded-xl shadow-xl">
              BlinkShare Marketplace - {blinks.length} blinks
            </h1>

            {!code && (
              <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
                <Alert className="w-full sm:w-1/2 mx-auto text-center bg-gray-900 text-white p-4 rounded-lg shadow-md">
                  <div className="flex flex-col items-center">
                    <AlertTitle className="text-lg font-semibold flex items-center mb-4">
                      <InfoIcon className="h-7 w-7 mr-2 text-white" />
                      Discord Connection Required
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-sm text-gray-300">
                      BlinkShare requires you to connect your Discord in order to assign you the purchased roles.
                    </AlertDescription>
                    <Button
                      onClick={() => onConnect(false)}
                      className="mt-4 w-48 sm:w-64 py-2 px-4 sm:px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transform transition duration-300 ease-in-out"
                    >
                      <Image
                        className="mr-3 h-5 w-5"
                        src="/images/discord-icon.svg"
                        alt="Discord Logo"
                        width={20}
                        height={20}
                      />
                      Connect Discord
                    </Button>
                  </div>
                </Alert>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blinks.length > 0 ? (
                blinks.map((blink) => (
                  <div key={blink.id} className="mb-6 break-inside-avoid">
                    <BlinkDisplay serverId={blink.id} code={code} />
                  </div>
                ))
              ) : (
                <p className="text-xl text-gray-300 col-span-full">No blinks available at the moment.</p>
              )}
            </div>
          </div>

          <Button
            onClick={() => onConnect(true)}
            className="fixed h-16 w-16 sm:h-auto sm:w-auto bottom-16 right-8 sm:bottom-16 sm:right-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 z-20"
          >
            <Plus className="h-7 w-7 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:block text-lg">Add a Blink</span>
            <span className="sr-only">Add a new Blink</span>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default function BlinkMarketplace() {
  return (
    <React.Suspense fallback={<OverlaySpinner />}>
      <BlinkMarketplaceComponent />
    </React.Suspense>
  );
}

