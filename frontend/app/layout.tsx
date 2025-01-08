"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import "./styles/globals.css";
import { Header } from "@/components/ui/layout/header";
import Footer from "@/components/ui/layout/footer";
import Head from "next/head";
import WalletProvider from "@/components/ui/wallet-provider";
import { Syne, Poppins } from "next/font/google";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const networkEnv = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Mainnet;
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const router = useRouter();

  const [isPrivyAppIdMissing, setPrivyAppIdMissing] = useState(false);

  useEffect(() => {
    if (!privyAppId) {
      const errorMessage = "Privy app ID is missing. Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment variables.";
      console.error(errorMessage);
      toast.error("Configuration error. Please contact support.");
      setPrivyAppIdMissing(true);
      // Redirect to the support page for more details
      router.push('https://docs.blinkshare.fun/support');
    }
  }, [privyAppId, router]);

  // If Privy app ID is missing, return null to prevent the app from rendering
  if (isPrivyAppIdMissing) {
    return null;
  }

  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <Head>
        <title>BlinkShare | Community Experience Redefined</title>
        <meta
          name="description"
          content="Enhance your community experience with BlinkShare's robust tools for payments, analytics, and management."
        />
        <meta property="og:title" content="BlinkShare | Community Tools" />
        <meta
          property="og:description"
          content="Seamless Solana-based transactions, insightful analytics, and role management for your community."
        />
        <meta property="og:image" content="/assets/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://blinkshare.fun" />
      </Head>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <Header />
            <main className="flex-grow w-full px-0 md:px-0 lg:px-0 py-0">{children}</main>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
