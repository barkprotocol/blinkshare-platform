"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { WalletProvider } from "@/lib/contexts/wallet-provider";
import { ThemeProvider } from "@/lib/contexts/theme-provider";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <WalletProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />
            
            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>

          {/* Toaster for notifications */}
          <Toaster position="bottom-center" />
        </WalletProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
