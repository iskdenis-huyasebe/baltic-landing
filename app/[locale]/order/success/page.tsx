"use client";

import { useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";

function SuccessInner() {
  const t = useTranslations("order.success");
  const locale = useLocale();

  useEffect(() => {
    try { localStorage.removeItem("unoweb-order-v2"); } catch {}
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-8">
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="size-16 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center mx-auto mb-8">
          <Check className="size-8 text-[var(--accent)]" />
        </div>
        <h1 className="text-3xl md:text-5xl tracking-tight font-medium mb-4">{t("title")}</h1>
        <p className="text-lg text-[var(--muted)] mb-10">{t("subtitle")}</p>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 text-left space-y-6 mb-10">
          {(["1", "2", "3"] as const).map((n) => (
            <div key={n} className="flex gap-4">
              <div className="size-8 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-medium text-[var(--accent)]">{n}</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-1">
                  {t(`step${n}Label` as any)}
                </p>
                <p className="text-[var(--foreground)] text-sm leading-relaxed">
                  {t(`step${n}` as any)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] rounded-xl px-6 py-3 text-base font-medium hover:bg-[var(--surface)] transition-colors"
        >
          {t("backHome")}
        </a>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
