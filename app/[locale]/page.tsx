import type { Metadata } from "next";
import { notFound } from "next/navigation";
import About from "@/components/About";
import Background from "@/components/Background";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { getProfile, getProjects } from "@/lib/data";
import { getDictionary, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return { title: "Shuhrat Madaminov", alternates: { languages: Object.fromEntries(LOCALES.map((item) => [item, `/${item}`])) } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;
  const dictionary = getDictionary(locale);
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const liveCount = projects.filter((p) => p.liveUrl).length;
  const structuredData = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    jobTitle: profile.headline, url: profile.github, image: absoluteUrl(profile.avatarUrl),
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: [profile.github, profile.linkedin, profile.telegram].filter(Boolean),
    knowsAbout: (profile.skills ?? []).map((s) => s.name),
  };

  return <>
    <Background />
    <Navbar name={profile.name} github={profile.github} locale={locale} dictionary={dictionary} />
    <main className="flex-1">
      <Hero profile={profile} projectCount={projects.length} liveCount={liveCount} dictionary={dictionary} />
      <About profile={profile} dictionary={dictionary} />
      <Skills profile={profile} dictionary={dictionary} />
      <Projects projects={projects} dictionary={dictionary} />
      <Contact profile={profile} dictionary={dictionary} />
    </main>
    <Footer profile={profile} dictionary={dictionary} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </>;
}