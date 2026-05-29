"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, ShieldCheck } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

export function StepReview({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.review");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prices: Record<string, number> = { setup: 200, pro: 500 };
  const basePrice = prices[state.plan] || 200;
  const bundlePrice = state.bundle ? 60 : 0;
  const total = basePrice + bundlePrice;
  const fmtPrice = (p: number) => locale === "en" ? `€${p}` : `${p} €`;

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
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

        <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-[var(--border)]">
          <input
            type="checkbox"
            checked={state.bundle}
            onChange={(e) => update({ bundle: e.target.checked })}
            className="mt-1 size-4 accent-[#bef264]"
          />
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">{t("bundle")}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{t("bundleNote")}</div>
          </div>
        </label>

        <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg">
          <span className="font-medium">{t("total")}</span>
          <span className="font-medium text-[var(--accent)]">{fmtPrice(total)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-4 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 min-h-[52px]"
      >
        <Check className="size-5" />
        {loading ? t("redirecting") : t("payButton")}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[var(--subtle)]">
        <ShieldCheck className="size-3.5" />
        {t("secure")}
      </div>
    </div>
  );
}
