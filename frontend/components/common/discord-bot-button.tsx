'use client';

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function AddBlinkShareBotButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleAuthorizeDiscord = () => {
    setLoading(true);
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL!}/install-bot`,
      "popup",
      "width=600,height=600"
    );

    // Check if the window opened successfully
    if (popup) {
      const interval = setInterval(() => {
        // If the popup window is closed, stop the interval and reset loading state
        if (popup.closed) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 1000);
    } else {
      console.error("Failed to open the popup window.");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAuthorizeDiscord}
      className={cn(
        "bg-gray-900 text-white font-bold px-6 py-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 mt-10",
        {
          "opacity-30 cursor-not-allowed": loading,
        },
        className
      )}
      disabled={loading}
    >
      <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
      Add to your server
    </Button>
  );
}
