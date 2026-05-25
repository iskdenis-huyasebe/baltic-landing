"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";

const locales = ["lt", "lv", "et", "en", "ru"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1 text-sm">
        {locales.map((l, i) => (
          <span key={l} className="flex items-center">
            <button
              onClick={() => switchLocale(l)}
              className={`px-1 transition-colors ${
                l === locale
                  ? "text-[var(--foreground)] font-medium"
                  : "text-[var(--subtle)] hover:text-[var(--muted)]"
              }`}
            >
              {l.toUpperCase()}
            </button>
            {i < locales.length - 1 && (
              <span className="text-[var(--subtle)] mx-0.5">·</span>
            )}
          </span>
        ))}
      </div>

      {/* Mobile dropdown */}
      <div className="relative md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Change language"
        >
          <Globe className="size-5" aria-hidden="true" />
          <span className="text-sm font-medium">{locale.toUpperCase()}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl z-50">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-elevated)] ${
                  l === locale ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
