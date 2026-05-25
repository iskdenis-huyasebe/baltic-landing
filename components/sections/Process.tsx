import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";
import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";

const stepIcons = [MessageSquare, Palette, Code2, Rocket];

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { day: string; title: string; body: string }[];

  return (
    <section id="process" className="py-20 md:py-32 px-6 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-6 md:gap-4 relative">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-[var(--border)]" />

          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="relative flex flex-col">
                {/* Connector line mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-5 top-10 bottom-0 w-px bg-[var(--border)]" />
                )}

                <div className="flex md:flex-col md:items-center gap-4 md:gap-4">
                  <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center md:mb-4">
                    <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <div className="md:text-center pb-6 md:pb-0">
                    <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-1 font-medium">
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

        <div className="mt-10 p-4 bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-xl inline-flex items-center gap-2">
          <span className="text-[var(--accent)] text-lg">★</span>
          <p className="text-sm text-[var(--muted)]">{t("guarantee")}</p>
        </div>
      </div>
    </section>
  );
}
