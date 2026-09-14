"use client";

import { useEffect, useState } from "react";

export default function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (roles.length < 2) return;

    const timer = window.setInterval(() => {
      setShown(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % roles.length);
        setShown(true);
      }, 300);
    }, 2700);

    return () => window.clearInterval(timer);
  }, [roles.length]);

  // NOTE: `gradient-text` must sit on the element that directly holds the text.
  // `background-clip: text` cannot clip to a descendant that has its own
  // stacking context (transform / opacity), so an animated wrapper around the
  // gradient span would render nothing at all.
  return (
    <span
      className={`gradient-text inline-block transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      {roles[index]}
    </span>
  );
}
