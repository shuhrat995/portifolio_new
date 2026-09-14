export const SITE = {
  sections: [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],
  projectCategories: [
    "All",
    "Full-Stack",
    "Frontend",
    "Mobile",
    "Game",
    "Mini App",
    "Project",
  ],
  skillOrder: ["Core", "Framework", "Styling", "Tooling", "Tools"],
} as const;

/** Absolute site URL. Set NEXT_PUBLIC_SITE_URL to your real domain when deploying. */
export function siteUrl(path = "/"): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Social previews (OpenGraph, JSON-LD) require absolute URLs, so local assets
 * like `/my-photo.jpg` have to be resolved against the site URL.
 */
export function absoluteUrl(value: string): string {
  if (!value) return siteUrl("/");
  if (/^https?:\/\//i.test(value)) return value;
  return siteUrl(value);
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** The last path segment of a URL, e.g. the handle in `t.me/foo`. */
export function lastPathSegment(url: string): string {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? "";
  } catch {
    return "";
  }
}

export function formatMonthYear(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
