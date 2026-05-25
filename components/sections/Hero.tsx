import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-8 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-6 font-medium">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-medium leading-tight text-[var(--foreground)] mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] min-h-[52px] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:bg-[var(--surface)] hover:border-[var(--foreground)]/30 min-h-[52px]"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 md:mt-28 flex items-center gap-3 text-[var(--subtle)] text-sm">
          <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
}
