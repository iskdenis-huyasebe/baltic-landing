import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations("trust");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="py-12 border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <p className="text-xs uppercase tracking-widest text-[var(--subtle)] text-center mb-8 font-medium">
          {t("label")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-medium text-[var(--foreground)] tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
        {/* Client logos placeholder */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {["TERRATECH", "IPOOLGO", "APPLECITYLAB"].map((name) => (
            <span
              key={name}
              className="text-sm font-medium tracking-wider text-[var(--subtle)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
