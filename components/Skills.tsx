import type { Profile, Skill } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function groupSkills(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category || "Tools";
    groups.set(key, [...(groups.get(key) ?? []), skill]);
  }

  const order = SITE.skillOrder as readonly string[];
  return [...groups.entries()].sort((a, b) => {
    const ai = order.indexOf(a[0]);
    const bi = order.indexOf(b[0]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export default function Skills({ profile, dictionary }: { profile: Profile; dictionary: Dictionary }) {
  const skills = profile.skills ?? [];
  if (!skills.length) return null;

  const groups = groupSkills(skills);
  const languages = profile.stats?.languages ?? [];
  const languageTotal = languages.reduce((sum, l) => sum + l.count, 0);

  return (
    <section id="skills" className="relative py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={dictionary.skills.eyebrow}
          title={dictionary.skills.title}
          description={dictionary.skills.description}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {groups.map(([category, items], groupIndex) => (
            <Reveal key={category} delay={groupIndex * 80}>
              <div className="glass card-glow h-full rounded-2xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-300">
                  {category}
                </h3>

                <ul className="mt-6 space-y-4">
                  {items.map((skill) => (
                    <li key={skill.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-slate-200">
                          {skill.name}
                        </span>
                        {typeof skill.level === "number" ? (
                          <span className="font-mono text-[0.6875rem] text-slate-500">
                            {skill.level}%
                          </span>
                        ) : null}
                      </div>
                      {typeof skill.level === "number" ? (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-aqua-400"
                            style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                          />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {languages.length ? (
          <Reveal delay={120}>
            <div className="glass mt-8 rounded-2xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-300">
                  {dictionary.skills.languageMix}
                </h3>
                <p className="font-mono text-xs text-slate-500">
                  {profile.stats?.publicRepos ?? languageTotal} {dictionary.skills.repos}
                </p>
              </div>

              <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/6">
                {languages.map((language, i) => {
                  const palette = [
                    "from-brand-500 to-brand-400",
                    "from-aqua-500 to-aqua-400",
                    "from-flare-500 to-flare-400",
                    "from-mint-400 to-aqua-400",
                  ];
                  return (
                    <span
                      key={language.name}
                      className={`h-full bg-gradient-to-r ${palette[i % palette.length]}`}
                      style={{ width: `${(language.count / languageTotal) * 100}%` }}
                      title={`${language.name}: ${language.count}`}
                    />
                  );
                })}
              </div>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {languages.map((language) => (
                  <li key={language.name} className="text-sm text-slate-400">
                    <span className="font-semibold text-slate-200">{language.name}</span>{" "}
                    · {language.count}{" "}
                    {language.count === 1 ? dictionary.skills.repo : dictionary.skills.repos}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
