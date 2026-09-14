"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { Close, GitHubIcon, Menu } from "./icons";
import type { Dictionary, Locale } from "@/lib/i18n";

type NavbarProps = {
  name: string;
  github: string;
  locale: Locale;
  dictionary: Dictionary;
};

export default function Navbar({ name, github, locale, dictionary }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section currently owns the viewport centre.
  useEffect(() => {
    const sections = SITE.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const labels = dictionary.sections;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <nav
          className={`flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 transition-all duration-300 sm:px-4 ${
            scrolled ? "glass-strong shadow-2xl shadow-black/40" : "border border-transparent"
          }`}
          aria-label={dictionary.nav.aria}
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 rounded-lg pl-1 pr-2 py-1"
            aria-label={`${name} — ${dictionary.sections.home}`}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-aqua-500 text-[0.8rem] font-bold text-white shadow-lg shadow-brand-600/30">
              {initials || "S"}
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/25" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-white sm:block">
              {name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {SITE.sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {labels[section.id as keyof typeof labels]}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-gradient-to-r from-brand-400 to-aqua-400 transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              {(["uz", "en", "ru"] as const).map((item) => (
                <a
                  key={item}
                  href={`/${item}`}
                  aria-current={item === locale ? "page" : undefined}
                  className={`rounded-md px-2 py-1 text-[0.6875rem] font-bold uppercase ${item === locale ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
                >
                  {item}
                </a>
              ))}
            </div>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hidden !px-4 !py-2 !text-[0.8125rem] sm:inline-flex"
            >
              <GitHubIcon className="h-4 w-4" />
              {dictionary.nav.github}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 md:hidden"
              aria-label={open ? dictionary.nav.close : dictionary.nav.open}
              aria-expanded={open}
            >
              {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`glass-strong absolute inset-x-3 top-20 rounded-2xl p-4 transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1">
            {SITE.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {labels[section.id as keyof typeof labels]}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            <GitHubIcon className="h-4 w-4" />
            {dictionary.nav.viewGithub}
          </a>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["uz", "en", "ru"] as const).map((item) => (
              <a
                key={item}
                href={`/${item}`}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-center text-xs font-semibold uppercase ${item === locale ? "bg-brand-500/25 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
