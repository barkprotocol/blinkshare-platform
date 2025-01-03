import { Poppins, Syne } from 'next/font/google';
import { ThemeProvider } from "next-themes";
import "./styles/globals.css";
import { Header } from '@/components/ui/layout/header';
import Footer from "@/components/ui/layout/footer";
import { metadata } from './metadata';
import Head from 'next/head';

const syne = Syne({ subsets: ["latin"], variable: '--font-syne' });
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"], variable: '--font-poppins' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        {metadata.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image" content={image.url} />
        ))}
        {metadata.twitter.images.map((image, index) => (
          <meta key={index} name="twitter:image" content={image} />
        ))}
        {/* Add favicon and icons for various platforms */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* Canonical link to prevent duplicate content issues */}
        <link rel="canonical" href={metadata.openGraph.url} />
      </Head>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <Header />
            <main className="flex-grow w-full p-0 sm:p-0 md:p-0">
              {children}
            </main>
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}