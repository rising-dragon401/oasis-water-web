/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
    appDir: true,
  },
}

module.exports = nextConfig
