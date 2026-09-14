import type { Profile } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { GitHubIcon, LinkedInIcon, TelegramIcon } from "./icons";

export default function Footer({ profile, dictionary }: { profile: Profile; dictionary: Dictionary }) {
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.github, label: "GitHub", icon: GitHubIcon },
    profile.telegram && { href: profile.telegram, label: "Telegram", icon: TelegramIcon },
    profile.linkedin && { href: profile.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  ].filter(Boolean) as { href: string; label: string; icon: typeof GitHubIcon }[];

  return (
    <footer className="relative mt-8 border-t border-white/8 pt-12 pb-8">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-aqua-500 text-[0.7rem] font-bold text-white">
                {(profile.name || "S")
                  .split(/\s+/)
                  .map((p) => p[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              {profile.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {profile.headline || "Frontend Developer"} ·{" "}
              {profile.location || "Uzbekistan"}
            </p>
            {profile.telegram ? (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                {dictionary.footer.cta}{" "}
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-aqua-400 transition-colors hover:text-white"
                >
                  {dictionary.footer.ctaLink}
                </a>
              </p>
            ) : null}
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {dictionary.footer.sections}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
              {SITE.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {dictionary.sections[section.id as keyof typeof dictionary.sections]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {dictionary.footer.elsewhere}
            </p>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-brand-500/50 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {profile.name}. {dictionary.footer.rights}
          </p>
          <p className="font-mono">
            {dictionary.footer.built}
          </p>
        </div>
      </div>
    </footer>
  );
}
