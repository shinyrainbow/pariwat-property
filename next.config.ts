import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "naina-hub.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
