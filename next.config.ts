// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const nextConfig = {
  swcMinify: true, // ✅ Minify JS

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.r-haan.com' },
      { protocol: 'https', hostname: 'food.mthai.com' },
      { protocol: 'https', hostname: 'img.wongnai.com' },
      { protocol: 'https', hostname: 'api2.krua.co' },
      { protocol: 'https', hostname: 'img-global.cpcdn.com' },
      { protocol: 'https', hostname: 'www.ofm.co.th' },
      { protocol: 'https', hostname: 'barggdkmqttzpknxtlmz.supabase.co' },
    ],
  },
};

module.exports = nextConfig;
