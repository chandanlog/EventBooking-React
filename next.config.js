/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Ensures static export
  basePath: "/EVENT-BOOKING-SYSTEM", // GitHub repository name
  assetPrefix: "/EVENT-BOOKING-SYSTEM/", // Ensures assets load correctly
  images: {
    unoptimized: true, // Fixes image issues in static export
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },
};

module.exports = nextConfig;
