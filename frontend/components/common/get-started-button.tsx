'use client';

import { useState } from "react";
import { LogIn, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Function to handle connecting Discord with proper error handling
const handleConnectDiscord = async () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Check if the environment variable is set
  if (!apiBaseUrl) {
    alert("API base URL is missing. Please check the environment configuration.");
    return;
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/login?owner=true`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    // Check if the response contains the URL for redirect
    if (data.url) {
      // Redirect the user to the Discord login URL
      window.location.href = data.url;
    } else {
      throw new Error("No URL returned from server.");
    }
  } catch (error) {
    console.error("Failed to connect Discord:", error);
    alert("There was an issue connecting to Discord. Please try again later.");
  }
};

export default function GetStartedButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  // Handle the click event and trigger the connection to Discord
  const handleGetStartedClick = async () => {
    setLoading(true);
    try {
      await handleConnectDiscord();
    } catch (error) {
      // We handled the error in the handleConnectDiscord function already.
      // This is just to ensure state is reset if needed.
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGetStartedClick}
      className={cn(
        "w-fit bg-gray-900 hover:bg-gray-950 text-black font-bold px-6 py-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50",
        {
          "opacity-30 cursor-not-allowed": loading,
        },
        className
      )}
      disabled={loading}
      aria-label={loading ? "Connecting to Discord..." : "Get Started with Discord"}
      title="Click to connect your Discord account."
    >
      {loading ? (
        <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      ) : (
        <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
      )}
      {loading ? "Connecting..." : "Get Started"}
    </Button>
  );
}
