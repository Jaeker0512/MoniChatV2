/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bing.com',
        pathname: '/th**',
      },
    ],
  },
}

module.exports = nextConfig

