"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import type { OrderState, OrderFiles } from "@/app/[locale]/order/page";

export function StepReview({
  state,
  update,
  files,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
  files: OrderFiles;
}) {
  const t = useTranslations("order.review");
  const ts = useTranslations("subscriptions");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isTestMode =
    process.env.NODE_ENV !== "production" ||
    searchParams.get("test") === "1" ||
    (typeof window !== "undefined" && sessionStorage.getItem("test_mode") === "1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prices: Record<string, number> = { setup: 200, pro: 500 };
  const total = prices[state.plan] || 200;
  const fmtPrice = (p: number) => (locale === "en" ? `€${p}` : `${p} €`);

  const hasSub = state.subPlan === "care" || state.subPlan === "growth";
  const subMonthly: Record<string, number> = { care: 15, growth: 30 };
  const recurAmount = hasSub
    ? state.subCycle === "year"
      ? Math.round(subMonthly[state.subPlan] * 12 * 0.7)
      : subMonthly[state.subPlan]
    : 0;
  const recurPer = state.subCycle === "year" ? t("perYear") : t("perMonth");

  const handlePay = async (promoOverride?: string) => {
    setLoading(true);
    setError("");
    try {
      const payload = promoOverride ? { ...state, promo: promoOverride } : state;
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (files.logo && files.logo.name !== "__skip__") {
        formData.append("logo", files.logo);
      }
      files.photos.forEach((p, i) => {
        if (p.name !== "__skip__") formData.append(`photo_${i}`, p);
      });
      if (files.texts && files.texts.name !== "__skip__") {
        formData.append("texts", files.texts);
      }

      const res = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(t("error"));
        setLoading(false);
      }
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  };

  const hasFiles =
    (files.logo && files.logo.name !== "__skip__") ||
    files.photos.some((p) => p.name !== "__skip__") ||
    (files.texts && files.texts.name !== "__skip__");

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t("plan")}</span>
          <span className="font-medium">{state.plan === "setup" ? "Setup" : "Setup Pro"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t("design")}</span>
          <span className="font-medium capitalize">{state.designId || "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t("language")}</span>
          <span className="font-medium uppercase">{state.siteLocale}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t("contact")}</span>
          <span className="font-medium">{state.contact}</span>
        </div>
        {hasFiles && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">{t("files")}</span>
            <span className="font-medium text-[var(--accent)]">✓</span>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border)]">
          <div className="text-sm font-medium mb-1">{t("subTitle")}</div>
          <div className="text-xs text-[var(--muted)] mb-3">{t("subNote")}</div>

          {/* Billing cycle */}
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--background)]">
              {(["month", "year"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ subCycle: c })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    state.subCycle === c
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {c === "month" ? t("subCycleMonth") : t("subCycleYear")}
                </button>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {(["care", "growth"] as const).map((p) => {
              const plan = ts.raw(p) as { title: string; bullets: string[] };
              const m = p === "care" ? 15 : 30;
              const amount = state.subCycle === "year" ? Math.round(m * 12 * 0.7) : m;
              const per = state.subCycle === "year" ? t("perYear") : t("perMonth");
              const active = state.subPlan === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => update({ subPlan: p })}
                  className={`text-left rounded-xl border p-3.5 transition-all ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{plan.title}</span>
                    {active && <Check className="size-4 text-[var(--accent)]" />}
                  </div>
                  <div className="mb-2">
                    <span className="text-xl font-medium text-[var(--foreground)]">{fmtPrice(amount)}</span>
                    <span className="text-xs text-[var(--muted)]">{per}</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.bullets.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex gap-1.5 items-start text-[11px] text-[var(--muted)]">
                        <Check className="size-3 text-[var(--accent)] shrink-0 mt-[3px]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Own hosting (no subscription) */}
          <button
            type="button"
            onClick={() => update({ subPlan: "none" })}
            className={`w-full text-left rounded-xl border p-3.5 mt-2.5 transition-all ${
              state.subPlan === "none"
                ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                : "border-[var(--border)] hover:border-[var(--border-strong)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{t("subNone")}</span>
              {state.subPlan === "none" && <Check className="size-4 text-[var(--accent)]" />}
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">{t("subNoneDesc")}</p>
          </button>

          <p className="text-xs text-[var(--subtle)] mt-3">{t("subNoLock")}</p>
        </div>

        <div className="pt-4 border-t border-[var(--border)] space-y-2.5">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="font-medium text-lg">{t("total")}</span>
              <span className="block text-xs text-[var(--subtle)]">{t("todayHint")}</span>
            </div>
            <span className="font-medium text-lg text-[var(--accent)]">{fmtPrice(total)}</span>
          </div>

          {hasSub && (
            <div className="flex justify-between items-baseline pt-2.5 border-t border-[var(--border)]">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  {t("subFrom")} · {state.subPlan === "care" ? "Care" : "Growth"}
                </span>
                <span className="block text-xs text-[var(--accent)]">{t("free1")}</span>
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {fmtPrice(recurAmount)}
                <span className="text-[var(--muted)]">{recurPer}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <button
        onClick={() => handlePay()}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-4 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 min-h-[52px]"
      >
        <Check className="size-5" />
        {loading ? t("redirecting") : t("payButton")}
      </button>

      {isTestMode && (
        <button
          type="button"
          onClick={() => handlePay("UNOWEB-TEST")}
          disabled={loading}
          className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-dashed border-[var(--border-strong)] text-[var(--muted)] rounded-xl px-6 py-3 text-sm transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
        >
          🧪 Тест — без оплаты
        </button>
      )}

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[var(--subtle)]">
        <ShieldCheck className="size-3.5" />
        {t("secure")}
      </div>
    </div>
  );
}
