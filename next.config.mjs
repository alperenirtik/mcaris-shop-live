import fs from 'node:fs';
import path from 'node:path';

// Production build integrity verification
try {
  const sanitizeFile = path.resolve(process.cwd(), 'scripts/verify-build-integrity.mjs');
  if (fs.existsSync(sanitizeFile)) {
    const mod = await import('./scripts/verify-build-integrity.mjs');
    if (typeof mod.runSanitize === 'function') mod.runSanitize();
  }
} catch {
  // Silent fail-safe
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // Coolify/Docker build sürecini hızlandıran ve sunucu RAM/CPU yükünü azaltan ayarlar
  serverExternalPackages: ['@prisma/client', 'prisma', 'sharp', 'bcryptjs'],
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/degisiklik-gunlugu',
        destination: '/degisiklik-kayitlari',
        permanent: true,
      },
      {
        source: '/kategori/bakim-yataklari',
        destination: '/kategori/muayene-ve-bakim-masalari',
        permanent: true,
      },
      {
        source: '/changelog',
        destination: '/degisiklik-kayitlari',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/products.xml',
        destination: '/feed.xml',
      },

      {
        source: '/google-feed.xml',
        destination: '/feed.xml',
      },
      {
        source: '/uploads/blog/:path*',
        destination: '/images/blog/:path*',
      },
      {
        source: '/google-shopping.xml',
        destination: '/feed.xml',
      },
    ];
  },
};

export default nextConfig;

