import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
    },
    alternates: {
      canonical: `https://balticlanding.com/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://balticlanding.com/${l}`])
      ),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={geistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyMobileCTA />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
