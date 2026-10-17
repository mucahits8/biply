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
        source: "/kuafor/randevu",
        destination: "https://biply-randevu.vercel.app/kuafor/randevu",
      },
      {
        source: "/kuafor/randevu/:path*",
        destination: "https://biply-randevu.vercel.app/kuafor/randevu/:path*",
      },
      {
        source: "/kuafor/:path*",
        destination: "https://biply-kuafor.vercel.app/kuafor/:path*",
      },
    ];
  },
};

export default nextConfig;
