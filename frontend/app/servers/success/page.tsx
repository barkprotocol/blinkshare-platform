"use client";

import { useState, useEffect, useContext } from "react";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CopyIcon, SquareArrowOutUpRight } from 'lucide-react';
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { MotionInput, MotionButton } from "@/components/motion";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/lib/contexts/theme-provider";

export default function SuccessPage() {
  const [blinkUrl, setBlinkUrl] = useState("");
  const [serverId, setServerId] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState("https://ucarecdn.com/56d0844b-a460-4dad-a761-92f2f14752f2/check.png?height=200&width=200");
  const router = useRouter();
  const { isDark } = useContext(ThemeContext);

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

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast({
      title: "Custom URL Copied!",
      description: "The custom URL has been copied to your clipboard.",
    });
  };

  const openCustomUrl = () => {
    window.open(customUrl, '_blank', "noopener,noreferrer");
  }

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
                  src="/images/x.webp"
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
                  src="/images/discord.svg"
                  alt="Discord"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on Discord
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-center w-full">
              <Button
                variant="default"
                className="w-full bg-gray-100 hover:bg-gray-200 text-black"
                onClick={() => router.push(`/servers/${serverId}/configure`)}
              >
                Configure your Blink 👀
              </Button>
            </div>

            <div className="mt-8 text-center">
              <motion.h1
                className="text-3xl font-normal tracking-tight md:text-6xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="relative inline-block group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src="/success.png"
                    alt="Success Icon"
                    width={150}
                    height={150}
                    className="rounded-lg"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <motion.div
                    className={`absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 ${
                      isDark ? "border-gray-200" : "border-gray-500"
                    } z-10`}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                  <motion.div
                    className={`absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 ${
                      isDark ? "border-gray-200" : "border-gray-500"
                    } z-10`}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                  <motion.div
                    className={`absolute -inset-4 ${
                      isDark ? "bg-gray-100" : "bg-gray-200/30"
                    } opacity-20 z-0`}
                    animate={{ rotate: [0, 360] }}
                  />
                </motion.span>{" "}
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

