// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const nextConfig = {


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
      { protocol: 'https', hostname: 'www.r-haan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'food.mthai.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.wongnai.com', pathname: '/**' },
      { protocol: 'https', hostname: 'api2.krua.co', pathname: '/**' },
      { protocol: 'https', hostname: 'img-global.cpcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ofm.co.th', pathname: '/**' },
      { protocol: 'https', hostname: 'barggdkmqttzpknxtlmz.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 's359.kapook.com', pathname: '/**' }, // เพิ่ม pathname
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },   // กันเหนียวสำหรับ placeholder
    ],
  },
};

module.exports = nextConfig;