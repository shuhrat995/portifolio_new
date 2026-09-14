"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Shield, Spinner } from "@/components/icons";

export default function LoginForm({ usingDefault }: { usingDefault: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }

      router.replace("/qw/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.28), transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm animate-pop">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/50">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-aqua-500 shadow-lg shadow-brand-600/30">
            <Lock className="h-5 w-5 text-white" />
          </span>

          <h1 className="mt-5 text-xl font-bold tracking-tight text-white">
            Admin access
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Enter your password to manage projects and profile content.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={reveal ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="field !py-3 !pr-11"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "admin-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  aria-label={reveal ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {reveal ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p
                id="admin-error"
                role="alert"
                className="rounded-xl border border-rose-500/35 bg-rose-500/12 px-3.5 py-2.5 text-sm text-rose-200"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn btn-primary w-full !py-3"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Unlock dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {usingDefault ? (
          <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
            <strong className="font-semibold">Security notice:</strong> you are still
            using the built-in default password. Add{" "}
            <code className="font-mono">ADMIN_PASSWORD</code> to{" "}
            <code className="font-mono">.env.local</code> to change it.
          </p>
        ) : null}

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 transition-colors hover:text-slate-300"
          >
            ← Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
