import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/data";
import { absoluteUrl, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.name || "Portfolio";
  const title = `${name} — ${profile.headline || "Frontend Developer"}`;
  const description =
    profile.bio?.[0] ||
    `${name} is a frontend developer building fast, modern web applications.`;
  // Social crawlers need an absolute image URL, so `/my-photo.jpg` is resolved
  // against the deployed domain.
  const image = profile.avatarUrl ? absoluteUrl(profile.avatarUrl) : undefined;

  return {
    metadataBase: new URL(siteUrl("/")),
    title,
    description,
    keywords: [
      name,
      "frontend developer",
      "React developer",
      "Next.js",
      "TypeScript",
      "Uzbekistan",
      profile.location,
      "portfolio",
    ].filter(Boolean) as string[],
    authors: [{ name, url: profile.github }],
    creator: name,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: name,
      locale: "en_US",
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#04050b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-slate-200">
        {children}
      </body>
    </html>
  );
}
