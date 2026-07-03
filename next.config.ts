import type { NextConfig } from "next";
import { buildContentSecurityPolicy } from "./src/lib/csp";

const isDev = process.env.NODE_ENV === 'development';
const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/apesenegal', destination: '/sama-naffa', permanent: true },
      { source: '/apesenegal/:path*', destination: '/sama-naffa', permanent: true },
      { source: '/ape', destination: '/sama-naffa', permanent: true },
      { source: '/ape/:path*', destination: '/sama-naffa', permanent: true },
      { source: '/souscrire-ape', destination: '/sama-naffa', permanent: true },
      { source: '/souscrire-ape/:path*', destination: '/sama-naffa', permanent: true },
      { source: '/portal/ape', destination: '/portal/sama-naffa', permanent: true },
      { source: '/portal/ape/:path*', destination: '/portal/sama-naffa', permanent: true },
      { source: '/pee', destination: '/sama-naffa', permanent: true },
      { source: '/pee/:path*', destination: '/sama-naffa', permanent: true },
      { source: '/politique-confidentialite', destination: '/privacy', permanent: true },
    ];
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: isStaging,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Security headers
  async headers() {
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: buildContentSecurityPolicy(isDev),
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(self "https://verify.didit.me"), microphone=(self "https://verify.didit.me"), fullscreen=(self "https://verify.didit.me")',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
