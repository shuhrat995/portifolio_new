"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { EducationItem, ExperienceItem, Profile, SaveMode, Skill } from "@/lib/types";
import { Plus, Spinner, Trash } from "@/components/icons";

type Props = {
  profile: Profile;
  onSaved: (profile: Profile, mode: SaveMode) => void;
};

function skillsToText(skills: Skill[]): string {
  return (skills ?? [])
    .map((s) => [s.name, s.category, s.level != null ? String(s.level) : ""].join(" | "))
    .join("\n");
}

function textToSkills(text: string): Skill[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, category, level] = line.split("|").map((p) => p?.trim() ?? "");
      const parsed = Number(level);
      return {
        name: name || "Skill",
        category: category || "Tools",
        ...(level && Number.isFinite(parsed) ? { level: Math.min(100, Math.max(0, parsed)) } : {}),
      };
    });
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function ProfileEditor({ profile, onSaved }: Props) {
  const [name, setName] = useState(profile.name ?? "");
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [roles, setRoles] = useState((profile.roles ?? []).join("\n"));
  const [bio, setBio] = useState((profile.bio ?? []).join("\n\n"));
  const [location, setLocation] = useState(profile.location ?? "");
  const [company, setCompany] = useState(profile.company ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [github, setGithub] = useState(profile.github ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [telegram, setTelegram] = useState(profile.telegram ?? "");
  const [linkedin, setLinkedin] = useState(profile.linkedin ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl ?? "");
  const [quote, setQuote] = useState(profile.quote ?? "");
  const [quoteTranslation, setQuoteTranslation] = useState(profile.quoteTranslation ?? "");
  const [interests, setInterests] = useState((profile.interests ?? []).join("\n"));
  const [skillsText, setSkillsText] = useState(skillsToText(profile.skills ?? []));
  const [experience, setExperience] = useState<ExperienceItem[]>(
    profile.experience ?? []
  );
  const [education, setEducation] = useState<EducationItem[]>(profile.education ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setDone(false);

    const payload: Partial<Profile> = {
      name,
      headline,
      roles: linesToArray(roles),
      bio: bio
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      location,
      company,
      avatarUrl,
      github,
      email,
      telegram,
      linkedin,
      resumeUrl,
      quote,
      quoteTranslation,
      interests: linesToArray(interests),
      skills: textToSkills(skillsText),
      experience,
      education,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        profile?: Profile;
        mode?: SaveMode;
        error?: string;
      };

      if (!res.ok || !data.profile) {
        setError(data.error || "Could not save the profile.");
        setSaving(false);
        return;
      }

      onSaved(data.profile, data.mode ?? "filesystem");
      setDone(true);
      setSaving(false);
      window.setTimeout(() => setDone(false), 2600);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ---------------- Identity ---------------- */}
      <Panel title="Identity" hint="Shown in the hero, navbar and footer.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Headline" value={headline} onChange={setHeadline} />
          <div className="sm:col-span-2">
            <Field
              label="Roles (one per line — rotated in the hero)"
              value={roles}
              onChange={setRoles}
              textarea
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Bio — separate paragraphs with a blank line"
              value={bio}
              onChange={setBio}
              textarea
              rows={9}
            />
          </div>
          <Field label="Location" value={location} onChange={setLocation} />
          <Field label="Company / school" value={company} onChange={setCompany} />
          <div className="sm:col-span-2">
            <Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} />
          </div>
        </div>
      </Panel>

      {/* ---------------- Links ---------------- */}
      <Panel title="Links" hint="Any field left empty is hidden on the site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub" value={github} onChange={setGithub} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Telegram" value={telegram} onChange={setTelegram} />
          <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} />
          <div className="sm:col-span-2">
            <Field
              label="Résumé / CV URL"
              value={resumeUrl}
              onChange={setResumeUrl}
              placeholder="Adds a download button in the hero"
            />
          </div>
        </div>
      </Panel>

      {/* ---------------- Voice ---------------- */}
      <Panel title="Voice" hint="A small personal touch for the about section.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quote" value={quote} onChange={setQuote} />
          <Field
            label="Quote translation"
            value={quoteTranslation}
            onChange={setQuoteTranslation}
          />
          <div className="sm:col-span-2">
            <Field
              label="Interests (one per line)"
              value={interests}
              onChange={setInterests}
              textarea
              rows={3}
            />
          </div>
        </div>
      </Panel>

      {/* ---------------- Skills ---------------- */}
      <Panel
        title="Skills"
        hint="One per line as: Name | Category | Level — level is optional (0-100)."
      >
        <Field
          label={`${textToSkills(skillsText).length} skills`}
          value={skillsText}
          onChange={setSkillsText}
          textarea
          rows={14}
          mono
        />
      </Panel>

      {/* ---------------- Experience ---------------- */}
      <Panel title="Experience" hint="Rendered as a timeline in the about section.">
        <div className="space-y-4">
          {experience.map((item, index) => (
            <RepeaterCard
              key={index}
              onRemove={() =>
                setExperience((prev) => prev.filter((_, i) => i !== index))
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Role"
                  value={item.role}
                  onChange={(v) =>
                    setExperience((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, role: v } : p))
                    )
                  }
                />
                <Field
                  label="Company"
                  value={item.company}
                  onChange={(v) =>
                    setExperience((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, company: v } : p))
                    )
                  }
                />
                <Field
                  label="Period"
                  value={item.period}
                  onChange={(v) =>
                    setExperience((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, period: v } : p))
                    )
                  }
                />
                <Field
                  label="Location"
                  value={item.location ?? ""}
                  onChange={(v) =>
                    setExperience((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, location: v } : p))
                    )
                  }
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Highlights (one per line)"
                    value={(item.highlights ?? []).join("\n")}
                    onChange={(v) =>
                      setExperience((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, highlights: linesToArray(v) } : p
                        )
                      )
                    }
                    textarea
                    rows={4}
                  />
                </div>
              </div>
            </RepeaterCard>
          ))}

          <AddButton
            label="Add experience"
            onClick={() =>
              setExperience((prev) => [
                ...prev,
                { role: "", company: "", period: "", location: "", highlights: [] },
              ])
            }
          />
        </div>
      </Panel>

      {/* ---------------- Education ---------------- */}
      <Panel title="Education" hint="Shown below experience.">
        <div className="space-y-4">
          {education.map((item, index) => (
            <RepeaterCard
              key={index}
              onRemove={() => setEducation((prev) => prev.filter((_, i) => i !== index))}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Degree / programme"
                  value={item.degree}
                  onChange={(v) =>
                    setEducation((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, degree: v } : p))
                    )
                  }
                />
                <Field
                  label="School"
                  value={item.school}
                  onChange={(v) =>
                    setEducation((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, school: v } : p))
                    )
                  }
                />
                <Field
                  label="Period"
                  value={item.period}
                  onChange={(v) =>
                    setEducation((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, period: v } : p))
                    )
                  }
                />
                <Field
                  label="Location"
                  value={item.location ?? ""}
                  onChange={(v) =>
                    setEducation((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, location: v } : p))
                    )
                  }
                />
              </div>
            </RepeaterCard>
          ))}

          <AddButton
            label="Add education"
            onClick={() =>
              setEducation((prev) => [
                ...prev,
                { degree: "", school: "", period: "", location: "" },
              ])
            }
          />
        </div>
      </Panel>

      {/* ---------------- Sticky save bar ---------------- */}
      <div className="glass-strong sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3.5">
        <p className="text-xs text-slate-400">
          GitHub stats and language counts are refreshed by{" "}
          <code className="font-mono text-slate-300">npm run sync</code> and are never
          overwritten here.
        </p>

        <div className="flex items-center gap-3">
          {error ? (
            <span role="alert" className="text-xs text-rose-300">
              {error}
            </span>
          ) : null}
          {done ? <span className="text-xs text-mint-400">Saved ✓</span> : null}

          <button type="submit" disabled={saving} className="btn btn-primary !py-2.5">
            {saving ? <Spinner className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <header className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  mono,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  mono?: boolean;
  placeholder?: string;
}) {
  const id = `field-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`field resize-y ${mono ? "font-mono !text-xs" : ""}`}
        />
      ) : (
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field"
        />
      )}
    </div>
  );
}

function RepeaterCard({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-white/8 bg-white/2 p-4">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove entry"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
      >
        <Trash className="h-4 w-4" />
      </button>
      <div className="pr-10">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400 transition-colors hover:border-brand-500/50 hover:text-white"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}
