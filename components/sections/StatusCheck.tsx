"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export function StatusCheck() {
  const t = useTranslations("statusCheck");
  const locale = useLocale();
  const [value, setValue] = useState("");

  function handleChange(raw: string) {
    let v = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (v.length > 0 && !v.startsWith("UW-")) {
      if (v.startsWith("UW") && v.length >= 2) v = "UW-" + v.slice(2);
      else if (!v.startsWith("U")) v = "UW-" + v;
    }
    if (v.length > 9) v = v.slice(0, 9);
    setValue(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = value.trim();
    if (/^UW-[A-Z0-9]{6}$/.test(ref)) {
      window.location.href = `/${locale}/status?c=${ref}`;
    } else {
      window.location.href = `/${locale}/status`;
    }
  }

  return (
    <section className="py-12 md:py-16 px-6 md:px-8 border-t border-[var(--border)]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium mb-3">
          {t("eyebrow")}
        </p>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[var(--foreground)] mb-2">
          {t("title")}
        </h2>
        <p className="text-[var(--muted)] text-sm mb-6">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("placeholder")}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder-[var(--subtle)] font-mono tracking-wider text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            {t("button")} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}
