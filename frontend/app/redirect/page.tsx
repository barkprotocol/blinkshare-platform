'use client';

import React, { useEffect, useState, useContext } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/lib/contexts/zustand/user-store';
import { ThemeContext } from '@/lib/contexts/theme-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { toast } from 'sonner';

const RedirectComponent = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [callbackHandled, setCallbackHandled] = useState(false);
  const { isDark } = useContext(ThemeContext);
  const { setToken, setUserData, setDiscordConnected, setDiscordDisconnected } = useUserStore();
  
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  const handleCodeCallback = async (code: string, state: string | null) => {
    if (callbackHandled) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/callback?code=${encodeURIComponent(code)}${state ? '' : '&owner=true'}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDiscordConnected(true);

      if (data.token) {
        setToken(data.token);
        localStorage.setItem('discordToken', data.token);
        localStorage.setItem('guilds', JSON.stringify(data.guilds));
        setUserData(data);
        toast.success('Successfully connected to Discord!');
      } else if (state) {
        localStorage.setItem('state', state);
      }

      router.push(state ? `${state}?code=${code}` : '/servers');
    } catch (error) {
      console.error('Error in handleCodeCallback:', error);
      setDiscordDisconnected(true);
      toast.error('Failed to connect to Discord. Please try again.');
    } finally {
      setCallbackHandled(true);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
  
    const code = params.get('code');
    const state = params.get('state');
  
    if (!code) {
      router.push('/error');
      return;
    }

    if (code && !callbackHandled) {
      handleCodeCallback(code, state);
    }
  
    const timer = setTimeout(() => {
      router.push('/servers');
    }, 300000); // Redirect after 5 minutes
  
    controls.start('visible');
  
    return () => clearTimeout(timer);
  }, [callbackHandled, router, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <ErrorBoundary>
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
                  src="https://ucarecdn.com/84aedf39-daf1-4c75-b35c-ed08c6c95c4a/coffeemug.png"
                  alt="Coffee Mug"
                  className="h-auto w-auto"
                  priority
                  width={200}
                  height={200}
                />
                <Image
                  src="https://ucarecdn.com/0fcc538d-7e39-4cc2-9e0e-4ead361f1858/barkspl20.png"
                  alt="Bark Logo"
                  className="h-auto w-auto"
                  priority
                  width={200}
                  height={200}
                />
              </motion.div>
              <motion.div
                className={`mt-4 ${textColor}`}
                variants={itemVariants}
              >
                Please wait while we verify your credentials.
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RedirectComponent;