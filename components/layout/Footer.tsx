import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-[var(--border)] py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-tight mb-1">
              <span className="text-[var(--foreground)]">Uno</span>
              <span className="text-[var(--accent)]">web</span>
            </p>
            <p className="text-xs text-[var(--subtle)]">{t("legal")}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-4 text-xs text-[var(--subtle)]">
              <a href="/privacy" className="hover:text-[var(--muted)] transition-colors">
                {t("links.privacy")}
              </a>
              <a href="/terms" className="hover:text-[var(--muted)] transition-colors">
                {t("links.terms")}
              </a>
              <a href="/cookies" className="hover:text-[var(--muted)] transition-colors">
                {t("links.cookies")}
              </a>
              <a href={`/${locale}/status`} className="hover:text-[var(--muted)] transition-colors">
                {t("links.status")}
              </a>
            </div>
            <p className="text-xs text-[var(--subtle)]">{t("contact")}</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--subtle)]">{t("copy")}</p>
        </div>
      </div>
    </footer>
  );
}
