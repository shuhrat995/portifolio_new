"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Project, SaveMode } from "@/lib/types";
import { Close, Spinner, Trash } from "@/components/icons";

type Props = {
  project: Project | null;
  categories: string[];
  onClose: () => void;
  onSaved: (project: Project, mode: SaveMode) => void;
  onDeleted: (slug: string) => void;
};

type FormState = {
  name: string;
  category: string;
  language: string;
  description: string;
  longDescription: string;
  tech: string;
  repoUrl: string;
  liveUrl: string;
  image: string;
  stars: string;
  featured: boolean;
  visible: boolean;
};

function toForm(project: Project | null): FormState {
  return {
    name: project?.name ?? "",
    category: project?.category ?? "",
    language: project?.language ?? "",
    description: project?.description ?? "",
    longDescription: project?.longDescription ?? "",
    tech: (project?.tech ?? []).join(", "),
    repoUrl: project?.repoUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    image: project?.image ?? "",
    stars: String(project?.stars ?? 0),
    featured: project?.featured ?? false,
    visible: project?.visible ?? true,
  };
}

export default function ProjectEditor({
  project,
  categories,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  const [form, setForm] = useState<FormState>(() => toForm(project));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isNew = !project;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    if (!form.name.trim()) {
      setError("Loyiha nomi kiritilishi shart.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      category: form.category || "Project",
      language: form.language,
      description: form.description,
      longDescription: form.longDescription,
      tech: form.tech,
      repoUrl: form.repoUrl,
      liveUrl: form.liveUrl,
      image: form.image,
      stars: Number(form.stars) || 0,
      featured: form.featured,
      visible: form.visible,
    };

    try {
      const res = await fetch(
        isNew ? "/api/projects" : `/api/projects/${encodeURIComponent(project!.slug)}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json().catch(() => ({}))) as {
        project?: Project;
        mode?: SaveMode;
        error?: string;
      };

      if (!res.ok || !data.project) {
        setError(data.error || "Loyihani saqlab bo'lmadi.");
        setSaving(false);
        return;
      }

      onSaved(data.project, data.mode ?? "filesystem");
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!project || deleting) return;
    if (!window.confirm(`“${project.name}” loyihasi o'chirilsinmi? Buni bekor qilib bo'lmaydi.`)) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Loyihani o'chirib bo'lmadi.");
        setDeleting(false);
        return;
      }

      onDeleted(project.slug);
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink-950/85 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Yangi loyiha" : `${project!.name} loyihasini tahrirlash`}
    >
      <div className="mx-auto my-2 w-full max-w-2xl animate-pop">
        <form
          onSubmit={onSubmit}
          className="glass-strong overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
        >
          <header className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                {isNew ? "Yangi loyiha" : "Loyihani tahrirlash"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {isNew
                  ? "Ma'lumotlarni to'ldiring — faqat nom kiritilishi shart."
                  : project!.slug}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Close className="h-4 w-4" />
            </button>
          </header>

          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="p-name" className="label">
                  Nomi *
                </label>
                <input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="TaskFlow — Kanban & Crypto"
                  className="field"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="p-category" className="label">
                  Kategoriya
                </label>
                <input
                  id="p-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  list="project-categories"
                  placeholder="Frontend"
                  className="field"
                />
                <datalist id="project-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="p-language" className="label">
                  Asosiy dasturlash tili
                </label>
                <input
                  id="p-language"
                  value={form.language}
                  onChange={(e) => set("language", e.target.value)}
                  placeholder="TypeScript"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="p-description" className="label">
                Karta tavsifi
              </label>
              <textarea
                id="p-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="A short, punchy summary shown on the project card."
                className="field resize-y"
              />
            </div>

            <div>
              <label htmlFor="p-long" className="label">
                To&apos;liqroq tavsif
              </label>
              <textarea
                id="p-long"
                value={form.longDescription}
                onChange={(e) => set("longDescription", e.target.value)}
                rows={4}
                placeholder="Optional detail for future project pages."
                className="field resize-y"
              />
            </div>

            <div>
              <label htmlFor="p-tech" className="label">
                Texnologiyalar — vergul bilan ajrating
              </label>
              <input
                id="p-tech"
                value={form.tech}
                onChange={(e) => set("tech", e.target.value)}
                placeholder="Next.js, TypeScript, Tailwind CSS"
                className="field"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="p-repo" className="label">
                  GitHub manzili
                </label>
                <input
                  id="p-repo"
                  type="url"
                  value={form.repoUrl}
                  onChange={(e) => set("repoUrl", e.target.value)}
                  placeholder="https://github.com/…"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="p-live" className="label">
                  Jonli demo manzili
                </label>
                <input
                  id="p-live"
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => set("liveUrl", e.target.value)}
                  placeholder="https://my-app.vercel.app"
                  className="field"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              <div>
                <label htmlFor="p-image" className="label">
                  Skrinshot manzili (ixtiyoriy)
                </label>
                <input
                  id="p-image"
                  type="url"
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="Leave empty for a generated cover"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="p-stars" className="label">
                  Yulduzlar
                </label>
                <input
                  id="p-stars"
                  type="number"
                  min={0}
                  value={form.stars}
                  onChange={(e) => set("stars", e.target.value)}
                  className="field"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="glass flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 accent-brand-500"
                />
                Bosh sahifada ajratib ko&apos;rsatish
              </label>

              <label className="glass flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => set("visible", e.target.checked)}
                  className="h-4 w-4 accent-brand-500"
                />
                Tashrif buyuruvchilarga ko&apos;rinsin
              </label>
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-rose-500/35 bg-rose-500/12 px-3.5 py-2.5 text-sm text-rose-200"
              >
                {error}
              </p>
            ) : null}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-5 py-4">
            {!isNew ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting || saving}
                className="btn !px-4 !py-2 !text-[0.8125rem] border border-rose-500/35 text-rose-300 transition-colors hover:bg-rose-500/12"
              >
                {deleting ? (
                  <Spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                O&apos;chirish
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost !px-4 !py-2 !text-[0.8125rem]"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary !px-5 !py-2 !text-[0.8125rem]"
              >
                {saving ? <Spinner className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saqlanmoqda…" : isNew ? "Loyiha yaratish" : "O'zgarishlarni saqlash"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
