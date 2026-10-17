import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/kuafor",
        destination: "https://biply-kuafor.vercel.app/kuafor",
      },
      {
        source: "/kuafor/:path*",
        destination: "https://biply-kuafor.vercel.app/kuafor/:path*",
      },
    ];
  },
};

export default nextConfig;
