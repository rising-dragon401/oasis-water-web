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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'connect.live-oasis.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'favorable-chickens-2e4f30c189.media.strapiapp.com',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
