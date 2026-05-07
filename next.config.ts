import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moved allowedDevOrigins to the top level (removed from experimental)
  // as per the Next.js 16 warning suggestion.
  allowedDevOrigins: ["192.168.40.100", "localhost:3000"],
} as any; // Cast to any because the type definition might not be updated yet

export default nextConfig;
