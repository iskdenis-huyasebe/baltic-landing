import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";
import { Factory, UserCheck, MapPin } from "lucide-react";

const icons: Record<string, React.ElementType> = {
  factory: Factory,
  "user-check": UserCheck,
  "map-pin": MapPin,
};

export function ForWhom() {
  const t = useTranslations("forWhom");
  const items = t.raw("items") as {
    icon: string;
    title: string;
    body: string;
    examples: string;
  }[];

  return (
    <section id="for-whom" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => {
            const Icon = icons[item.icon] ?? Factory;
            return (
              <div
                key={i}
                className="p-6 md:p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center mb-5">
                  <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{item.body}</p>
                <p className="text-xs text-[var(--subtle)]">{item.examples}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
