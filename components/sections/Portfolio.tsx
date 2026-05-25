import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";
import { ExternalLink } from "lucide-react";

// Unique color accent per project card
const cardAccents = [
  { bg: "rgba(190,242,100,0.08)", bar: "#bef264", bars: ["60%", "80%", "45%"] },
  { bg: "rgba(96,165,250,0.08)", bar: "#60a5fa", bars: ["75%", "50%", "65%"] },
  { bg: "rgba(251,146,60,0.08)", bar: "#fb923c", bars: ["55%", "70%", "40%"] },
];

function BrowserMockup({ accent }: { accent: typeof cardAccents[0] }) {
  return (
    <div
      className="aspect-[16/10] relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1a1a1a 0%, #111 100%)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accent.bar} 0%, transparent 65%)`,
        }}
      />
      {/* Browser chrome */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3"
        style={{ height: "28px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="size-2 rounded-full bg-red-400/50" />
        <div className="size-2 rounded-full bg-yellow-400/50" />
        <div className="size-2 rounded-full bg-green-400/50" />
        <div
          className="flex-1 mx-3 rounded-full"
          style={{ height: "14px", background: "rgba(255,255,255,0.06)" }}
        />
      </div>
      {/* Page content */}
      <div className="absolute inset-0 pt-8 px-4 pb-3 flex flex-col gap-3">
        {/* Hero stripe */}
        <div
          className="h-2 rounded-full w-16"
          style={{ background: accent.bar, opacity: 0.9 }}
        />
        <div className="h-5 rounded bg-white/10 w-3/4" />
        <div className="h-2.5 rounded bg-white/5 w-1/2" />
        <div className="flex gap-2 mt-1">
          <div className="h-7 w-20 rounded-lg" style={{ background: accent.bar }} />
          <div className="h-7 w-20 rounded-lg border border-white/15" />
        </div>
        {/* Content blocks */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {accent.bars.map((w, i) => (
            <div
              key={i}
              className="rounded-md p-2 flex flex-col gap-1"
              style={{ background: accent.bg, border: `1px solid ${accent.bar}22` }}
            >
              <div className="h-2 rounded bg-white/15" style={{ width: w }} />
              <div className="h-1.5 rounded bg-white/5 w-full" />
              <div className="h-1.5 rounded bg-white/5 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  const t = useTranslations("portfolio");
  const items = t.raw("items") as { name: string; niche: string; days: string; url: string }[];

  return (
    <section id="portfolio" className="py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300 hover:-translate-y-1">
                <BrowserMockup accent={cardAccents[i % cardAccents.length]} />
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
            </FadeIn>
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
