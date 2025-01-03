module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typescript: {
    // Set to true to ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Set to true to ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};
