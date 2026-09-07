/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the live testing cache separate from production build artifacts.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ],
  },
};

export default nextConfig;
