"use client";

import { useTranslations } from "next-intl";
import type { OrderState } from "@/app/[locale]/order/page";

export function StepContent({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.content");
  const fields = t.raw("fields") as Record<string, { label: string; placeholder: string }>;

  const inputClass =
    "w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px]";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.headline.label} <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            type="text"
            value={state.headline}
            onChange={(e) => update({ headline: e.target.value })}
            placeholder={fields.headline.placeholder}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.bullets.label} <span className="text-[var(--accent)]">*</span>
          </label>
          <textarea
            value={state.bullets}
            onChange={(e) => update({ bullets: e.target.value })}
            placeholder={fields.bullets.placeholder}
            rows={5}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.leadEmail.label}
          </label>
          <input
            type="email"
            value={state.leadEmail}
            onChange={(e) => update({ leadEmail: e.target.value })}
            placeholder={fields.leadEmail.placeholder}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
