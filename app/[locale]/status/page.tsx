"use client";

import { useState, useTransition, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export const metadata = { robots: "noindex,nofollow" };

export default function StatusLoginPage() {
  const t = useTranslations("status.login");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-submit if ?c= param present
  useEffect(() => {
    const c = params.get("c")?.toUpperCase().trim();
    if (c && /^UW-[A-Z0-9]{6}$/.test(c)) {
      setValue(c);
      // Trigger submit programmatically
      performLookup(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function performLookup(ref: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientRef: ref }),
      });
      if (res.status === 429) { setError(t("rateLimited")); return; }
      if (res.status === 404) { setError(t("notFound")); return; }
      if (!res.ok) { setError(t("error")); return; }
      startTransition(() => { router.push(`/${locale}/status/dashboard`); });
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  // Normalise input: uppercase, auto-insert dash
  function handleChange(raw: string) {
    let v = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    // Auto-prefix UW- if user starts typing letters/numbers
    if (v.length > 0 && !v.startsWith("UW-")) {
      if (v.startsWith("UW") && v.length >= 2) v = "UW-" + v.slice(2);
      else if (!v.startsWith("U")) v = "UW-" + v;
    }
    if (v.length > 9) v = v.slice(0, 9); // "UW-XXXXXX" = 9 chars
    setValue(v);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = value.trim();
    if (!/^UW-[A-Z0-9]{6}$/.test(ref)) {
      setError(t("notFound"));
      return;
    }
    await performLookup(ref);
  }

  const SUPPORT_LINK =
    process.env.NEXT_PUBLIC_TELEGRAM_LINK || "https://t.me/unoweb_support";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--background)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <a href={`/${locale}`} className="inline-block">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Unoweb">
              <rect width="36" height="36" rx="10" fill="var(--accent)" />
              <text
                x="18"
                y="25"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontWeight="700"
                fontSize="16"
                fill="var(--accent-foreground)"
              >
                UW
              </text>
            </svg>
          </a>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-3 font-medium">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
            {t("title")}
          </h1>
          <p className="text-[var(--muted)] text-sm mb-8">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="client-ref"
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              {t("label")}
            </label>

            <div className="relative">
              <input
                id="client-ref"
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={t("placeholder")}
                className={`w-full px-4 py-3 rounded-xl border text-base font-mono tracking-wider
                  bg-[var(--surface-elevated)] text-[var(--foreground)] placeholder-[var(--subtle)]
                  outline-none transition-colors
                  ${
                    error
                      ? "border-red-500 focus:border-red-500"
                      : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
              />
            </div>

            {/* Hint */}
            {!error && (
              <p className="mt-2 text-xs text-[var(--subtle)]">{t("hint")}</p>
            )}

            {/* Error */}
            {error && (
              <div className="mt-2 text-sm text-red-400 flex items-start gap-1.5">
                <span className="mt-0.5">⚠</span>
                <span>
                  {error}{" "}
                  {error === t("notFound") && (
                    <a
                      href={SUPPORT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--accent)] hover:opacity-80"
                    >
                      {t("writeUs")}
                    </a>
                  )}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isPending || value.length < 9}
              className="mt-6 w-full flex items-center justify-center gap-2
                px-5 py-3 rounded-xl font-medium text-sm transition-all
                bg-[var(--accent)] text-[var(--accent-foreground)]
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:opacity-90 active:scale-[0.98]"
            >
              {loading || isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {t("submit")}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
