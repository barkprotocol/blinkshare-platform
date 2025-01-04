"use client";

import { useState, useEffect, useContext } from "react";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CopyIcon, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { MotionInput, MotionButton } from "@/components/motion";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/lib/contexts/theme-provider";
import { Connection } from "@solana/web3.js";

export default function SuccessPage() {
  const [blinkUrl, setBlinkUrl] = useState<string>("");
  const [serverId, setServerId] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string>("https://ucarecdn.com/56d0844b-a460-4dad-a761-92f2f14752f2/check.png?height=200&width=200");
  const router = useRouter();
  const { isDark } = useContext(ThemeContext);
  const [rpcUrl, setRpcUrl] = useState<string>("");

  // Fetch Solana RPC URL when the component is mounted
  useEffect(() => {
    const fetchRpcUrl = async () => {
      const rpcUrlFromEnv = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
      setRpcUrl(rpcUrlFromEnv);
    };

    fetchRpcUrl();
  }, []);

  // Establish Solana connection using the rpcUrl from state
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (rpcUrl) {
      setConnection(new Connection(rpcUrl, "confirmed"));
    }
  }, [rpcUrl]);

  useEffect(() => {
    const id = window.location.pathname.split("/")?.at(-2);
    if (id) setServerId(id);
  }, []);

  useEffect(() => {
    if (!serverId) return;

    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "";
    setBlinkUrl(`${baseUrl}/${serverId}`);
    setCustomUrl(`${baseUrl}/${serverId}`);

    const shootConfetti = () => {
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
      };

      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    shootConfetti();
    const timer = setInterval(shootConfetti, 3000);

    return () => clearInterval(timer);
  }, [serverId]);

  const handleShare = (platform: "discord" | "x") => {
    const urls = {
      discord: `https://discord.com/channels/${serverId}`,
      x: `https://twitter.com/intent/tweet?text=Check%20out%20my%20Blink!%20${encodeURIComponent(blinkUrl)}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const copyCustomUrl = async () => {
    try {
      await navigator.clipboard.writeText(customUrl);
      toast({
        title: "Custom URL Copied!",
        description: "The custom URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to Copy URL",
        description: "There was an error copying the URL to the clipboard.",
        variant: "destructive",
      });
    }
  };

  const openCustomUrl = () => {
    window.open(customUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const imageUrl = "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp";
    setImageSrc(imageUrl);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-950"
          : "bg-gradient-to-b from-gray-100 to-white"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-4xl md:text-5xl font-bold text-center mb-8 ${
            isDark ? "text-white" : "text-navy-900"
          }`}
        >
          Blink Created Successfully! 🎉
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`rounded-lg shadow-lg p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Your Blink
            </h2>
            <BlinkDisplay serverId={serverId} code={""} />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`rounded-lg shadow-lg p-6 flex flex-col justify-between ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Your Custom Blink URL 🔗
            </h2>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <MotionInput
                type="text"
                value={customUrl}
                readOnly
                className="flex-grow mr-4"
                whileFocus={{ scale: 1.05 }}
              />
            </div>
            <div className="flex items-center mt-4">
              <MotionButton
                className="mr-2"
                onClick={copyCustomUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy URL
              </MotionButton>
              <MotionButton
                onClick={openCustomUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                Open URL
              </MotionButton>
            </div>

            <Separator className="my-4" />

            <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Share Your Blink
            </h2>
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Share the URL with others so they can access your Discord's premium roles.
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleShare("x")}
                className="bg-gray-100 hover:bg-gray-200 text-black"
              >
                <Image
                  src="https://ucarecdn.com/a903718f-e219-4946-98ed-2578cd5a2bd2/x.png"
                  alt="X"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Spread the Word
              </Button>
              <Button
                onClick={() => handleShare("discord")}
                className="bg-gray-100 hover:bg-gray-200 text-black"
              >
                <Image
                  src="https://ucarecdn.com/0da96123-0acb-43a5-b3d8-571629377d1b/discord.png"
                  alt="Discord"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on Discord
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
