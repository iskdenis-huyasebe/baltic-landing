import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

export function Portfolio() {
  const t = useTranslations("portfolio");
  const items = t.raw("items") as { name: string; niche: string; days: string; url: string }[];

  return (
    <section id="portfolio" className="py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="card-tilt group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300"
            >
              {/* Screenshot placeholder */}
              <div className="aspect-[16/10] bg-[var(--surface-elevated)] flex items-center justify-center">
                <span className="text-2xl font-medium text-[var(--subtle)]">
                  {item.name[0]}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--foreground)] mb-0.5">{item.name}</p>
                    <p className="text-sm text-[var(--muted)]">{item.niche}</p>
                  </div>
                  <span className="text-xs text-[var(--subtle)] bg-[var(--surface-elevated)] px-2 py-1 rounded-lg shrink-0">
                    {item.days}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <a
                    href={`https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--subtle)] hover:text-[var(--accent)] transition-colors"
                  >
                    {item.url}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            {t("moreLink")}
          </a>
        </div>
      </div>
    </section>
  );
}
