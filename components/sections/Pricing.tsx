"use client";

import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

type Plan = "setup" | "setup+care" | "setup+growth";

function PricingCard({
  title,
  subtitle,
  price,
  period,
  bullets,
  cta,
  badge,
  accent,
  plan,
  onCheckout,
  loading,
}: {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  bullets: string[];
  cta: string;
  badge?: string;
  accent?: boolean;
  plan: Plan;
  onCheckout: (plan: Plan) => void;
  loading: Plan | null;
}) {
  const isLoading = loading === plan;

  return (
    <div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl border transition-all duration-200 hover:bg-[var(--surface-elevated)] ${
        accent
          ? "bg-[var(--surface)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}
      <div className="mb-6">
        <p className="text-lg font-medium text-[var(--foreground)] mb-1">{title}</p>
        <p className="text-sm text-[var(--muted)]">{subtitle}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-medium text-[var(--foreground)]">{price} €</span>
          <span className="text-[var(--muted)] text-sm">{period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            <Check className="size-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[var(--muted)]">{b}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onCheckout(plan)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 ${
          accent
            ? "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
            : "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
        }`}
      >
        {isLoading ? "..." : cta}
      </button>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [loading, setLoading] = useState<Plan | null>(null);

  const setup = t.raw("setup") as { title: string; subtitle: string; price: string; period: string; bullets: string[]; cta: string };
  const growth = t.raw("growth") as { badge: string; title: string; subtitle: string; price: string; period: string; bullets: string[]; cta: string };
  const care = t.raw("care") as { title: string; subtitle: string; price: string; period: string; bullets: string[]; cta: string };

  const handleCheckout = async (plan: Plan) => {
    // If Stripe keys not configured — fall back to contact form
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      window.location.href = "#contact";
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = "#contact";
      }
    } catch {
      window.location.href = "#contact";
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          <PricingCard {...setup} plan="setup" onCheckout={handleCheckout} loading={loading} />
          <PricingCard {...growth} badge={growth.badge} accent plan="setup+growth" onCheckout={handleCheckout} loading={loading} />
          <PricingCard {...care} plan="setup+care" onCheckout={handleCheckout} loading={loading} />
        </div>

        <p className="text-center text-sm text-[var(--subtle)] mt-6">{t("note")}</p>
      </div>
    </section>
  );
}
