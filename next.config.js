const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'inruqrymqosbfeygykdx.supabase.co',
        port: '',
      },
    ],
  },
}

module.exports = withContentlayer(nextConfig)
