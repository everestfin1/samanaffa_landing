import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    domains: [
      'localhost', 
      'vercel.app', 
      'lrq4w9dhzaifcdic.public.blob.vercel-storage.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Prisma client is properly bundled
      config.externals = config.externals || [];
      config.externals.push({
        '.prisma/client/index-browser': '@prisma/client/index-browser',
      });
    }
    return config;
  },
};

export default nextConfig;
