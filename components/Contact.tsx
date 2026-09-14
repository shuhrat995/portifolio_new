import type { Profile } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { lastPathSegment } from "@/lib/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  ArrowUpRight,
  GitHubIcon,
  LinkedInIcon,
  Mail,
  TelegramIcon,
} from "./icons";

export default function Contact({ profile, dictionary }: { profile: Profile; dictionary: Dictionary }) {
  const channels = [
    profile.telegram && {
      label: "Telegram",
      value: "@" + lastPathSegment(profile.telegram),
      href: profile.telegram,
      icon: TelegramIcon,
      hint: dictionary.contact.fastest,
      accent: "from-sky-500/25 to-aqua-500/10",
    },
    profile.email && {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
      hint: dictionary.contact.work,
      accent: "from-brand-500/25 to-flare-500/10",
    },
    profile.linkedin && {
      label: "LinkedIn",
      value: lastPathSegment(profile.linkedin) || "LinkedIn profile",
      href: profile.linkedin,
      icon: LinkedInIcon,
      hint: dictionary.contact.professional,
      accent: "from-brand-500/25 to-aqua-500/10",
    },
    profile.github && {
      label: "GitHub",
      value: `@${profile.username}`,
      href: profile.github,
      icon: GitHubIcon,
      hint: dictionary.contact.source,
      accent: "from-slate-500/25 to-brand-500/10",
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    icon: typeof Mail;
    hint: string;
    accent: string;
  }[];

  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={dictionary.contact.eyebrow}
          title={dictionary.contact.title}
          description={dictionary.contact.description}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {channels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <Reveal key={channel.label} delay={i * 70}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="glass card-glow group flex items-center gap-4 rounded-2xl p-5"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${channel.accent} ring-1 ring-white/10`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {channel.label}
                    </span>
                    <span className="mt-1 block truncate text-[0.9375rem] font-medium text-white">
                      {channel.value}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {channel.hint}
                    </span>
                  </span>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-aqua-300" />
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <div className="glass relative mt-6 overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[90px]" />

            <p className="eyebrow">{dictionary.contact.available}</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {dictionary.contact.looking}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {dictionary.contact.remote.replace("{location}", profile.location || "Uzbekistan")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {profile.telegram ? (
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <TelegramIcon className="h-4 w-4" />
                  {dictionary.contact.telegram}
                </a>
              ) : null}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <GitHubIcon className="h-4 w-4" />
                {dictionary.contact.browse}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
