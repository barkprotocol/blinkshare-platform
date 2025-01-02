"use client";

import React, { useEffect, useState, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { useSearchParams } from "next/navigation";
import { ThemeContext } from "@/lib/contexts/theme-provider";
import OverlaySpinner from "@/components/ui/overlay-spinner";

function RedirectComponent() {
  const router = useRouter();
  const controls = useAnimation();
  const [callbackHandled, setCallbackHandled] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const setToken = useUserStore((state) => state.setToken);
  const setUserData = useUserStore((state) => state.setUserData);
  const setDiscordConnected = useUserStore((state) => state.setDiscordConnected);
  const setDiscordDisconnected = useUserStore(
    (state) => state.setDiscordDisconnected
  );

  const searchParams = useSearchParams();

  const handleCodeCallback = async (code: string, searchParams: URLSearchParams) => {
    if (callbackHandled) return;

    const state = searchParams.get("state") as string;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/callback?code=${encodeURIComponent(code)}${state ? '' : '&owner=true'}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Discord API error:", errorData);
        throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDiscordConnected(true);

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("discordToken", data.token);
        localStorage.setItem("guilds", JSON.stringify(data.guilds));
        setUserData(data);
      } else if (state) localStorage.setItem("state", state);

      router.push(state ? `${state}?code=${code}` : "/servers");
    } catch (error) {
      console.error("Error in handleCodeCallback:", error);
      setDiscordDisconnected(true);
    } finally {
      setCallbackHandled(true);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/error");
    } else if (code && !callbackHandled) {
      handleCodeCallback(code, searchParams);
    }
  }, [searchParams, callbackHandled]);

  // Handle the timeout logic for redirection after 5 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/servers");
    }, 300000); // Redirect after 5 minutes

    controls.start("visible");

    return () => clearTimeout(timer);
  }, [router, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";

  return (
    <div className={`relative flex h-screen flex-col ${bgColor}`}>
      <div className={`grid h-screen place-content-center px-4 ${bgColor}`}>
        <motion.div
          className="absolute inset-0 -z-10 flex justify-center items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="absolute top-32 -right-0 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-gray-700 -z-50"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-0 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-gray-200 z-1"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-10 left-20 w-64 h-36 bg-gray-600 z-1"
            variants={shapeVariants}
          />
        </motion.div>

        <motion.div
          className="text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="mt-6 flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="mt-6 flex items-center justify-center space-x-4"
              variants={itemVariants}
            >
              <Image
                src="/coffee.png"
                alt="First Image"
                className="h-auto w-auto"
                priority
                width={200}
                height={200}
              />
              <Image
                src="/bark.png"
                alt="Second Image"
                className="h-auto w-auto"
                priority
                width={200}
                height={200}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className={`mt-6 text-2xl font-bold tracking-tight sm:text-4xl space-y-4 ${textColor}`}
            variants={itemVariants}
          >
            We are getting your Discord account connected...
          </motion.h1>
        </motion.div>
      </div>

      <OverlaySpinner /> {/* Simplified - no need for Suspense */}
    </div>
  );
}

export default RedirectComponent;
