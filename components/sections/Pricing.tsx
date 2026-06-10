"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type PlanData = {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  tagline: string;
  bullets: string[];
  badge?: string;
  cta: string;
};

function PricingCard({
  data,
  highlight,
  onAction,
  bundleToggle,
}: {
  data: PlanData;
  highlight?: boolean;
  onAction: () => void;
  bundleToggle?: React.ReactNode;
}) {
  const locale = useLocale();
  const isCustom = data.price.includes("+");
  const priceFormatted = isCustom
    ? data.price
    : locale === "en"
    ? `€${data.price}`
    : `${data.price} €`;

  return (
    <div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-b from-[var(--surface)] to-[var(--surface)]/60 border-[var(--accent)]/60 hover:border-[var(--accent)] md:scale-[1.04] md:-my-2 shadow-[0_0_60px_-15px_rgba(190,242,100,0.18)]"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
      }`}
    >
      {data.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          {data.badge}
        </span>
      )}

      <div className="mb-3">
        <h3 className="text-xl font-medium text-[var(--foreground)]">{data.title}</h3>
        <p className="text-sm text-[var(--muted)] mt-1">{data.subtitle}</p>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mb-5 font-medium">
        {data.tagline}
      </p>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-medium text-[var(--foreground)]">
            {priceFormatted}
          </span>
          <span className="text-sm text-[var(--muted)]">{data.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            <Check
              className="size-4 text-[var(--accent)] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="text-[var(--muted)]">{b}</span>
          </li>
        ))}
      </ul>

      {bundleToggle}

      <button
        onClick={onAction}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px] ${
          highlight
            ? "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
            : isCustom
            ? "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
            : "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
        }`}
      >
        {data.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [bundle, setBundle] = useState(false);

  const setup = t.raw("setup") as PlanData;
  const pro = t.raw("pro") as PlanData;
  const custom = t.raw("custom") as PlanData;

  const goOrder = (plan: string) => {
    if (plan === "custom") {
      window.location.href = "#contact";
      return;
    }
    // All order buttons lead to plan selection (step 0)
    window.location.href = `/${locale}/order`;
  };

  return (
    <section id="pricing" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 md:items-stretch">
          <PricingCard
            data={setup}
            onAction={() => goOrder("setup")}
            bundleToggle={
              <label className="flex items-start gap-2.5 mb-5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={bundle}
                  onChange={(e) => setBundle(e.target.checked)}
                  className="mt-0.5 size-4 accent-[#bef264]"
                />
                <span className="text-xs text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors leading-relaxed">
                  {t("bundleToggleLabel")}
                </span>
              </label>
            }
          />
          <PricingCard
            data={pro}
            highlight
            onAction={() => goOrder("pro")}
          />
          <PricingCard
            data={custom}
            onAction={() => goOrder("custom")}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-muted)] px-4 py-2 text-sm text-[var(--foreground)]">
            <ShieldCheck className="size-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
            <span>{t("guarantee")}</span>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--subtle)] mt-5 max-w-2xl mx-auto italic">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
