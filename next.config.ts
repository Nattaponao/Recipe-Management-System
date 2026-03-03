// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */

/*
const nextConfig = {
  images: {
    domains: [
      'food.mthai.com',
      'img.wongnai.com',
      'api2.krua.co',
      'www.r-haan.com',
      'img-global.cpcdn.com',
      'www.ofm.co.th',
    ],
  },
};

module.exports = nextConfig;
*/

/** @type {import('next').NextConfig} */
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
    ],
  },
};

module.exports = nextConfig;
