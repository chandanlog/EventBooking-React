/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/EVENT-BOOKING-SYSTEM", // Keep this if you're using it as subpath
  assetPrefix: "/EVENT-BOOKING-SYSTEM/",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
