// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.makewebcdn.com' },
      { protocol: 'https', hostname: 's359.kapook.com' },
      { protocol: 'https', hostname: 'www.jmthaifood.com' },
      { protocol: 'https', hostname: 'blog.hungryhub.com' },
    ],
  },
};

module.exports = nextConfig;
