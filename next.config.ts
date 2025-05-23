import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**/**',
        search: '',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1900mb',
    },
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
