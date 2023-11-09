const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
    appDir: true,
  },
}

module.exports = withContentlayer(nextConfig)
