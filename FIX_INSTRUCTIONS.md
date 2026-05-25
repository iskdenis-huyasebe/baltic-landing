# Fix Instructions — Baltic Landing

> Этот документ — патч-лист для Sonnet (или любого разработчика). Все правки сгруппированы по приоритету. Каждая правка содержит: путь к файлу, что и зачем меняем, готовый код.
>
> **Контекст:** код уже написан и лежит в `code/`. Аудит выявил список проблем — см. полный список ниже. Применяй сверху вниз.
>
> **Стек проекта:** Next.js 15, Tailwind v4, next-intl 3, React 19, TypeScript. Работает в `code/`. Запуск: `npm run dev`.
>
> **Что НЕ менять:** структуру папок, имена компонентов, ключи в `content/*.json`. Все локали и переводы уже на месте.

---

## БЛОК 1 — Критические (без них нельзя запускать)

### Fix 1.1 — Cyrillic subset в Geist

**Проблема:** На `/ru` русский текст рендерится системным fallback-шрифтом, а не Geist — ломает дизайн.

**Файл:** `code/app/layout.tsx`

**Текущий код (строки 5–8):**
```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});
```

**Заменить на:**
```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});
```

Почему: добавляем cyrillic для RU. `display: "swap"` улучшает CLS (текст рендерится сразу с fallback, потом подменяется на Geist).

---

### Fix 1.2 — `<html lang>` per locale

**Проблема:** В корневом layout `<html>` без `lang` — Google путает языки, скринридеры читают не на том языке.

**Файлы:** `code/app/layout.tsx` + `code/app/[locale]/layout.tsx`

**Шаг 1.** В `app/layout.tsx` убрать `<html>` и `<body>` обёртки — оставить только children и шрифт-переменную через `next/font`:

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baltic Landing",
  description: "Landing pages for Baltic businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

Однако: Next.js требует, чтобы `<html>` и `<body>` были именно в **root layout**. Поэтому правильный путь — оставить `<html>` в root, но **рендерить его динамически в зависимости от URL**.

Реальное решение — оставить root как fallback (для not-found страниц), а в `app/[locale]/layout.tsx` обернуть детей в `<html lang={locale}>` через специальный паттерн. Однако Next.js не позволяет иметь два `<html>` в одном дереве.

**Правильное решение:** перенести `<html>` в `[locale]/layout.tsx`, а `app/layout.tsx` сделать минимальным без `<html>`:

`app/layout.tsx`:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

`app/[locale]/layout.tsx` (заменить полностью):
```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import "../globals.css";
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
      images: [`/og-${locale}.png`],
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
      </body>
    </html>
  );
}
```

Почему: теперь `<html lang>` корректно отражает текущую локаль, шрифт Geist с cyrillic применяется глобально, OG-картинка локализована.

---

### Fix 1.3 — Hero с визуалом

**Проблема:** Hero выглядит пусто — нет мокапа лендинга на ноутбуке справа от заголовка.

**Файл:** `code/components/sections/Hero.tsx`

**Заменить весь файл на:**

