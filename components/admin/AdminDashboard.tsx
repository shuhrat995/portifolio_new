"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import type { Profile, Project } from "@/lib/types";
import ProjectEditor from "./ProjectEditor";
import ProfileEditor from "./ProfileEditor";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  GitHubIcon,
  Layers,
  LogOut,
  Pencil,
  Plus,
  Search,
  Sparkle,
  Spinner,
  Star,
} from "@/components/icons";

type Props = {
  initialProfile: Profile;
  initialProjects: Project[];
};

type Toast = { message: string; tone: "ok" | "warn" };

const THUMB_PALETTES = [
  "from-brand-500 to-aqua-500",
  "from-flare-500 to-brand-500",
  "from-aqua-500 to-mint-400",
  "from-amber-500 to-flare-500",
];

function thumbClass(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return THUMB_PALETTES[Math.abs(hash) % THUMB_PALETTES.length];
}

export default function AdminDashboard({
  initialProfile,
  initialProjects,
}: Props) {
  const router = useRouter();

  const [tab, setTab] = useState<"projects" | "profile">("projects");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Project | null | undefined>(undefined);
  const [toast, setToast] = useState<Toast | null>(null);
  const [busySlug, setBusySlug] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  function flash(message: string, tone: "ok" | "warn" = "ok") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter((p) =>
      `${p.name} ${p.category} ${p.language} ${(p.tech ?? []).join(" ")}`
        .toLowerCase()
        .includes(needle)
    );
  }, [projects, query]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      visible: projects.filter((p) => p.visible !== false).length,
      featured: projects.filter((p) => p.featured).length,
      live: projects.filter((p) => p.liveUrl).length,
    }),
    [projects]
  );

  /* ---------------- Project actions ---------------- */

  function onSaved(project: Project) {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === project.id);
      if (index === -1) return [project, ...prev];
      const next = [...prev];
      next[index] = project;
      return next;
    });
    setEditing(undefined);
    flash("Saved successfully.");
    router.refresh();
  }

  function onDeleted(slug: string) {
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
    setEditing(undefined);
    flash("Project deleted");
    router.refresh();
  }

  async function patchProject(project: Project, changes: Partial<Project>) {
    setBusySlug(project.slug);
    const optimistic = { ...project, ...changes };
    setProjects((prev) => prev.map((p) => (p.slug === project.slug ? optimistic : p)));

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch {
      setProjects((prev) => prev.map((p) => (p.slug === project.slug ? project : p)));
      flash("Could not update the project", "warn");
    } finally {
      setBusySlug("");
    }
  }

  async function move(slug: string, direction: -1 | 1) {
    const index = projects.findIndex((p) => p.slug === slug);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= projects.length) return;

    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);

    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: next.map((p) => p.slug) }),
      });
      if (!res.ok) throw new Error("Reorder failed");
      router.refresh();
    } catch {
      setProjects(projects);
      flash("Could not save the new order", "warn");
    }
  }

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/qw");
    router.refresh();
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 20% 0%, rgba(124,58,237,0.22), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(6,182,212,0.16), transparent 70%)",
        }}
      />

      <header className="glass-strong sticky top-0 z-40 border-b border-white/8">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-aqua-500 shadow-lg shadow-brand-600/30">
              <Layers className="h-5 w-5 text-white" />
            </span>
            <div>
              <h1 className="text-sm font-semibold text-white">Admin dashboard</h1>
              <p className="text-xs text-slate-500">
                {profile.name} · @{profile.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !px-4 !py-2 !text-[0.8125rem]"
            >
              <ArrowUpRight className="h-4 w-4" />
              View site
            </a>

            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="btn btn-ghost !px-4 !py-2 !text-[0.8125rem]"
            >
              {loggingOut ? (
                <Spinner className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        {/* ------------------------- Tabs ------------------------- */}
        <div className="glass mb-6 inline-flex rounded-2xl p-1.5">
          {(["projects", "profile"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === key
                  ? "bg-gradient-to-r from-brand-500 to-aqua-500 text-white shadow-lg shadow-brand-600/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {key === "projects" ? `Projects (${stats.total})` : "Profile"}
            </button>
          ))}
        </div>

        {tab === "projects" ? (
          <div className="space-y-6">
            {/* ------------------------- Stats ------------------------- */}
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Total projects", value: stats.total, icon: Layers },
                { label: "Visible publicly", value: stats.visible, icon: Eye },
                { label: "Featured", value: stats.featured, icon: Sparkle },
                { label: "With live demo", value: stats.live, icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass rounded-2xl p-4">
                  <Icon className="h-4 w-4 text-aqua-400" />
                  <dd className="mt-2.5 text-2xl font-bold text-white">{value}</dd>
                  <dt className="mt-0.5 text-xs text-slate-400">{label}</dt>
                </div>
              ))}
            </dl>

            {/* ------------------------- Toolbar ------------------------- */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter projects…"
                  aria-label="Filter projects"
                  className="field !pl-11"
                />
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn btn-primary !py-2.5"
              >
                <Plus className="h-4 w-4" />
                New project
              </button>
            </div>

            {/* ------------------------- List ------------------------- */}
            <ul className="space-y-2.5">
              {filtered.map((project, index) => (
                <li
                  key={project.id}
                  className="glass flex flex-col gap-3 rounded-2xl p-3.5 transition-colors hover:border-white/16 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${thumbClass(
                      project.slug
                    )} text-sm font-bold text-white`}
                  >
                    {project.name.slice(0, 2).toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {project.name}
                      </p>
                      {project.featured ? (
                        <span className="chip chip-brand !py-0 !text-[0.625rem]">
                          featured
                        </span>
                      ) : null}
                      {project.visible === false ? (
                        <span className="chip !py-0 !text-[0.625rem] !text-amber-300">
                          hidden
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{project.category}</span>
                      {project.language ? <span>{project.language}</span> : null}
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-mint-400 hover:underline"
                        >
                          live demo ↗
                        </a>
                      ) : (
                        <span className="opacity-60">no demo</span>
                      )}
                    </p>
                  </div>

                  {busySlug === project.slug ? (
                    <Spinner className="h-4 w-4 shrink-0 animate-spin text-slate-400" />
                  ) : null}

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <IconButton
                      label="Move up"
                      disabled={index === 0 || Boolean(query)}
                      onClick={() => move(project.slug, -1)}
                    >
                      ↑
                    </IconButton>
                    <IconButton
                      label="Move down"
                      disabled={index === filtered.length - 1 || Boolean(query)}
                      onClick={() => move(project.slug, 1)}
                    >
                      ↓
                    </IconButton>
                    <IconButton
                      label={project.featured ? "Unfeature" : "Feature"}
                      active={project.featured}
                      onClick={() =>
                        patchProject(project, { featured: !project.featured })
                      }
                    >
                      <Sparkle className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label={project.visible === false ? "Show" : "Hide"}
                      active={project.visible !== false}
                      onClick={() =>
                        patchProject(project, { visible: project.visible === false })
                      }
                    >
                      {project.visible === false ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </IconButton>
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open repository"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setEditing(project)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 text-xs font-medium text-slate-200 transition-colors hover:border-brand-500/50 hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                </li>
              ))}

              {!filtered.length ? (
                <li className="glass rounded-2xl px-6 py-14 text-center">
                  <p className="text-sm text-slate-400">No projects match that filter.</p>
                </li>
              ) : null}
            </ul>

            <p className="text-xs text-slate-500">Order here is the order visitors see.</p>
          </div>
        ) : (
          <ProfileEditor
            profile={profile}
              onSaved={(updated) => {
              setProfile(updated);
                flash("Saved successfully.");
              router.refresh();
            }}
          />
        )}

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Back to the public site
          </Link>
        </p>
      </main>

      {/* ------------------------- Editor modal ------------------------- */}
      {editing !== undefined ? (
        <ProjectEditor
          project={editing}
          categories={categories}
          onClose={() => setEditing(undefined)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      ) : null}

      {/* ------------------------- Toast ------------------------- */}
      {toast ? (
        <div
          role="status"
          className={`glass-strong fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm shadow-2xl shadow-black/50 ${
            toast.tone === "ok" ? "text-mint-400" : "text-amber-300"
          }`}
        >
          {toast.tone === "ok" ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="text-base leading-none">!</span>
          )}
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-xl border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? "border-brand-500/50 bg-brand-500/15 text-brand-200"
          : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
