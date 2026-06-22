import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

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
      { source: '/portal/compare', destination: '/portal/sama-naffa', permanent: true },
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
    unoptimized: false,
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
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://touchpay.gutouch.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob: https://www.facebook.com https://cdn.jsdelivr.net; media-src 'self' blob:; connect-src 'self' https://touchpay.gutouch.net https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://connect.facebook.net https://www.facebook.com; frame-src 'self' https://vercel.live https://www.googletagmanager.com https://verify.didit.me; object-src 'none'; base-uri 'self'; form-action 'self' https://touchpay.gutouch.net; frame-ancestors 'none'${isDev ? '' : '; upgrade-insecure-requests'}`,
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
