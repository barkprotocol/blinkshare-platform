import { Poppins, Syne } from 'next/font/google';
import { ThemeProvider } from "next-themes";
import "./styles/globals.css";
import { Header } from '@/components/ui/layout/header';
import Footer from "@/components/ui/layout/footer";
import { WalletContextProvider } from '@/components/ui/wallet-providers';

const syne = Syne({ subsets: ["latin"], variable: '--font-syne' });
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"], variable: '--font-poppins' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletContextProvider>
            <Header />
            <main className="flex-grow w-full p-0 sm:p-0 md:p-0">
              {children}
            </main>
            <Footer />
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
