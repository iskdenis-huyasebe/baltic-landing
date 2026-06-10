import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "success" });

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center mx-auto mb-6">
          <Check className="size-8 text-[var(--accent)]" />
        </div>
        <h1 className="text-3xl font-medium text-[var(--foreground)] mb-4">
          {t("title")}
        </h1>
        <p className="text-[var(--muted)] mb-8">
          {t("body")}
        </p>
        <a
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-3 text-base font-medium hover:opacity-90 transition-opacity"
        >
          {t("back")}
        </a>
      </div>
    </main>
  );
}
