import { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://blinkshare.fun";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BlinkShare",
  description: "BlinkShare is a powerful platform and tool that bridges the gap between Discord and the Solana blockchain",
  openGraph: {
    title: "BlinkShare",
    description: "Empower your Discord community with Solana-based transactions",
    url: defaultUrl,
    siteName: "BlinkShare",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlinkShare",
    description: "Empower your Discord community with Solana-based transactions",
    images: [`${defaultUrl}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default metadata;
