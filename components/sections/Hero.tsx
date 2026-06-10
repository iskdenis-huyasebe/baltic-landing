import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { TEMPLATES } from "@/components/templates/templates";
import { TemplatePreview } from "@/components/templates/TemplatePreview";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  // showcase two contrasting templates (light + dark) so the hero feels finished
  const front = TEMPLATES.find((x) => x.id === "aurora")!;
  const back = TEMPLATES.find((x) => x.id === "pulse")!;

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-8 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left: text */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-6 font-medium">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-medium leading-[1.1] text-[var(--foreground)] mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed mb-10 max-w-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href={`/${locale}/order`}
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] min-h-[52px] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:bg-[var(--surface)] hover:border-[var(--foreground)]/30 min-h-[52px]"
            >
              {t("ctaSecondary")}
            </a>
          </div>
          {/* Guarantee */}
          <div className="inline-flex items-center gap-2 text-sm text-[var(--muted)] mb-6 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-3.5 py-1.5">
            <ShieldCheck className="size-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
            <span>{t("guarantee")}</span>
          </div>
          {/* Trust note */}
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <div className="flex -space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-7 rounded-full border-2 border-[var(--background)]"
                  style={{ background: i === 1 ? "var(--surface-elevated)" : "var(--surface)" }}
                />
              ))}
            </div>
            <span>{t("trustNote")}</span>
          </div>
        </div>

        {/* Right: showcase of real templates (tilted stack) */}
        <div className="relative hidden md:block h-[420px]" aria-hidden="true">
          <div
            className="absolute inset-6 -z-10 blur-3xl opacity-20 rounded-full"
            style={{ background: "var(--accent)" }}
          />

          {/* back card */}
          <div className="absolute top-0 right-0 w-[72%] rotate-6 rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl">
            <TemplatePreview template={back} />
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ background: back.theme.surface }}
            >
              <span className="text-xs font-medium" style={{ color: back.theme.fg }}>
                {back.id.charAt(0).toUpperCase() + back.id.slice(1)}
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                style={{ background: `${back.accent}26`, color: back.accent }}
              >
                €200
              </span>
            </div>
          </div>

          {/* front card */}
          <div className="absolute bottom-0 left-0 w-[78%] -rotate-3 rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl">
            <TemplatePreview template={front} />
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ background: front.theme.surface }}
            >
              <span className="text-xs font-medium" style={{ color: front.theme.fg }}>
                {front.id.charAt(0).toUpperCase() + front.id.slice(1)}
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                style={{ background: `${front.accent}26`, color: front.accent }}
              >
                €200
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
