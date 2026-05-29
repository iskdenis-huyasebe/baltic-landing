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
          className="flex items-center gap-2.5 text-base font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors group"
        >
          <span
            className="flex items-center justify-center rounded-lg text-sm font-bold text-[var(--accent-foreground)] leading-none select-none transition-transform duration-200 group-hover:scale-105"
            style={{ width: "30px", height: "30px", background: "var(--accent)", fontFamily: "var(--font-geist-sans)" }}
            aria-hidden="true"
          >
            T
          </span>
          Terratech
        </a>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <a
            href={`/${locale}/order?plan=setup`}
            className="inline-flex items-center justify-center bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] min-h-[36px]"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
