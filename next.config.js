/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', '1000logos.net'],
  },
};

module.exports = nextConfig;
