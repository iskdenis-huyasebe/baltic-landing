"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, ArrowRight, RefreshCw } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type Cycle = "month" | "year";

type PlanData = {
  title: string;
  price: string; // monthly price as string, e.g. "15"
  period: string;
  tagline: string;
  bullets: string[];
  badge?: string;
};

function fmt(locale: string, n: number) {
  return locale === "en" ? `€${n}` : `${n} €`;
}

function PlanCard({
  data,
  cycle,
  highlight,
  href,
  t,
  ctaLabel,
}: {
  data: PlanData;
  cycle: Cycle;
  highlight?: boolean;
  href: string;
  t: (k: string, v?: Record<string, string>) => string;
  ctaLabel: string;
}) {
  const locale = useLocale();
  const monthly = parseInt(data.price, 10);
  const yearly = Math.round(monthly * 12 * 0.7); // -30%
  const monthlyEquiv = (yearly / 12).toFixed(1).replace(".0", "");

  return (
    <div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-b from-[var(--surface)] to-[var(--surface)]/60 border-[var(--accent)]/60 hover:border-[var(--accent)] md:scale-[1.04] shadow-[0_0_60px_-15px_rgba(190,242,100,0.18)]"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
      }`}
    >
      {data.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          {data.badge}
        </span>
      )}
      <h3 className="text-xl font-medium text-[var(--foreground)]">{data.title}</h3>
      <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mt-1 mb-5 font-medium">
        {data.tagline}
      </p>

      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-4xl md:text-5xl font-medium text-[var(--foreground)]">
          {cycle === "year" ? fmt(locale, yearly) : fmt(locale, monthly)}
        </span>
        <span className="text-sm text-[var(--muted)]">
          {cycle === "year" ? t("perYear") : data.period}
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-1 h-4">
        {cycle === "year" ? t("monthlyEquiv", { price: fmt(locale, Number(monthlyEquiv)) }) : ""}
      </p>
      <p className="text-xs text-[var(--accent)] mb-6">{t("trial")}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            <Check className="size-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[var(--muted)]">{b}</span>
          </li>
        ))}
      </ul>
      <a
        href={`${href}&cycle=${cycle}`}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px] ${
          highlight
            ? "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
            : "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
        }`}
      >
        {ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

export function Subscriptions() {
  const t = useTranslations("subscriptions");
  const tc = useTranslations("templates");
  const locale = useLocale();
  const care = t.raw("care") as PlanData;
  const growth = t.raw("growth") as PlanData;
  const [cycle, setCycle] = useState<Cycle>("month");
  const choose = tc("choose");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tt = (k: string, v?: Record<string, string>) => t(k as any, v as any);

  return (
    <section id="subscriptions" className="py-16 md:py-24 px-6 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="mb-8 md:mb-10 text-center">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-medium">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
        </FadeIn>

        {/* Month / Year toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
            {(["month", "year"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCycle(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  cycle === c
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {c === "month" ? t("cycleMonth") : t("cycleYear")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 md:items-stretch">
          <PlanCard data={care} cycle={cycle} href={`/${locale}/subscribe?plan=care`} t={tt} ctaLabel={choose} />
          <PlanCard data={growth} cycle={cycle} href={`/${locale}/subscribe?plan=growth`} t={tt} ctaLabel={choose} highlight />
        </div>

        <p className="text-center text-sm text-[var(--foreground)] mt-8 font-medium">{t("noLock")}</p>
        <p className="text-center text-sm text-[var(--subtle)] mt-1 max-w-2xl mx-auto">{t("note")}</p>
      </div>
    </section>
  );
}
