"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CreditCard, UserCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

interface WelcomeCardProps {
  isLoading: boolean;
  errorMessage: string | null;
  onConnect: () => void;
}

interface BlinkCardProps {
  serverId: string;
  code: string;
}

interface HowItWorksCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function BlinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serverId } = useParams<{ serverId: string }>();
  const code = searchParams.get("code") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDiscordMessage, setShowDiscordMessage] = useState(true);

  useEffect(() => {
    if (!/^\d{17,19}$/.test(serverId)) {
      router.push("/not-found");
    }
  }, [serverId, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDiscordMessage(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-4 pb-16 bg-gray-100 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-6xl mt-6"
      >
        <div className="flex flex-col space-y-8 mt-16">
          <WelcomeCard
            isLoading={isLoading}
            errorMessage={errorMessage}
            onConnect={authenticateUser}
          />
          <HowItWorksSection />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <BlinkCard serverId={serverId} code={code} />
            <BlinkCard serverId={serverId} code={code} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  isLoading,
  errorMessage,
  onConnect,
}) => {
  const [showDiscordMessage, setShowDiscordMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDiscordMessage(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Welcome to <span className="font-bold">Blink</span><span className="font-light">Share</span>
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-lg">
          You're one step away from unlocking exclusive content and features on your favorite Discord servers!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 w-full max-w-md">
                <AlertTitle>
                  <InfoIcon className="h-5 w-5 mr-2 inline" />
                  Error
                </AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
            <AnimatePresence>
              {showDiscordMessage && (
                <motion.div
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert className="mb-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full max-w-md">
                    <AlertTitle className="text-center font-semibold text-sm">
                      Discord Connection Required
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-xs text-center">
                      Please connect your Discord to proceed. BlinkShare requires you to connect your Discord in order to assign you the purchased role.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              onClick={onConnect}
              className="w-fit h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            >
              <Image
                className="mr-2 h-5 w-5"
                src="https://ucarecdn.com/0da96123-0acb-43a5-b3d8-571629377d1b/discord.png"
                alt="Discord"
                width={20}
                height={20}
              />
              Connect Discord
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const BlinkCard: React.FC<BlinkCardProps> = ({ serverId, code }) => (
  <Card className="w-full h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <CardContent>
      <BlinkDisplay serverId={serverId} code={code} />
    </CardContent>
  </Card>
);

const HowItWorksCard: React.FC<HowItWorksCardProps> = ({ icon, title, description }) => (
  <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <CardContent className="flex flex-col items-center p-4">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksSection: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <HowItWorksCard
        icon={<CreditCard className="text-[#DBCFC7]" />}
        title="Select a Plan"
        description="Choose from various subscription tiers tailored to your interests."
      />
      <HowItWorksCard
        icon={<UserCheck className="text-[#DBCFC7]" />}
        title="Connect Discord"
        description="Link your Discord account to enable automatic role assignment."
      />
      <HowItWorksCard
        icon={<Lock className="text-[#DBCFC7]" />}
        title="Access Content"
        description="Enjoy exclusive content and features in your Discord server."
      />
    </div>
  </div>
);

