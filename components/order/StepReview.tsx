"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prices: Record<string, number> = { setup: 200, pro: 500 };
  const total = prices[state.plan] || 200;
  const fmtPrice = (p: number) => `${p} €`;

  const subOptions = [
    { id: "care" as const, label: t("subCare") },
    { id: "growth" as const, label: t("subGrowth") },
    { id: "later" as const, label: t("subLater") },
  ];

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(state));

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
          <div className="grid grid-cols-3 gap-2">
            {subOptions.map((o) => {
              const active = state.subPlan === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => update({ subPlan: o.id })}
                  className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg">
          <span className="font-medium">{t("total")}</span>
          <span className="font-medium text-[var(--accent)]">{fmtPrice(total)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          {t("promoLabel")}
        </label>
        <input
          type="text"
          value={state.promo}
          onChange={(e) => update({ promo: e.target.value.trim() })}
          placeholder={t("promoPlaceholder")}
          autoCapitalize="characters"
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[48px]"
        />
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
