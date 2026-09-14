import Image from "next/image";
import type { Project } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { hostnameOf } from "@/lib/site";

const PALETTES: [string, string, string][] = [
  ["#7c3aed", "#06b6d4", "#a78bfa"],
  ["#ec4899", "#8b5cf6", "#f472b6"],
  ["#06b6d4", "#34d399", "#22d3ee"],
  ["#f59e0b", "#ec4899", "#f472b6"],
  ["#8b5cf6", "#ec4899", "#c4b5fd"],
  ["#0ea5e9", "#7c3aed", "#38bdf8"],
];

function hashOf(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function initialsOf(name: string): string {
  const words = (name || "Project").split(/[\s—–-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Renders the project's screenshot when provided, otherwise a generated cover. */
export default function ProjectCover({ project, dictionary }: { project: Project; dictionary?: Dictionary }) {
  if (project.image) {
    return (
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
      </div>
    );
  }

  const [a, b, c] = PALETTES[hashOf(project.slug) % PALETTES.length];

  return (
    <div className="relative aspect-16/10 overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.05]"
        style={{
          background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at 78% 18%, ${c}, transparent 55%)`,
        }}
      />
      <div className="cover-grid absolute inset-0 opacity-40" />

      <span className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-5xl font-bold tracking-tight text-white/85 drop-shadow-lg">
          {initialsOf(project.name)}
        </span>
      </span>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent" />

      {project.liveUrl ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-mint-400 ring-1 ring-white/15 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
          {dictionary?.projects.live ?? "Live"}
        </span>
      ) : null}

      {project.language ? (
        <span className="absolute bottom-3 left-3 chip !bg-ink-950/70 !text-[0.625rem] backdrop-blur">
          {project.language}
        </span>
      ) : null}

      {project.liveUrl ? (
        <span className="absolute bottom-3 right-3 max-w-[60%] truncate font-mono text-[0.625rem] text-white/80">
          {hostnameOf(project.liveUrl)}
        </span>
      ) : null}
    </div>
  );
}
