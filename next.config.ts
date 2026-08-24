import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const menuReferer = {
      type: "header" as const,
      key: "referer",
      value: "https?://(www\\.)?biply\\.com\\.tr/(menu|admin)/.*",
    };

    return {
      beforeFiles: [
        {
          source: "/_next/:path*",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/_next/:path*",
        },
        {
          source: "/category-soups.jpg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-soups.jpg",
        },
        {
          source: "/category-stews.webp",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-stews.webp",
        },
        {
          source: "/category-wraps.jpeg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-wraps.jpeg",
        },
        {
          source: "/category-oven.jpeg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-oven.jpeg",
        },
        {
          source: "/category-salads.jpg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-salads.jpg",
        },
        {
          source: "/category-drinks.jpg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/category-drinks.jpg",
        },
        {
          source: "/menu-default.png",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/menu-default.png",
        },
        {
          source: "/favicon.svg",
          has: [menuReferer],
          destination: "https://sazende-menu.mucahits8.chatgpt.site/favicon.svg",
        },
        {
          source: "/menu/:slug*",
          destination: "https://sazende-menu.mucahits8.chatgpt.site/menu/:slug*",
        },
        {
          source: "/admin/:slug*",
          destination: "https://sazende-menu.mucahits8.chatgpt.site/admin/:slug*",
        },
      ],
    };
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
