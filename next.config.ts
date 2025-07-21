import type { NextConfig } from "next";
import createMDX from '@next/mdx';


const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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
    turbo:{
      resolveExtensions:['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
      rules:{
        '*.mdx':{
          loaders:['@mdx-js/loader'],
          as: '*.tsx',
        }
      }
    },
    mdxRs: true,
  },
  // ISR configuration
  cacheMaxMemorySize: 0, // Use default cache size for ISR


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

  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
