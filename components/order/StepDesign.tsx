"use client";

import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";
import { TEMPLATES } from "@/components/templates/templates";
import { TemplatePreview } from "@/components/templates/TemplatePreview";

export function StepDesign({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.design");
  const tt = useTranslations("templates");
  const items = tt.raw("items") as { name: string; tagline: string }[];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {TEMPLATES.map((tpl, i) => {
          const meta = items[i] ?? { name: tpl.id, tagline: "" };
          const selected = state.designId === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => update({ designId: tpl.id })}
              className={`text-left bg-[var(--surface)] border rounded-xl overflow-hidden transition-all ${
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <TemplatePreview template={tpl} selected={selected} />
              <div className="p-3">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-medium text-[var(--foreground)]">{meta.name}</span>
                  <a
                    href={tpl.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--subtle)] hover:text-[var(--accent)] transition-colors"
                  >
                    <Eye className="size-3" aria-hidden="true" />
                    {tt("preview")}
                  </a>
                </div>
                <p className="text-xs text-[var(--muted)]">{meta.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("noteLabel")}</label>
        <textarea
          value={state.designNote}
          onChange={(e) => update({ designNote: e.target.value })}
          placeholder={t("notePlaceholder")}
          rows={3}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
        />
      </div>
    </div>
  );
}
