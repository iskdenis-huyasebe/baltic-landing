import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

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
              href={`/${locale}/order?plan=setup`}
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

        {/* Right: CSS-only browser/landing mockup */}
        <div className="relative hidden md:block" aria-hidden="true">
          {/* Glow behind mockup */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-2xl"
            style={{ background: "var(--accent)" }}
          />
          <div
            className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #1c1c1c 0%, #141414 100%)",
              aspectRatio: "16 / 10",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-1.5 px-4 border-b border-[var(--border)]"
              style={{ height: "36px", background: "#1a1a1a" }}
            >
              <div className="size-2.5 rounded-full bg-red-400/60" />
              <div className="size-2.5 rounded-full bg-yellow-400/60" />
              <div className="size-2.5 rounded-full bg-green-400/60" />
              <div
                className="flex-1 mx-4 rounded-full text-[10px] text-[var(--subtle)] flex items-center px-3"
                style={{ background: "rgba(255,255,255,0.05)", height: "20px" }}
              >
                terratech.eu
              </div>
            </div>

            {/* Page content mockup */}
            <div className="p-6 flex flex-col gap-5">
              {/* Hero block */}
              <div className="space-y-2">
                <div
                  className="h-2 rounded-full w-20"
                  style={{ background: "var(--accent)", opacity: 0.8 }}
                />
                <div className="h-6 rounded-md bg-white/10 w-3/4" />
                <div className="h-3 rounded-md bg-white/5 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <div
                    className="h-8 w-24 rounded-lg"
                    style={{ background: "var(--accent)" }}
                  />
                  <div className="h-8 w-24 rounded-lg border border-white/15" />
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-4 gap-2">
                {[35, 50, "4.9★", "5d"].map((v, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-2 flex flex-col gap-1"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="h-3 rounded bg-white/15 w-8" />
                    <div className="h-2 rounded bg-white/5 w-full" />
                  </div>
                ))}
              </div>

              {/* Cards row */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 space-y-1.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: i === 1 ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="h-3 rounded bg-white/15 w-3/4" />
                    <div className="h-2 rounded bg-white/5 w-full" />
                    <div className="h-2 rounded bg-white/5 w-2/3" />
                    {i === 1 && (
                      <div
                        className="h-5 rounded w-full mt-2"
                        style={{ background: "var(--accent)", opacity: 0.9 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
