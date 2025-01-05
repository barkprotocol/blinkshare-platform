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
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';", // Safer content security
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Error configuring headers:", error);
      return []; // Return empty array if error occurs
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: false,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.cache = {
        type: 'filesystem',
      };
    }
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;