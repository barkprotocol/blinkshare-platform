"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { BlinkDisplay } from '@/components/blink/blink-display';
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus } from 'lucide-react';
import OverlaySpinner from '@/components/ui/overlay-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import CoinPatternBg from "@/components/common/coin-pattern-bg";

const onConnect = async (owner: boolean) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login${owner ? '?owner=true' : ''}`,
      { headers: { "Content-Type": "application/json" }, }
    );

    const data = await response.json();
    if (data.url) window.location.href = `${data.url}${owner ? '' : '&state=marketplace'}`;
  } catch (error) {
    console.error("Failed to connect Discord", error);
    toast.error("Discord connection failed. Please try again.");
  }
};

const BlinkMarketplaceComponent = () => {
  const [blinks, setBlinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  useEffect(() => {
    const fetchBlinks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`);
        const data = await response.json();
        setBlinks(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to get blinks");
        console.error('Failed to fetch blinks', error);
        setBlinks([]);
      }
    };

    fetchBlinks();
  }, []);

  useEffect(() => {
    if (!code) {
      return;
    }
    const state = localStorage.getItem("state");

    if (state === 'marketplace') return;

    const params = new URLSearchParams(window.location.search);
    params.delete("code");

    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [code]);

  if (isLoading) return (<div> <OverlaySpinner /> </div>);

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <div className="flex-grow">
        <section className="py-16 relative">
          <CoinPatternBg
            gridBlocks={[]}
            className="absolute top-0 left-0 right-0 bottom-0 z-0 opacity-20"
          />
          <div className="container mx-auto px-6 sm:px-12 relative z-10 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-8 mt-16 bg-black bg-opacity-60 p-4 rounded-xl shadow-xl">
              BlinkShare Marketplace - {blinks.length} blinks
            </h1>

            {!code && (
              <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
                <Alert className="w-full sm:w-1/2 mx-auto text-center bg-gray-900 text-black p-4 rounded-lg shadow-md">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-4">
                      <AlertTitle className="text-lg font-semibold">
                        <InfoIcon className="h-7 w-7 mr-2 text-black" />
                        Discord Connection Required
                      </AlertTitle>
                      <AlertDescription className="mt-2 text-sm text-black">
                        BlinkShare requires you to connect your Discord in order to assign you the purchased roles.
                      </AlertDescription>
                    </div>
                    <Button
                      onClick={() => onConnect(false)}
                      className="mt-4 w-48 sm:w-64 py-2 px-4 sm:px-6 rounded-full bg-gray-900 hover:bg-gray-950 text-white font-semibold shadow-lg transform transition duration-300 ease-in-out"
                    >
                      <img className="mr-3 h-5 w-5" src="https://unpkg.com/simple-icons@v13/icons/discord.svg" alt="Discord Logo" />
                      Connect Discord
                    </Button>
                  </div>
                </Alert>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blinks.map((blink, index) => (
                <div key={index} className="mb-6 break-inside-avoid">
                  <BlinkDisplay serverId={blink} code={code} />
                </div>
              ))}
            </div>
          </div>

          {/* Floating Button */}
          <Button
            onClick={() => onConnect(true)}
            className="fixed h-[4rem] bottom-16 right-8 sm:bottom-16 sm:right-12 bg-gray-900 hover:bg-gray-950 text-white font-bold rounded-full flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 z-20"
          >
            <Plus className="h-7 w-7 mr-2" />
            <span className="hidden sm:block text-lg">Add a Blink</span>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default function BlinkMarketplace() {
  return (
    <Suspense fallback={<div> <OverlaySpinner /> </div>}>
      <BlinkMarketplaceComponent />
    </Suspense>
  );
}
