import { NextConfig } from 'next';

/**
 * @type {NextConfig}
 * Enhanced Next.js configuration with TypeScript support, error handling, and performance optimization.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com', // Allow images from Discord CDN
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com', // Allow images from Ucare CDN
      },
    ],
    domains: ['blinkshare.fun'], // Domains where SVGs be hosted
    formats: ['image/webp'], // Specify webp as an acceptable image format
  },

  // Headers Configuration for enhanced security
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
      // Log error and return an empty array if headers cannot be set
      console.error('Error configuring headers:', error);
      return [];
    }
  },

  // TypeScript Configuration
  typescript: {
    ignoreBuildErrors: false, // Set this to false to enable strict checking during production
  },

  experimental: {
    optimizeCss: true, // Enable CSS optimization for production performance
    scrollRestoration: true, // Enable scroll restoration for improved user experience
  },

  // Webpack Configuration
  webpack(config, { isServer }) {
    if (!isServer) {
      config.cache = {
        type: 'filesystem', // Enable filesystem caching for client-side builds
      };
    }

    // Add support for importing SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Further optimization for production (tree shaking, etc.)
    if (!isServer) {
      config.optimization = {
        splitChunks: {
          chunks: 'all', // Split code for better caching
        },
      };
    }

    return config;
  },

  // React Strict Mode for better debugging during development
  reactStrictMode: true,

  // Enabling SWC-based minification for better performance
  swcMinify: true,
};

export default nextConfig;
