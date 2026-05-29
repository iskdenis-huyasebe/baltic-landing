"use client";

import { useTranslations } from "next-intl";
import type { OrderState } from "@/app/[locale]/order/page";

const LOCALES = ["lt", "lv", "et", "en", "ru"];

export function StepBasics({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.basics");
  const fields = t.raw("fields") as Record<string, { label: string; placeholder: string }>;

  const inputClass =
    "w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px]";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-5">
        {(["name", "business", "contact"] as const).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              {fields[key].label} <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              type="text"
              value={state[key]}
              onChange={(e) => update({ [key]: e.target.value })}
              placeholder={fields[key].placeholder}
              className={inputClass}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            {fields.siteLocale.label}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => update({ siteLocale: loc })}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  state.siteLocale === loc
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)]"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
