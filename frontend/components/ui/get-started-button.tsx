'use client';

import { useState } from "react";
import { LogIn, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const handleConnectDiscord = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login?owner=true`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error("Failed to connect Discord", error);
    alert("Failed to connect to Discord. Please try again later.");
  }
};

export default function GetStartedButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleGetStartedClick = async () => {
    setLoading(true);
    await handleConnectDiscord();
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGetStartedClick}
      className={cn(
        "w-fit bg-grey-900 hover:bg-gray-950 text-black font-bold px-6 py-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50",
        {
          "opacity-30": loading,
        },
        className
      )}
      disabled={loading}
    >
      {loading ? (
        <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      ) : (
        <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
      )}
      Get Started
    </Button>
  );
}