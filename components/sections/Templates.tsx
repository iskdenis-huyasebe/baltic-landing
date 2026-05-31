"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Eye, RotateCcw } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { TEMPLATES } from "@/components/templates/templates";
import { TemplatePreview } from "@/components/templates/TemplatePreview";

const SWATCHES = ["#bef264", "#3b82f6", "#f97316", "#a78bfa", "#10b981", "#06b6d4", "#ec4899", "#ef4444"];

export function Templates() {
  const t = useTranslations("templates");
  const locale = useLocale();
  const items = t.raw("items") as { name: string; tagline: string }[];
  const [accent, setAccent] = useState<string | null>(null);

  return (
    <section id="templates" className="py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl">{t("subtitle")}</p>

            {/* Try-your-color swatches */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-sm text-[var(--muted)] mr-1">{t("tryColor")}:</span>
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccent(c)}
                  aria-label={c}
                  className={`size-7 rounded-full transition-transform hover:scale-110 ${
                    accent === c ? "ring-2 ring-offset-2 ring-offset-[var(--background)]" : ""
                  }`}
                  style={{ background: c, boxShadow: accent === c ? `0 0 0 2px ${c}` : undefined }}
                />
              ))}
              {accent && (
                <button
                  type="button"
                  onClick={() => setAccent(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors ml-1"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  {t("tryColorReset")}
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {TEMPLATES.map((tpl, i) => {
            const meta = items[i] ?? { name: tpl.id, tagline: "" };
            return (
              <FadeIn key={tpl.id} delay={i * 0.08}>
                <div className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <TemplatePreview template={tpl} accent={accent ?? undefined} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-[var(--foreground)]">{meta.name}</p>
                      <span
                        className="text-xs px-2 py-1 rounded-lg shrink-0 font-medium"
                        style={{ background: `${tpl.accent}1a`, color: tpl.accent }}
                      >
                        €200
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-4 flex-1">{meta.tagline}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <a
                        href={tpl.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors flex-1"
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                        {t("preview")}
                      </a>
                      <a
                        href={`/${locale}/order?plan=setup&design=${tpl.id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity flex-1"
                      >
                        {t("choose")}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--subtle)]">{t("note")}</p>
      </div>
    </section>
  );
}
