import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/artist-studio/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