```tsx
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-8 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-6 font-medium">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-medium leading-[1.1] text-[var(--foreground)] mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed mb-10 max-w-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] min-h-[52px] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 hover:bg-[var(--surface)] hover:border-[var(--foreground)]/30 min-h-[52px]"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Mockup visual (CSS-only laptop) */}
        <div className="relative hidden md:block" aria-hidden="true">
          <div
            className="rounded-2xl border border-[var(--border)] overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
              aspectRatio: "16 / 10",
            }}
          >
            <div className="relative h-full p-2">
              <div
                className="h-full rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(190, 242, 100, 0.06) 0%, var(--surface) 40%)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-red-400/50" />
                  <div className="size-2 rounded-full bg-yellow-400/50" />
                  <div className="size-2 rounded-full bg-green-400/50" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="h-7 rounded-md bg-white/10 w-3/4" />
                  <div className="h-3 rounded-md bg-white/5 w-1/2" />
                  <div className="h-3 rounded-md bg-white/5 w-2/3" />
                  <div className="flex gap-2 pt-3">
                    <div
                      className="h-9 w-28 rounded-lg"
                      style={{ background: "var(--accent)" }}
                    />
                    <div className="h-9 w-28 rounded-lg border border-white/15" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-6">
                    <div className="h-16 rounded-md bg-white/5" />
                    <div className="h-16 rounded-md bg-white/5" />
                    <div className="h-16 rounded-md bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Почему: CSS-only mockup без зависимостей, выглядит как настоящий лендинг на ноутбуке. Не требует Figma-экспорта. На мобайле скрыт (`hidden md:block`) — там и без него хорошо.

---

### Fix 1.4 — Sanitize input в `/api/contact`

**Проблема:** Имя/business впрыскиваются в HTML письма напрямую — XSS-вектор в email-клиенте получателя.

**Файл:** `code/app/api/contact/route.ts`

**Заменить весь файл на:**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  business: z.string().min(2).max(500),
  contact: z.string().min(3).max(100),
  site: z.string().url().optional().or(z.literal("")),
  locale: z.string().optional(),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, business, contact, site, locale } = parsed.data;

    // Escape for HTML/Telegram safety
    const safe = {
      name: escapeHtml(name),
      business: escapeHtml(business),
      contact: escapeHtml(contact),
      site: site ? escapeHtml(site) : "",
      locale: locale || "unknown",
    };

    // Telegram notification (non-blocking)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const tgText = `🔥 <b>New lead — ${safe.locale.toUpperCase()}</b>\n\n👤 <b>${safe.name}</b>\n💼 ${safe.business}\n📞 ${safe.contact}${safe.site ? `\n🌐 ${safe.site}` : ""}\n\n⏰ Reply within 1 hour.`;
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: tgText,
          parse_mode: "HTML",
        }),
      }).catch((err) => console.error("Telegram error:", err));
    }

    // Resend email (non-blocking)
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendTo = process.env.RESEND_TO_EMAIL;
    const resendFrom = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && resendTo && resendFrom) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      resend.emails
        .send({
          from: resendFrom,
          to: resendTo,
          subject: `New lead (${safe.locale.toUpperCase()}): ${safe.name}`,
          html: `
            <h2>New lead from Baltic Landing — ${safe.locale.toUpperCase()}</h2>
            <p><b>Name:</b> ${safe.name}</p>
            <p><b>Business:</b> ${safe.business}</p>
            <p><b>Contact:</b> ${safe.contact}</p>
            ${safe.site ? `<p><b>Current site:</b> <a href="${safe.site}">${safe.site}</a></p>` : ""}
            <hr/>
            <p style="color:#999;font-size:12px">Sent via balticlanding.com contact form</p>
          `,
        })
        .catch((err) => console.error("Resend error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

Также: в `ContactCTA.tsx` в `handleSubmit` добавить `locale` в payload — взять через `useLocale()` из `next-intl` и передать в body:

```tsx
import { useLocale } from "next-intl";
// ...
const locale = useLocale();
// ...
body: JSON.stringify({ ...form, locale }),
```

Почему: zod-валидация защищает от мусора, `escapeHtml` блокирует HTML/script-инъекции в email и Telegram (Telegram тоже парсит HTML).

---

## БЛОК 2 — SEO и infrastructure

### Fix 2.1 — `app/sitemap.ts`

**Создать новый файл:** `code/app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1.0 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
  }));
}
```

---

### Fix 2.2 — `public/robots.txt`

**Создать новый файл:** `code/public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://balticlanding.com/sitemap.xml
```

(Заменить домен на реальный после покупки.)

---

### Fix 2.3 — JSON-LD LocalBusiness per locale

**Файл:** `code/app/[locale]/page.tsx`

**Заменить весь файл на:**

```tsx
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhatsIncluded } from "@/components/sections/WhatsIncluded";
import { Pricing } from "@/components/sections/Pricing";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { ForWhom } from "@/components/sections/ForWhom";
import { FAQ } from "@/components/sections/FAQ";
import { ContactCTA } from "@/components/sections/ContactCTA";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Baltic Landing",
    description:
      "Landing pages for Baltic businesses — €200, ready in 5 business days.",
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    priceRange: "€200",
    areaServed: ["LT", "LV", "EE"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vilnius",
      addressCountry: "LT",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Setup",
        price: "200",
        priceCurrency: "EUR",
        category: "OneTime",
      },
      {
        "@type": "Offer",
        name: "Care",
        price: "15",
        priceCurrency: "EUR",
        category: "Subscription",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "30",
        priceCurrency: "EUR",
        category: "Subscription",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TrustStrip />
      <WhatsIncluded />
      <Pricing />
      <Portfolio />
      <Process />
      <ForWhom />
      <FAQ />
      <ContactCTA />
    </>
  );
}
```

---

### Fix 2.4 — OG-картинки через next/og

**Создать новый файл:** `code/app/[locale]/opengraph-image.tsx`

```tsx
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const alt = "Baltic Landing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "seo",
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          color: "#fafafa",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#bef264",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0a0a",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            B
          </div>
          <span style={{ fontSize: "24px", fontWeight: 500 }}>
            Baltic Landing
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: "26px", color: "#a3a3a3", margin: 0 }}>
            {t("description")}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#bef264",
            borderRadius: "3px",
          }}
        />
      </div>
    ),
    size
  );
}
```

Почему: Next.js автоматически генерирует OG-картинку для каждой локали (1200×630). Никаких PNG в `public/` создавать руками не надо.

После этого в `[locale]/layout.tsx` в `generateMetadata` убрать ручную ссылку на `/og-${locale}.png` — Next.js подхватит автоматически.

---

### Fix 2.5 — Privacy / Terms / Cookies заглушки

Для каждой создать заглушку с минимальным контентом.

**`code/app/[locale]/privacy/page.tsx`:**

```tsx
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 py-32">
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-invert text-[var(--muted)] space-y-4">
        <p>Last updated: 2026-05-25</p>
        <p>
          Baltic Landing collects only the contact information you voluntarily
          submit through our contact form (name, business description, contact
          details). This data is used solely to respond to your inquiry.
        </p>
        <p>
          We do not sell or share your data with third parties. We use Vercel
          for hosting and Resend for email delivery. Both providers are
          GDPR-compliant.
        </p>
        <p>
          For data deletion requests, contact: denis@balticlanding.com
        </p>
      </div>
    </main>
  );
}
```

Аналогично для `terms/page.tsx` и `cookies/page.tsx` — заглушки с базовым текстом. **На v1 этого достаточно для прохождения Stripe/Vercel модерации.** В прод — заменить на тексты от литовского юриста.

---

### Fix 2.6 — Vercel Analytics

**Установить:** `npm install @vercel/analytics`

**Файл:** `code/app/[locale]/layout.tsx` — добавить импорт и компонент перед `</body>`:

```tsx
import { Analytics } from "@vercel/analytics/next";
// ...
<body>
  <NextIntlClientProvider ...>
    {/* ... */}
  </NextIntlClientProvider>
  <Analytics />
