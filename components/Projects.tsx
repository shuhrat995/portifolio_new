"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import ProjectCover from "./ProjectCover";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { ArrowUpRight, Close, GitHubIcon, Search, Sparkle, Star } from "./icons";

const PAGE_SIZE = 9;

export default function Projects({ projects, dictionary }: { projects: Project[]; dictionary: Dictionary }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(dictionary.projects.all);
  const [expanded, setExpanded] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      const key = project.category || dictionary.projects.all;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [
      { name: dictionary.projects.all, count: projects.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ];
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      if (category !== dictionary.projects.all && (project.category || dictionary.projects.all) !== category) {
        return false;
      }
      if (!needle) return true;

      const haystack = [
        project.name,
        project.description,
        project.language,
        project.category,
        ...(project.tech ?? []),
        ...(project.topics ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [projects, category, query]);

  const visible = expanded ? filtered : filtered.slice(0, PAGE_SIZE);
  const liveCount = projects.filter((p) => p.liveUrl).length;

  return (
    <section id="projects" className="relative py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={`${dictionary.projects.eyebrow} · ${projects.length}`}
          title={dictionary.projects.title}
          description={`${dictionary.projects.description} ${liveCount}.`}
        />

        {/* ------------------------- Controls ------------------------- */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setExpanded(false);
                  }}
                  placeholder={dictionary.projects.search}
                  aria-label={dictionary.projects.search}
                  className="field !rounded-xl !py-3 !pl-11 !pr-10"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={dictionary.projects.clear}
                    className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Close className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <p className="shrink-0 font-mono text-xs text-slate-500 sm:pl-2">
                {filtered.length} {filtered.length === 1 ? dictionary.projects.result : dictionary.projects.results}
              </p>
            </div>

            <div className="-mx-1 flex flex-wrap gap-2 px-1">
              {categories.map((item) => {
                const isActive = category === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setCategory(item.name);
                      setExpanded(false);
                    }}
                    aria-pressed={isActive}
                    className={`chip transition-all duration-200 ${
                      isActive
                        ? "!border-brand-500/60 !bg-brand-500/20 !text-brand-200"
                        : "hover:!border-white/25 hover:!text-slate-100"
                    }`}
                  >
                    {item.name}
                    <span className="font-mono opacity-60">{item.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ------------------------- Grid ------------------------- */}
        {visible.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 80}>
                <ProjectCard project={project} dictionary={dictionary} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="glass mt-10 rounded-2xl px-6 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-4 text-lg font-medium text-white">{dictionary.projects.noProjects}</p>
              <p className="mt-1 text-sm text-slate-400">
                {dictionary.projects.tryAgain}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(dictionary.projects.all);
                }}
                className="btn btn-ghost mt-6"
              >
                {dictionary.projects.reset}
              </button>
            </div>
          </Reveal>
        )}

        {!expanded && filtered.length > PAGE_SIZE ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn btn-ghost"
            >
              {dictionary.projects.showAll} {filtered.length}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({ project, dictionary }: { project: Project; dictionary: Dictionary }) {
  return (
    <article className="glass card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
      <ProjectCover project={project} dictionary={dictionary} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-white">
            {project.name}
          </h3>
          {project.featured ? (
            <span className="chip chip-brand shrink-0 !py-0.5 !text-[0.625rem]">
              <Sparkle className="h-3 w-3" />
              {dictionary.projects.featured}
            </span>
          ) : null}
        </div>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-400">
          {project.description || dictionary.projects.noDescription}
        </p>

        {project.tech?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <li key={tech} className="chip !px-2.5 !py-0.5 !text-[0.625rem]">
                {tech}
              </li>
            ))}
            {project.tech.length > 4 ? (
              <li className="chip !px-2.5 !py-0.5 !text-[0.625rem] opacity-70">
                +{project.tech.length - 4}
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {project.stars > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {project.stars}
              </span>
            ) : null}
            {project.category ? (
              <span className="font-mono text-[0.6875rem] uppercase tracking-wider">
                {project.category}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} ${dictionary.projects.source}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-white/25 hover:text-white"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} ${dictionary.projects.demo}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-aqua-500 px-3 text-xs font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-brand-600/40"
              >
                {dictionary.projects.live}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
