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
        hostname: "cdn.discordapp.com", // Allow images from Discord CDN
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com", // Allow images from Ucare CDN
      },
    ],
  },
  async headers() {
    try {
      // Return headers for all routes to improve security and privacy
      return [
        {
          source: '/(.*)', // Applies to all routes
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY', // Prevent embedding in frames (XSS protection)
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff', // Prevent MIME sniffing attacks
            },
            {
              key: 'Referrer-Policy',
              value: 'no-referrer', // Prevent sending referrer information
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload', // Enforce HTTPS across all subdomains
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Error configuring headers:", error);
      // If an error occurs, return an empty array as a fallback
      return [];
    }
  },
  // Enabling TypeScript build error tolerance
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript build errors during build
  },
  // Enabling experimental features (if required)
  experimental: {
    optimizeCss: false, // Disable CSS optimization (for development or debugging)
    scrollRestoration: false, // Disable scroll restoration on navigation
  },
};

export default nextConfig;
