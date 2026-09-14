import Image from "next/image";
import type { Profile } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import RoleRotator from "./RoleRotator";
import Reveal from "./Reveal";
import {
  ArrowRight,
  Download,
  GitHubIcon,
  Layers,
  MapPin,
  Sparkle,
  Star,
  TelegramIcon,
} from "./icons";

type HeroProps = {
  profile: Profile;
  projectCount: number;
  liveCount: number;
  dictionary: Dictionary;
};

const MARQUEE_TECH = [
  "React.js",
  "Next.js",
  "TypeScript",
  "JavaScript (ES6+)",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
  "Zustand",
  "Framer Motion",
  "Vite",
  "REST APIs",
  "Capacitor",
  "Git",
  "Figma",
  "Vercel",
];

export default function Hero({ profile, projectCount, liveCount, dictionary }: HeroProps) {
  const roles = profile.roles?.length
    ? profile.roles
    : ["Frontend Developer", "React & Next.js Developer"];

  const stats = [
    { label: dictionary.hero.projects, value: projectCount, icon: Layers },
    { label: dictionary.hero.deployments, value: liveCount, icon: Sparkle },
    { label: dictionary.hero.stars, value: profile.stats?.stars ?? 0, icon: Star },
    { label: dictionary.hero.technologies, value: profile.skills?.length ?? 0, icon: Sparkle },
  ];

  const firstName = profile.name?.split(" ")[0] || "Hello";

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          {/* ---------------- Copy ---------------- */}
          <div>
            <Reveal>
              <span className="chip chip-brand !py-1.5 !pl-2.5 !pr-3.5 !text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
                </span>
                {dictionary.hero.available}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
                {profile.name}
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
                <RoleRotator roles={roles} />
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-[1.0625rem]">
                {profile.bio?.[0] ||
                  `${firstName} builds fast, modern web applications with React and Next.js.`}
              </p>
            </Reveal>

            {profile.location ? (
              <Reveal delay={240}>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-aqua-400" />
                  {profile.location}
                  {profile.company ? (
                    <>
                      <span className="text-ink-600">•</span>
                      <span className="truncate">{profile.company}</span>
                    </>
                  ) : null}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-primary">
                  {dictionary.hero.viewWork}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </a>
                {profile.telegram ? (
                  <a
                    href={profile.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <TelegramIcon className="h-4 w-4" />
                    {dictionary.hero.telegram}
                  </a>
                ) : null}
                {profile.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <Download className="h-4 w-4" />
                    {dictionary.hero.resume}
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* ---------------- Portrait card ---------------- */}
          <Reveal delay={160} className="justify-self-center lg:justify-self-end">
            <div className="relative w-[17rem] sm:w-[19rem]">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/35 via-aqua-500/25 to-flare-500/30 blur-2xl" />

              <div className="glass card-glow relative overflow-hidden rounded-[2rem] p-5">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      fill
                      sizes="(max-width: 640px) 272px, 304px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-aqua-600 text-5xl font-bold text-white/90">
                      {(profile.name || "S").slice(0, 1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      @{profile.username}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {profile.stats?.followers ?? 0} {dictionary.hero.followers} ·{" "}
                      {profile.stats?.following ?? 0} {dictionary.hero.following}
                    </p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <GitHubIcon className="h-4 w-4 text-slate-300" />
                  </span>
                </div>
              </div>

              {/* Floating accents, pinned to the card's side edges */}
              <span className="glass-strong absolute -left-5 top-14 hidden animate-float rounded-xl px-3 py-2 text-xs font-medium text-aqua-300 shadow-lg shadow-black/50 sm:block">
                React &amp; Next.js
              </span>
              <span
                className="glass-strong absolute -right-4 top-1/2 hidden animate-float rounded-xl px-3 py-2 text-xs font-medium text-brand-200 shadow-lg shadow-black/50 sm:block"
                style={{ animationDelay: "-3.5s" }}
              >
                TypeScript
              </span>
            </div>
          </Reveal>
        </div>

        {/* ---------------- Stats ---------------- */}
        <Reveal delay={120}>
          <dl className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-4 sm:p-5">
                <Icon className="h-4 w-4 text-aqua-400" />
                <dd className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {value}
                </dd>
                <dt className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* ---------------- Tech marquee ---------------- */}
      <div className="mt-16 select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-3">
          {[...MARQUEE_TECH, ...MARQUEE_TECH].map((tech, i) => (
            <span key={`${tech}-${i}`} className="chip !px-4 !py-2 !text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
