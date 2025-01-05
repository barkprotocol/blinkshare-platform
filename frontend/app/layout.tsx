'use client';

import { ThemeProvider } from 'next-themes';
import './styles/globals.css';
import { Header } from '@/components/ui/layout/header';
import Footer from '@/components/ui/layout/footer';
import Head from 'next/head';
import WalletProvider from '@/components/ui/wallet-provider';
import LayoutWrapper from "@/app/layout-wrapper";
import { supabase } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';
import { Poppins, Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });

// Define the User type based on your Supabase table structure
interface User {
  id: string;
  email: string;
  name: string;
  // Add other fields from your 'users' table if necessary
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<User[] | null>(null);  // Specify that userData can be an array of User objects or null

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);  // TypeScript will now know that data is of type User[]
          console.log('User Data:', data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <Head>
        <title>Default Title</title>
        <meta name="description" content="Default description" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Default Title" />
        <meta name="twitter:description" content="Default description" />
        <meta name="twitter:image" content="/default-twitter-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="canonical" href="https://blinkshare.fun" />
      </Head>

      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <Header />
            <main className="flex-grow w-full p-0 sm:p-0 md:p-0">{children}</main>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
