import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";
import { Check, X } from "lucide-react";

export function WhatsIncluded() {
  const t = useTranslations("included");
  const yes = t.raw("yes") as { title: string; body: string }[];
  const no = t.raw("no") as string[];

  return (
    <section id="included" className="pt-20 md:pt-32 pb-12 md:pb-20 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
          </div>
        </FadeIn>

        {/* What's included */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {yes.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="flex gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] transition-all duration-200 h-full">
                <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[var(--accent-muted)] flex items-center justify-center">
                  <Check className="size-3 text-[var(--accent)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)] mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{item.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* What's NOT included */}
        <FadeIn>
          <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-4 font-medium">
              {t("noTitle")}
            </p>
            <div className="space-y-2.5">
              {no.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <X className="size-4 text-[var(--subtle)] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--subtle)]">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--subtle)] mt-4 pt-4 border-t border-[var(--border)]">
              {t("noNote")}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
