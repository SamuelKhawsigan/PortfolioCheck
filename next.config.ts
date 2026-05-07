import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from your server's IP during development
  // This is required when accessing the dev server from a network IP
  experimental: {
    allowedDevOrigins: ["192.168.40.100", "localhost:3000"],
  },
};

export default nextConfig;
