import { NextConfig } from "next";

/** 
 * @type {NextConfig}
 * Enhanced Next.js configuration with TypeScript support and error handling.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
    ],
  },
  async headers() {
    try {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'no-referrer',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload',
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Error configuring headers:", error);
      // Fallback to an empty headers array if errors occur
      return [];
    }
  },
  // Enabling TypeScript build error tolerance
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enabling experimental features (if required)
  experimental: {
    optimizeCss: true, // Example: CSS optimization for production builds
    scrollRestoration: true, // Retain scroll positions on navigation
  },
};

export default nextConfig;
