"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-sm"
      >
        <span className="text-base font-medium text-[var(--foreground)]">{q}</span>
        <ChevronDown
          className={`size-5 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-5 text-sm text-[var(--muted)] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <div className="max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-6 md:px-8">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
