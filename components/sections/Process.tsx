import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";
import { MessageSquare, Palette, Rocket } from "lucide-react";

// 3 steps now
const stepIcons = [MessageSquare, Palette, Rocket];

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { day: string; title: string; body: string }[];

  return (
    <section id="process" className="py-16 md:py-24 px-6 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
          </div>
        </FadeIn>

        {/* Timeline — 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative md:items-start">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          {steps.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <div key={i} className="relative flex flex-col">
                {/* Connector line mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-7 top-14 bottom-0 w-px bg-[var(--border)]" />
                )}

                <div className="flex md:flex-col md:items-center gap-4">
                  {/* Icon circle */}
                  <div className="relative z-10 size-14 shrink-0 rounded-2xl bg-[var(--accent-muted)] border border-[var(--accent)]/20 flex items-center justify-center md:mb-5">
                    <Icon className="size-6 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <div className="md:text-center pb-6 md:pb-0">
                    <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-1.5 font-medium">
                      {step.day}
                    </p>
                    <p className="text-base font-medium text-[var(--foreground)] mb-2">
                      {step.title}
                    </p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-10 p-4 bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-xl inline-flex items-center gap-2">
            <span className="text-[var(--accent)] text-lg">★</span>
            <p className="text-sm text-[var(--muted)]">{t("guarantee")}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
