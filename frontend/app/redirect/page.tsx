'use client';

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/lib/contexts/zustand/user-store';
import { useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/lib/contexts/theme-provider';

// Error Boundary Component to catch any errors during rendering
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const RedirectComponent = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [callbackHandled, setCallbackHandled] = useState(false);
  const [mounted, setMounted] = useState(false); // To ensure client-side rendering
  const { isDark } = useContext(ThemeContext);

  const setToken = useUserStore((state) => state.setToken);
  const setUserData = useUserStore((state) => state.setUserData);
  const setDiscordConnected = useUserStore((state) => state.setDiscordConnected);
  const setDiscordDisconnected = useUserStore((state) => state.setDiscordDisconnected);

  // Ensure the component uses useSearchParams only on the client-side
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, [mounted]);

  const handleCodeCallback = async (code: string, searchParams: URLSearchParams) => {
    if (callbackHandled) return;

    const state = searchParams.get('state') as string;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/callback?code=${encodeURIComponent(code)}${state ? '' : '&owner=true'}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Discord API error:', errorData);
        throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDiscordConnected(true);

      if (data.token) {
        setToken(data.token);
        localStorage.setItem('discordToken', data.token);
        localStorage.setItem('guilds', JSON.stringify(data.guilds));
        setUserData(data);
      } else if (state) localStorage.setItem('state', state);

      router.push(state ? `${state}?code=${code}` : '/servers');
    } catch (error) {
      console.error('Error in handleCodeCallback:', error);
      setDiscordDisconnected(true);
    } finally {
      setCallbackHandled(true);
    }
  };

  useEffect(() => {
    if (!searchParams) return;
    
    const code = searchParams.get('code');
    if (!code) {
      router.push('/error');
    } else if (code && !callbackHandled) {
      handleCodeCallback(code, searchParams);
    }
  }, [searchParams, callbackHandled]);

  // Handle the timeout logic for redirection after 5 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/servers');
    }, 300000); // Redirect after 5 minutes

    controls.start('visible');

    return () => clearTimeout(timer);
  }, [router, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
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

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
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
                    alt="First Image"
                    className="h-auto w-auto"
                    priority
                    width={200}
                    height={200}
                  />
                  <Image
                    src="https://ucarecdn.com/0fcc538d-7e39-4cc2-9e0e-4ead361f1858/barkspl20.png"
                    alt="Second Image"
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default RedirectComponent;
