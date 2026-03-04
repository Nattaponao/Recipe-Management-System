// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.r-haan.com',
      },
      {
        protocol: 'https',
        hostname: 'food.mthai.com',
      },
      {
        protocol: 'https',
        hostname: 'img.wongnai.com',
      },
      {
        protocol: 'https',
        hostname: 'api2.krua.co',
      },
      {
        protocol: 'https',
        hostname: 'img-global.cpcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ofm.co.th',
      },
      {
        protocol: 'https',
        hostname: 'barggdkmqttzpknxtlmz.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
