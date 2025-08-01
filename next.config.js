/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/public/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