</body>
```

---

## БЛОК 3 — Stripe интеграция (можно через 1-2 дня после запуска)

### Fix 3.1 — Зависимости

```bash
npm install stripe @stripe/stripe-js
```

### Fix 3.2 — Env переменные

Добавить в `.env.example` (и в `.env.local` локально):

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_SETUP=price_...
STRIPE_PRICE_CARE=price_...
STRIPE_PRICE_GROWTH=price_...
```

### Fix 3.3 — `/api/checkout/route.ts`

**Создать новый файл:** `code/app/api/checkout/route.ts`

```ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
});

type Plan = "setup" | "care" | "growth" | "setup+care" | "setup+growth";

export async function POST(request: Request) {
  try {
    const { plan, locale = "lt" } = (await request.json()) as {
      plan: Plan;
      locale?: string;
    };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let mode: "payment" | "subscription" = "payment";

    if (plan === "setup") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    } else if (plan === "care") {
      lineItems.push({ price: process.env.STRIPE_PRICE_CARE!, quantity: 1 });
      mode = "subscription";
    } else if (plan === "growth") {
      lineItems.push({ price: process.env.STRIPE_PRICE_GROWTH!, quantity: 1 });
      mode = "subscription";
    } else if (plan === "setup+care") {
      lineItems.push(
        { price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_CARE!, quantity: 1 }
      );
      mode = "subscription";
    } else if (plan === "setup+growth") {
      lineItems.push(
        { price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 },
        { price: process.env.STRIPE_PRICE_GROWTH!, quantity: 1 }
      );
      mode = "subscription";
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${baseUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}#pricing`,
      locale: (["lt", "lv", "et", "ru"].includes(locale)
        ? (locale as "lt" | "lv" | "et" | "ru")
        : "en") as Stripe.Checkout.SessionCreateParams.Locale,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### Fix 3.4 — Передать `plan` из Pricing-карточек

**Файл:** `code/components/sections/Pricing.tsx`

Заменить `<a href="#contact">` в каждой карточке на `<button>` с onClick → fetch `/api/checkout`. Сделать компонент client (`"use client"`), добавить `useLocale()` для передачи локали.

