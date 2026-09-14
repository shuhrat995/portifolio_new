import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avatars come from GitHub; project screenshots can be pasted in from the
    // admin panel on any https host, hence the wildcard.
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
