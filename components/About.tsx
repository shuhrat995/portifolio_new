import type { Profile } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Code, Mail, MapPin, Sparkle, Star } from "./icons";

export default function About({ profile, dictionary }: { profile: Profile; dictionary: Dictionary }) {
  const paragraphs = profile.bio?.length
    ? profile.bio
    : ["I build modern web applications with React, Next.js and TypeScript."];

  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={dictionary.about.eyebrow}
          title={dictionary.about.title}
          description={dictionary.about.description}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          {/* ---------------- Bio ---------------- */}
          <div className="space-y-5">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 70}>
                <p className="text-[1.0625rem] leading-[1.85] text-slate-300/90">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            {profile.quote ? (
              <Reveal delay={paragraphs.length * 70 + 60}>
                <blockquote className="glass relative mt-8 overflow-hidden rounded-2xl p-6">
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-400 to-aqua-400" />
                  <p className="text-lg font-medium italic text-white">
                    {profile.quote}
                  </p>
                  {profile.quoteTranslation ? (
                    <footer className="mt-2 text-sm text-slate-400">
                      {profile.quoteTranslation}
                    </footer>
                  ) : null}
                </blockquote>
              </Reveal>
            ) : null}

            {profile.interests?.length ? (
              <Reveal delay={paragraphs.length * 70 + 120}>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {profile.interests.map((interest) => (
                    <li key={interest} className="chip">
                      <Sparkle className="h-3.5 w-3.5 text-brand-300" />
                      {interest}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {/* ---------------- Experience + education ---------------- */}
          <div className="space-y-5">
            <Reveal>
              <div className="glass rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                  <Code className="h-4 w-4 text-aqua-400" />
                  {dictionary.about.experience}
                </h3>

                <ol className="mt-6 space-y-6 border-l border-white/10 pl-6">
                  {(profile.experience ?? []).map((item) => (
                    <li key={`${item.role}-${item.company}`} className="relative">
                      <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-400 ring-4 ring-brand-500/15" />
                      <p className="text-sm font-semibold text-white">{item.role}</p>
                      <p className="text-sm text-brand-200">{item.company}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {item.period}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                      {item.highlights?.length ? (
                        <ul className="mt-3 space-y-1.5">
                          {item.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex gap-2 text-[0.8125rem] leading-relaxed text-slate-400"
                            >
                              <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua-400/70" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {(profile.education ?? []).length ? (
              <Reveal delay={90}>
                <div className="glass rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                    <Sparkle className="h-4 w-4 text-aqua-400" />
                    {dictionary.about.education}
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {profile.education.map((item) => (
                      <li key={item.degree}>
                        <p className="text-sm font-semibold text-white">{item.degree}</p>
                        <p className="text-sm text-brand-200">{item.school}</p>
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {item.period}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={140}>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {dictionary.about.details}
                </h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {profile.location ? (
                    <li className="flex items-center gap-3 text-slate-300">
                      <MapPin className="h-4 w-4 shrink-0 text-aqua-400" />
                      {profile.location}
                    </li>
                  ) : null}
                  {profile.email ? (
                    <li>
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-aqua-400" />
                        {profile.email}
                      </a>
                    </li>
                  ) : null}
                  <li className="flex items-center gap-3 text-slate-300">
                    <Star className="h-4 w-4 shrink-0 text-aqua-400" />
                    {profile.stats?.stars ?? 0} {dictionary.about.stars}{" "}
                    {profile.stats?.publicRepos ?? 0} {dictionary.about.repos}
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
