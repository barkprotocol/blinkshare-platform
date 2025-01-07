import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during the build process
  },

  // Add other custom Next.js configurations if needed
};

export default nextConfig;
