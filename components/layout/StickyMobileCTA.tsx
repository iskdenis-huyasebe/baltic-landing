"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("sticky");
  const locale = useLocale();

  useEffect(() => {
    const hero = document.querySelector("#hero");
    const contact = document.querySelector("#contact");
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "hero") setVisible(!entry.isIntersecting);
          if (entry.target.id === "contact" && entry.isIntersecting)
            setVisible(false);
        });
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    if (contact) observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--background)]/90 backdrop-blur-lg border-t border-[var(--border)] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-base font-medium text-[var(--foreground)]">
          {t("price")}
        </span>
        <span className="text-xs text-[var(--muted)]">{t("days")}</span>
      </div>
      <a
        href={`/${locale}/order?plan=setup`}
        className="inline-flex items-center justify-center bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] min-h-[44px]"
      >
        {t("cta")}
      </a>
    </div>
  );
}
