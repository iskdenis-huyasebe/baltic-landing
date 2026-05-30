import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

export function TrustStrip() {
  const t = useTranslations("trust");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="py-12 border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] text-center mb-2 font-medium">
            {t("eyebrow")}
          </p>
          <p className="text-xs uppercase tracking-widest text-[var(--subtle)] text-center mb-8">
            {t("label")}
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-[var(--foreground)] tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
