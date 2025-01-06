"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useWindowSize } from "@/hooks/use-window-size";
import { Button } from "@/components/ui/button";
import NotFound from "../not-found";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

export default function BlinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serverId } = useParams<{ serverId: string }>();
  const code = searchParams.get("code") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { width } = useWindowSize();
  const screenWidth = width ?? 0;

  useEffect(() => {
    if (!/^\d{17,19}$/.test(serverId)) {
      router.push("/not-found");
    }
  }, [serverId, router]);

  const authenticateUser = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate authentication");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = `${data.url}&state=${serverId}`;
      } else {
        throw new Error("No authentication URL returned");
      }
    } catch (error) {
      console.error("Failed to connect to Discord", error);
      setErrorMessage("An error occurred while trying to authenticate. Please try again later.");
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!code) return;

    const guildId = localStorage.getItem("state");

    if (guildId === serverId) {
      setIsAuthenticated(true);
      toast.success("Successfully authenticated with Discord!");
    } else {
      const params = new URLSearchParams(window.location.search);
      params.delete("code");
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  }, [code, serverId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-6xl mt-6"
      >
        <div className={`flex flex-col ${screenWidth >= 800 ? "md:flex-row" : ""} items-start space-y-8 md:space-y-0 md:space-x-8 mt-16`}>
          <LeftSection
            isAuthenticated={isAuthenticated}
            code={code}
            screenWidth={screenWidth}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onConnect={authenticateUser}
          />
          <RightSection serverId={serverId} code={code} screenWidth={screenWidth} />
        </div>
      </motion.div>
    </div>
  );
}

interface LeftSectionProps {
  isAuthenticated: boolean;
  code: string;
  screenWidth: number;
  isLoading: boolean;
  errorMessage: string | null;
  onConnect: () => void;
}

const LeftSection: React.FC<LeftSectionProps> = ({
  isAuthenticated,
  code,
  screenWidth,
  isLoading,
  errorMessage,
  onConnect,
}) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex-1 w-full"
  >
    <Card className="w-full bg-gray-800 text-white">
      <WelcomeText />
      <div className="mt-8 text-center">
        {isAuthenticated || code ? (
          screenWidth > 800 ? (
            <Illustration />
          ) : null
        ) : (
          <CardContent className="text-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>
                      <InfoIcon className="h-7 w-7 mr-2 inline" />
                      Error
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
                <Alert className="mb-4 bg-gray-700 text-white">
                  <AlertTitle>
                    <InfoIcon className="h-7 w-7 mr-2 inline" />
                    Discord Connection Required
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    Please connect your Discord to proceed. BlinkShare requires you to connect your Discord in order to assign you the purchased role.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={onConnect}
                  className="w-fit h-10 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <Image
                    className="mr-2 h-4 w-4 sm:h-5 sm:w-5"
                    src="/images/discord-icon.svg"
                    alt="Discord"
                    width={20}
                    height={20}
                  />
                  Connect Discord
                </Button>
              </>
            )}
          </CardContent>
        )}
      </div>
    </Card>
  </motion.div>
);

interface RightSectionProps {
  serverId: string;
  code: string;
  screenWidth: number;
}

const RightSection: React.FC<RightSectionProps> = ({ serverId, code, screenWidth }) => (
  <motion.div
    initial={{ x: screenWidth < 800 ? 0 : 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex-1 w-full"
  >
    <Card className="w-full h-auto bg-gray-800 text-white">
      <CardContent>
        <BlinkDisplay serverId={serverId} code={code} />
      </CardContent>
    </Card>
  </motion.div>
);

const WelcomeText = () => (
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-center">
      Welcome to <span className="text-indigo-400">BlinkShare</span>
    </CardTitle>
    <CardDescription className="text-center text-gray-300">
      You're one step away from unlocking exclusive content and features on your
      favorite <span className="text-indigo-400">Discord</span> servers!
    </CardDescription>
  </CardHeader>
);

const Illustration = () => (
  <motion.h1
    className="text-3xl font-normal tracking-tight md:text-6xl text-white"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    BlinkShare: Exclusive Content Awaits!
  </motion.h1>
);

