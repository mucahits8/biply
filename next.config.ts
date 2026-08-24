import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/menu/:slug*",
        destination: "https://sazende-menu.mucahits8.chatgpt.site/menu/:slug*",
      },
      {
        source: "/admin/:slug*",
        destination: "https://sazende-menu.mucahits8.chatgpt.site/admin/:slug*",
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
