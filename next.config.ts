import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  poweredByHeader: false,

  // API route config for longer timeouts (image generation can take time)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