Каркас:
```tsx
"use client";
import { useLocale, useTranslations } from "next-intl";

// внутри PricingCard:
const handleCheckout = async (plan: string) => {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, locale }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
};

// CTA — заменить <a> на <button onClick={() => handleCheckout(planId)}>
```

Где `planId` = `"setup"`, `"setup+care"`, `"setup+growth"` соответственно (Setup-карточка → setup, Care → setup+care, Growth → setup+growth — потому что подписку нельзя купить без первого setup).

### Fix 3.5 — Stripe Products в Dashboard

В Stripe Dashboard вручную создать:
- **Setup** — €200, one-time, with VAT
- **Care** — €15/мес, recurring monthly, with VAT
- **Growth** — €30/мес, recurring monthly, with VAT

Скопировать `price_...` ID из каждого в env.

### Fix 3.6 — Webhook

**Создать новый файл:** `code/app/api/webhook/stripe/route.ts`

```ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!sig) return NextResponse.json({ error: "Missing sig" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid sig" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const amount = (session.amount_total ?? 0) / 100;

    // Notify Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const text = `💰 <b>New payment</b>\n\nAmount: €${amount}\nCustomer: ${customerEmail}\nSession: ${session.id}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
```

Также нужно добавить webhook endpoint в Stripe Dashboard: `https://balticlanding.com/api/webhook/stripe`, event `checkout.session.completed`, и скопировать `whsec_...` в env.

Важно: добавить в `middleware.ts` исключение для `/api`:

```ts
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

(Уже есть — проверить.)

---

## БЛОК 4 — Минорные

### Fix 4.1 — Убрать `app/page.tsx`

**Удалить файл:** `code/app/page.tsx`

next-intl middleware сам редиректит `/` на `/lt` (defaultLocale + `localePrefix: "always"`).

### Fix 4.2 — framer-motion fade-in на секциях

**Создать файл:** `code/components/ui/FadeIn.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}
```

В каждой секции (TrustStrip, WhatsIncluded, Pricing, и т.д.) обернуть контентный блок в `<FadeIn>`. Hero не оборачивать — он рендерится сразу.

### Fix 4.3 — `next.config.ts` — image optimization

**Файл:** `code/next.config.ts`

Если будут картинки клиентов на портфолио (URL externals), добавить:
```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**.terratech.lt" },
    // ...
  ],
},
```

---

## ✅ Чек-лист «после всех правок»

- [ ] Открыть `/ru` — русский текст рендерится Geist (cyrillic), не Times New Roman
- [ ] View source `/lt` — `<html lang="lt">`, `/lv` — `<html lang="lv">`, и т.д.
- [ ] Hero на десктопе — слева текст, справа mockup ноутбука
- [ ] `https://balticlanding.com/sitemap.xml` отдаёт 5 URL
- [ ] `https://balticlanding.com/robots.txt` отдаёт правильный текст
- [ ] View source — `<script type="application/ld+json">` присутствует
- [ ] OG-картинка генерируется по `/lt/opengraph-image` (откроется как PNG)
- [ ] `/privacy`, `/terms`, `/cookies` открываются на каждой локали
- [ ] Vercel Analytics в `<head>` отрабатывает
- [ ] (Если Stripe сделан) Кнопка «Užsisakyti Setup» редиректит на Stripe Checkout
- [ ] Форма contact: попытка послать `<script>alert(1)</script>` в имя — приходит в email/Telegram уже экранированной
- [ ] `npm run build` проходит без ошибок
- [ ] Lighthouse Performance ≥ 90 на десктопе и ≥ 85 на мобайле

---

## Приоритеты для Sonnet

Если время ограничено — делать в таком порядке:

1. **Блок 1 целиком** (1.1 → 1.4) — без этого нельзя запускать. ~1 час работы.
2. **Блок 2 пункты 2.1, 2.2, 2.3, 2.5** — для SEO и compliance. ~40 минут.
3. **Блок 2 пункт 2.4 (OG via next/og)** — для красивого шеринга. ~20 минут.
4. **Блок 2 пункт 2.6 (Analytics)** — для метрик. ~5 минут.
5. **Блок 3 (Stripe)** — когда будут готовы Stripe Products в Dashboard. ~1.5 часа.
6. **Блок 4** — по желанию.

**Итого до запуска без Stripe:** ~2 часа работы Sonnet.
**Итого с Stripe:** ~3.5 часа.

Удачи 🚀
