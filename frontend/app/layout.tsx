"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import "./styles/globals.css";
import { Header } from "@/components/ui/layout/header";
import Footer from "@/components/ui/layout/footer";
import Head from "next/head";
import WalletProvider from "@/components/ui/wallet-provider";
import { supabase } from "@/lib/supabase-client";
import { Syne, Poppins } from "next/font/google";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-poppins" });

interface User {
  id: string;
  email: string;
  name: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <Head>
        <title>Default Title</title>
        <meta name="description" content="Default description" />
        <meta property="og:title" content="Default Title" />
        <meta property="og:description" content="Default description" />
        <meta property="og:image" content="/default-og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://blinkshare.fun" />
      </Head>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
