"use client";

import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--background)]/90 backdrop-blur-lg border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <a
          href={`/${locale}`}
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight group"
          aria-label="Unoweb"
        >
          <img
            src="/unoweb-mark.svg"
            alt=""
            aria-hidden="true"
            className="h-7 w-auto transition-transform duration-200 group-hover:scale-105"
          />
          <span>
            <span className="text-[var(--foreground)]">Uno</span>
            <span className="text-[var(--accent)]">web</span>
          </span>
        </a>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <a
            href={`/${locale}/order?plan=setup`}
            className="inline-flex items-center justify-center bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] min-h-[40px]"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
