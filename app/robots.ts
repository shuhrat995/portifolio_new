import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin panel and its API must never be indexed.
        disallow: ["/qw", "/qw/", "/api/"],
      },
    ],
  };
}
