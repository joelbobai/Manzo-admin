import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.manzo.ng",
      },
    ],
  },
};

export default nextConfig;
