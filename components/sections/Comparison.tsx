import { useTranslations } from "next-intl";
import { Check, X, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type CellValue = string | boolean;

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={`size-5 mx-auto ${highlight ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
        aria-hidden="true"
      />
    ) : (
      <X className="size-5 mx-auto text-[var(--subtle)]" aria-hidden="true" />
    );
  }
  return (
    <span
      className={`text-sm ${highlight ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}`}
    >
      {value}
    </span>
  );
}

export function Comparison() {
  const t = useTranslations("comparison");
  const rows = t.raw("rows") as Array<{
    label: string;
    diy: CellValue;
    freelancer: CellValue;
    agency: CellValue;
    us: CellValue;
  }>;

  return (
    <section id="compare" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-medium">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-5 border-b border-[var(--border)]">
              <div className="p-4 md:p-5 text-xs uppercase tracking-widest text-[var(--subtle)]">
                {t("colHead")}
              </div>
              <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">
                DIY
              </div>
              <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">
                {t("freelancer")}
              </div>
              <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">
                {t("agency")}
              </div>
              <div className="p-4 md:p-5 text-center text-sm font-semibold text-[var(--accent)] bg-[var(--accent-muted)] flex items-center justify-center gap-1.5">
                <Zap className="size-4 shrink-0" aria-hidden="true" />
                {t("us")}
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-5 ${
                  i !== rows.length - 1 ? "border-b border-[var(--border)]" : ""
                } hover:bg-[var(--surface-elevated)] transition-colors`}
              >
                <div className="p-4 md:p-5 text-sm text-[var(--foreground)] font-medium">
                  {row.label}
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  <Cell value={row.diy} />
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  <Cell value={row.freelancer} />
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  <Cell value={row.agency} />
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center bg-[var(--accent-muted)]">
                  <Cell value={row.us} highlight />
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <p className="text-center text-sm text-[var(--subtle)] mt-6 italic">{t("footnote")}</p>
      </div>
    </section>
  );
}
