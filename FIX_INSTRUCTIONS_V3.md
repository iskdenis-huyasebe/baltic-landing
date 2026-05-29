# Fix Instructions V3 — Pricing Pivot + Brief Flow + Trello

> **Major pivot.** Это третья волна патчей. Применяется ПОСЛЕ V1 и V2.
>
> **Что меняется на уровне бизнес-модели:**
> 1. Один тариф Setup → три тарифа (Setup €200 / Setup Pro €500 / Custom €1200+)
> 2. «Portfolio с реальными кейсами» убирается с лендинга — заменяется на сравнительную таблицу
> 3. Subscription Care/Growth переписывается с новым позиционированием + annual discount + bundle с Setup
> 4. Новая страница `/order` — multi-step брифинг (5 шагов)
> 5. Бэкенд: интеграция с Trello (приём заказов), UploadThing (файлы), Stripe Checkout приоритетно
>
> **Стек:** Next.js 15, Tailwind v4, next-intl 3, 5 локалей.

---

## БЛОК 0 — Доп. ассеты и инфраструктура (Денис делает руками)

### 0.1. Trello board

1. Создать новый Trello board «Baltic Landing Orders»
2. Колонки (Lists): `Waiting payment` · `Paid (new)` · `In progress` · `Review` · `Done` · `Cancelled`
3. Лейблы (для тарифов):
   - 🟢 Setup
   - 🟡 Setup Pro
   - 🔵 Custom
   - 🟣 Care
   - 🟠 Growth
4. Получить API key + token: https://trello.com/power-ups/admin
5. Получить ID доски и ID колонки `Waiting payment`:
   ```bash
   curl "https://api.trello.com/1/members/me/boards?key=KEY&token=TOKEN"
   # → выбрать board, скопировать его id
   curl "https://api.trello.com/1/boards/BOARD_ID/lists?key=KEY&token=TOKEN"
   # → скопировать id колонки "Waiting payment"
   ```
6. Добавить в `.env.local`:
   ```
   TRELLO_API_KEY=...
   TRELLO_TOKEN=...
   TRELLO_BOARD_ID=...
   TRELLO_LIST_NEW=...           # ID "Waiting payment"
   TRELLO_LIST_PAID=...          # ID "Paid (new)"
   TRELLO_LABEL_SETUP=...        # ID лейбла "Setup"
   TRELLO_LABEL_SETUP_PRO=...
   TRELLO_LABEL_CUSTOM=...
   TRELLO_LABEL_CARE=...
   TRELLO_LABEL_GROWTH=...
   ```

### 0.2. UploadThing

1. Регистрация: https://uploadthing.com (бесплатный план 2 ГБ)
2. Создать app, скопировать `UPLOADTHING_TOKEN`
3. Добавить в `.env.local`:
   ```
   UPLOADTHING_TOKEN=...
   ```

### 0.3. Stripe Products

Создать в Stripe Dashboard (если ещё не сделано в V1):
- **Setup** — €200 one-time, with VAT
- **Setup Pro** — €500 one-time, with VAT
- **Care monthly** — €15/мес recurring
- **Care annual** — €150/год recurring
- **Growth monthly** — €30/мес recurring
- **Growth annual** — €300/год recurring
- **Care 6-month bundle** — €90 one-time (для bundle «Setup + 6mo Care»)

Скопировать `price_...` ID каждого в `.env.local`:
```
STRIPE_PRICE_SETUP=price_...
STRIPE_PRICE_SETUP_PRO=price_...
STRIPE_PRICE_CARE_MONTHLY=price_...
STRIPE_PRICE_CARE_ANNUAL=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_GROWTH_ANNUAL=price_...
STRIPE_PRICE_CARE_6MO=price_...
```

(Custom тариф — без Stripe price, потому что цена индивидуальная — это lead → email/Telegram.)

---

## БЛОК 1 — Удалить Portfolio с лендинга, добавить Comparison

### 1.1. Удалить секцию Portfolio

**Файл:** `code/app/[locale]/page.tsx`

Удалить импорт и использование `<Portfolio />`. Удалить файл `code/components/sections/Portfolio.tsx`.

`portfolio.*` в `content/*.json` оставить — он понадобится в `/order` page (там клиент выбирает дизайн из той же библиотеки).

### 1.2. Создать новую секцию: Comparison table

**Создать файл:** `code/components/sections/Comparison.tsx`

```tsx
import { useTranslations } from "next-intl";
import { Check, X, Zap } from "lucide-react";

export function Comparison() {
  const t = useTranslations("comparison");
  const rows = t.raw("rows") as Array<{
    label: string;
    diy: string | boolean;
    freelancer: string | boolean;
    agency: string | boolean;
    us: string | boolean;
  }>;

  const Cell = ({ value, highlight }: { value: string | boolean; highlight?: boolean }) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={`size-5 mx-auto ${highlight ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} aria-hidden="true" />
      ) : (
        <X className="size-5 mx-auto text-[var(--subtle)]" aria-hidden="true" />
      );
    }
    return <span className={`text-sm ${highlight ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}`}>{value}</span>;
  };

  return (
    <section id="compare" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-medium">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 gap-0 border-b border-[var(--border)]">
            <div className="p-4 md:p-5 text-xs uppercase tracking-widest text-[var(--subtle)]">
              {t("colHead")}
            </div>
            <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">DIY</div>
            <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">{t("freelancer")}</div>
            <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--muted)]">{t("agency")}</div>
            <div className="p-4 md:p-5 text-center text-sm font-medium text-[var(--accent)] bg-[var(--accent-muted)] flex items-center justify-center gap-1.5">
              <Zap className="size-4" aria-hidden="true" />
              {t("us")}
            </div>
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-5 gap-0 ${i !== rows.length - 1 ? "border-b border-[var(--border)]" : ""}`}
            >
              <div className="p-4 md:p-5 text-sm text-[var(--foreground)] font-medium">{row.label}</div>
              <div className="p-4 md:p-5 text-center flex items-center justify-center">
                <Cell value={row.diy} />
              </div>
              <div className="p-4 md:p-5 text-center flex items-center justify-center">
                <Cell value={row.freelancer} />
              </div>
              <div className="p-4 md:p-5 text-center flex items-center justify-center">
                <Cell value={row.agency} />
              </div>
              <div className="p-4 md:p-5 text-center flex items-center justify-center bg-[var(--accent-muted)]">
                <Cell value={row.us} highlight />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--subtle)] mt-6 italic">{t("footnote")}</p>
      </div>
    </section>
  );
}
```

### 1.3. Контент Comparison в `content/*.json`

Добавить новый ключ `comparison` в каждый из 5 JSON-файлов.

**`content/en.json`:**
```json
"comparison": {
  "eyebrow": "WHY US",
  "h2": "Compare: there's no closer alternative",
  "subtitle": "All 4 paths to a landing page. We sit in the only sweet spot.",
  "colHead": "What you get",
  "freelancer": "Freelancer",
  "agency": "Agency",
  "us": "Baltic Landing",
  "rows": [
    { "label": "Price", "diy": "€0 + €15/mo", "freelancer": "€500–800", "agency": "€1500+", "us": "€200" },
    { "label": "Time to launch", "diy": "2–4 weeks", "freelancer": "2–3 weeks", "agency": "4–6 weeks", "us": "3 days" },
    { "label": "Built-for-conversion design", "diy": false, "freelancer": "Sometimes", "agency": true, "us": true },
    { "label": "Done-for-you (no DIY)", "diy": false, "freelancer": true, "agency": true, "us": true },
    { "label": "Includes hosting + domain", "diy": false, "freelancer": false, "agency": "Sometimes", "us": true },
    { "label": "5 languages out of the box", "diy": false, "freelancer": false, "agency": "Custom quote", "us": true },
    { "label": "Ongoing care (€15/mo)", "diy": false, "freelancer": false, "agency": "€100+/mo", "us": true }
  ],
  "footnote": "Not pictured: 24 weekends of \"I'll get back to you next Monday\" on Upwork."
}
```

Локализованные версии (вкратце, полные переводы аналогично):

**RU:**
```json
"comparison": {
  "eyebrow": "ПОЧЕМУ МЫ",
  "h2": "Сравните: ближе альтернативы нет",
  "subtitle": "4 способа получить лендинг. Мы — в единственной правильной точке.",
  "colHead": "Что получаете",
  "freelancer": "Фрилансер",
  "agency": "Агентство",
  "us": "Baltic Landing",
  "rows": [
    { "label": "Цена", "diy": "€0 + €15/мес", "freelancer": "€500–800", "agency": "€1500+", "us": "€200" },
    { "label": "Срок до запуска", "diy": "2–4 нед.", "freelancer": "2–3 нед.", "agency": "4–6 нед.", "us": "3 дня" },
    { "label": "Дизайн под конверсию", "diy": false, "freelancer": "Иногда", "agency": true, "us": true },
    { "label": "Под ключ (без DIY)", "diy": false, "freelancer": true, "agency": true, "us": true },
    { "label": "Хостинг + домен", "diy": false, "freelancer": false, "agency": "Иногда", "us": true },
    { "label": "5 языков из коробки", "diy": false, "freelancer": false, "agency": "По запросу", "us": true },
    { "label": "Поддержка (€15/мес)", "diy": false, "freelancer": false, "agency": "€100+/мес", "us": true }
  ],
  "footnote": "Не показано: 24 выходных «отвечу в понедельник» на Upwork."
}
```

LT/LV/ET — переводим в том же ключе.

### 1.4. Подключить Comparison в page.tsx

**Файл:** `code/app/[locale]/page.tsx`

После Pricing, перед Process (вместо удалённого Portfolio):
```tsx
import { Comparison } from "@/components/sections/Comparison";
// ...
<Pricing />
<Comparison />  {/* NEW — вместо Portfolio */}
<Process />
```

---

## БЛОК 2 — Pricing на 3 тарифа

### 2.1. Обновить `content/*.json` секция `pricing`

**`content/en.json`** (RU/LT/LV/ET — аналогично, см. таблицу переводов ниже):

```json
"pricing": {
  "h2": "Three ways to launch. Pick your level.",
  "subtitle": "Same quality, different scope. All include 5 languages, hosting, domain, support.",
  "note": "All prices include VAT. EU companies with VAT ID — reverse charge (0% VAT applied automatically).",
  "bundleToggleLabel": "Add 6 months of Care for €60 (save €30)",
  "setup": {
    "title": "Setup",
    "subtitle": "Pick from 6 proven designs",
    "price": "200",
    "period": "one-time",
    "tagline": "Start here",
    "bullets": [
      "Choose from 6 battle-tested layouts",
      "We fill it with your content + brand colors",
      "Domain + first month hosting included",
      "Form + Telegram/email notifications",
      "Built-in SEO foundation",
      "5 languages out of the box",
      "30 days of technical support"
    ],
    "cta": "Order Setup"
  },
  "pro": {
    "title": "Setup Pro",
    "subtitle": "Customized to your brand",
    "price": "500",
    "period": "one-time",
    "tagline": "Most chosen for B2B",
    "badge": "★ Best value",
    "bullets": [
      "Everything in Setup",
      "Layout customization (rearrange sections)",
      "Your own illustrations or photography",
      "Custom typography pairing",
      "Up to 3 unique sections built from scratch",
      "Priority delivery: 5 business days",
      "60 days of technical support"
    ],
    "cta": "Order Pro"
  },
  "custom": {
    "title": "Custom",
    "subtitle": "Designed from scratch for your brand",
    "price": "1200+",
    "period": "starting from",
    "tagline": "Full creative direction",
    "bullets": [
      "Brand audit + competitor analysis",
      "Unique design language (not template)",
      "Multiple design rounds",
      "Up to 6 unique sections",
      "Custom illustrations or photography session",
      "Delivery: 2 weeks",
      "90 days of technical support"
    ],
    "cta": "Talk to Denis"
  }
}
```

Удалить старые `pricing.growth` и `pricing.care` из этого узла — они переезжают в новую секцию `subscription` (см. БЛОК 3).

**Таблица переводов цены/тарифа на 5 языках:**

| Поле | LT | LV | ET | EN | RU |
|---|---|---|---|---|---|
| `setup.tagline` | `Pradėk čia` | `Sāc šeit` | `Alusta siit` | `Start here` | `Начни здесь` |
| `pro.tagline` | `Populiariausias B2B` | `Populārākais B2B` | `Populaarseim B2B` | `Most chosen for B2B` | `Чаще всего выбирают B2B` |
| `pro.badge` | `★ Geriausia vertė` | `★ Labākā vērtība` | `★ Parim valik` | `★ Best value` | `★ Лучшее соотношение` |
| `custom.tagline` | `Pilna kūrybinė kryptis` | `Pilna radošā kontrole` | `Täielik loomeprotsess` | `Full creative direction` | `Полный творческий контроль` |
| `custom.cta` | `Pakalbėti su Denisu` | `Runāt ar Denisu` | `Räägi Denisega` | `Talk to Denis` | `Поговорить с Денисом` |
| `bundleToggleLabel` | `Pridėti 6 mėn. Care už €60 (sutaupyk €30)` | `Pievienot 6 mēn. Care par €60 (ietaupi €30)` | `Lisa 6 kuud Care'i €60 eest (säästa €30)` | `Add 6 months of Care for €60 (save €30)` | `Добавить 6 мес. Care за €60 (экономия €30)` |

### 2.2. Обновить компонент Pricing

**Файл:** `code/components/sections/Pricing.tsx`

Перепиши целиком — теперь 3 карточки и toggle на bundle:

```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

function PricingCard({
  data,
  highlight,
  cta,
  ctaAction,
  bundleToggle,
}: {
  data: { title: string; subtitle: string; price: string; period: string; tagline: string; bullets: string[]; badge?: string };
  highlight?: boolean;
  cta: string;
  ctaAction: () => void;
  bundleToggle?: React.ReactNode;
}) {
  const locale = useLocale();
  const priceFormatted = locale === "en" ? `€${data.price}` : `${data.price} €`;

  return (
    <div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl border transition-all duration-200 ${
        highlight
          ? "bg-gradient-to-b from-[var(--surface)] to-[var(--surface)]/50 border-[var(--accent)]/60 hover:border-[var(--accent)] md:scale-[1.04] md:-my-2 shadow-[0_0_60px_-15px_rgba(190,242,100,0.15)]"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
      }`}
    >
      {data.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          {data.badge}
        </span>
      )}

      <div className="mb-2">
        <h3 className="text-xl font-medium text-[var(--foreground)]">{data.title}</h3>
        <p className="text-sm text-[var(--muted)] mt-1">{data.subtitle}</p>
      </div>

      <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-5 mt-3 font-medium">
        {data.tagline}
      </p>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-medium text-[var(--foreground)]">{priceFormatted}</span>
          <span className="text-sm text-[var(--muted)]">{data.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            <Check className="size-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[var(--muted)]">{b}</span>
          </li>
        ))}
      </ul>

      {bundleToggle}

      <button
        onClick={ctaAction}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px] ${
          highlight
            ? "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
            : "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
        }`}
      >
        {cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [bundle, setBundle] = useState(false);

  const setup = t.raw("setup") as any;
  const pro = t.raw("pro") as any;
  const custom = t.raw("custom") as any;

  const goOrder = (plan: string) => {
    if (plan === "custom") {
      window.location.href = `#contact`;
      return;
    }
    const params = new URLSearchParams({ plan, ...(bundle ? { bundle: "care6" } : {}) });
    window.location.href = `/${locale}/order?${params.toString()}`;
  };

  return (
    <section id="pricing" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          <PricingCard
            data={setup}
            cta={setup.cta}
            ctaAction={() => goOrder("setup")}
            bundleToggle={
              <label className="flex items-start gap-2.5 mb-5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={bundle}
                  onChange={(e) => setBundle(e.target.checked)}
                  className="mt-0.5 accent-[var(--accent)] size-4"
                />
                <span className="text-xs text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                  {t("bundleToggleLabel")}
                </span>
              </label>
            }
          />
          <PricingCard
            data={pro}
            highlight
            cta={pro.cta}
            ctaAction={() => goOrder("pro")}
          />
          <PricingCard
            data={custom}
            cta={custom.cta}
            ctaAction={() => goOrder("custom")}
          />
        </div>

        <p className="text-center text-sm text-[var(--subtle)] mt-8 max-w-2xl mx-auto italic">{t("note")}</p>
      </div>
    </section>
  );
}
```

---

## БЛОК 3 — Subscription секция (новая, отдельный блок)

### 3.1. Логика

Подписка теперь не часть Pricing-карточек, а отдельная секция между Pricing и Comparison. Её задача — продать подписку **как продолжение Setup**, а не как «третий ряд цен».

### 3.2. Создать секцию

**Создать файл:** `code/components/sections/Subscription.tsx`

```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Check } from "lucide-react";

export function Subscription() {
  const t = useTranslations("subscription");
  const locale = useLocale();
  const [annual, setAnnual] = useState(false);

  const care = t.raw("care") as any;
  const growth = t.raw("growth") as any;
  const examples = t.raw("examples") as string[];
  const whyTable = t.raw("whyTable") as Array<{ label: string; without: string; withSub: string }>;

  const carePrice = annual ? care.priceAnnual : care.priceMonthly;
  const growthPrice = annual ? growth.priceAnnual : growth.priceMonthly;
  const period = annual ? t("perYear") : t("perMonth");
  const priceFmt = (p: string) => locale === "en" ? `€${p}` : `${p} €`;

  return (
    <section id="subscription" className="py-16 md:py-24 px-6 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-medium">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm ${!annual ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}`}>
            {t("monthly")}
          </span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[var(--accent)]" : "bg-[var(--surface-elevated)]"}`}
            aria-label="Toggle billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-[var(--foreground)] transition-transform ${
                annual ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}`}>
            {t("annual")} <span className="text-[var(--accent)] text-xs">−17%</span>
          </span>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12">
          {/* Care */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-medium mb-1">{care.title}</h3>
            <p className="text-sm text-[var(--muted)] mb-6">{care.subtitle}</p>
            <div className="mb-6">
              <span className="text-4xl font-medium">{priceFmt(carePrice)}</span>
              <span className="text-sm text-[var(--muted)] ml-2">{period}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {(care.bullets as string[]).map((b, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <Check className="size-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-[var(--muted)]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth */}
          <div className="bg-[var(--surface)] border border-[var(--accent)]/40 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_-15px_rgba(190,242,100,0.15)]">
            <h3 className="text-xl font-medium mb-1">{growth.title}</h3>
            <p className="text-sm text-[var(--muted)] mb-6">{growth.subtitle}</p>
            <div className="mb-6">
              <span className="text-4xl font-medium">{priceFmt(growthPrice)}</span>
              <span className="text-sm text-[var(--muted)] ml-2">{period}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {(growth.bullets as string[]).map((b, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <Check className="size-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-[var(--muted)]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* "What we did this month" examples */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-[var(--subtle)] mb-4 text-center font-medium">
            {t("examplesTitle")}
          </p>
          <ul className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {examples.map((ex, i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-[var(--muted)] bg-[var(--background)] border border-[var(--border)] rounded-xl p-4">
                <span className="text-[var(--accent)] shrink-0">✓</span>
                {ex}
              </li>
            ))}
          </ul>
        </div>

        {/* Why-table: without vs with subscription */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            <div className="p-4 text-xs uppercase tracking-widest text-[var(--subtle)]">{t("whyHead")}</div>
            <div className="p-4 text-center text-sm font-medium text-[var(--muted)]">{t("whyWithout")}</div>
            <div className="p-4 text-center text-sm font-medium text-[var(--accent)] bg-[var(--accent-muted)]">{t("whyWith")}</div>
          </div>
          {whyTable.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 ${i !== whyTable.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
              <div className="p-4 text-sm text-[var(--foreground)]">{row.label}</div>
              <div className="p-4 text-center text-sm text-[var(--muted)]">{row.without}</div>
              <div className="p-4 text-center text-sm text-[var(--foreground)] font-medium bg-[var(--accent-muted)]">{row.withSub}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--subtle)] mt-6 italic max-w-2xl mx-auto">{t("footnote")}</p>
      </div>
    </section>
  );
}
```

### 3.3. Контент Subscription

**`content/en.json`** — добавить новый ключ `subscription`:

```json
"subscription": {
  "eyebrow": "AFTER LAUNCH",
  "h2": "Your landing keeps earning. We keep it sharp.",
  "subtitle": "A site without support stops bringing leads in 3 months. With Care or Growth — it gets better every month.",
  "monthly": "Monthly",
  "annual": "Annual",
  "perMonth": "/month",
  "perYear": "/year",
  "care": {
    "title": "Care",
    "subtitle": "Always-on. Always supported.",
    "priceMonthly": "15",
    "priceAnnual": "150",
    "bullets": [
      "Hosting + domain + SSL — handled (€10–15/mo if you pay alone)",
      "Auto-backups every week + uptime monitoring",
      "We replace photos/texts/prices when your business changes — unlimited small edits",
      "Reply within 24h, fix within 48h",
      "Quarterly check-in: what's working, what to tweak"
    ]
  },
  "growth": {
    "title": "Growth",
    "subtitle": "Active conversion optimization",
    "priceMonthly": "30",
    "priceAnnual": "300",
    "bullets": [
      "Everything in Care",
      "One A/B test per month (headline / CTA / hero image)",
      "New sections added when you launch new offers",
      "Seasonal campaigns: holiday banner, sales, promos",
      "Monthly 15-min strategy call",
      "Priority reply: under 12h",
      "Monthly report: traffic / leads / what we changed"
    ]
  },
  "examplesTitle": "WHAT GROWTH SUBSCRIBERS GOT LAST MONTH",
  "examples": [
    "Replaced 6 stock photos with real shots from a Vilnius shoot — bounce rate fell 18%",
    "A/B tested «Book now» vs «Get a free quote» — second won, +24% leads",
    "Added a winter promo banner with countdown timer — 41 extra signups",
    "Fixed Cyrillic font on mobile after browser update — 0 downtime",
    "Wrote and shipped 3 new SEO meta variants — climbed to position 4 for «landing Vilnius»",
    "Migrated form to webhook + Google Sheets dashboard — leads now sorted by source"
  ],
  "whyHead": "What costs you",
  "whyWithout": "Without subscription",
  "whyWith": "With Care €15/mo",
  "whyTable": [
    { "label": "Hosting (Vercel Pro)", "without": "€20/month", "withSub": "Included" },
    { "label": "Domain renewal", "without": "€15/year", "withSub": "Included" },
    { "label": "SSL certificate", "without": "€50/year", "withSub": "Included" },
    { "label": "Edit text/photo (freelancer)", "without": "€40/hour", "withSub": "Unlimited" },
    { "label": "Uptime monitoring (UptimeRobot Pro)", "without": "€7/month", "withSub": "Included" },
    { "label": "Site goes down on Sunday at 3 AM", "without": "You panic", "withSub": "We fix it" }
  ],
  "footnote": "Total without subscription: ~€35/month + €40/hour for any change. With Care: €15/month, everything done for you. Math is on your side."
}
```

Для RU/LT/LV/ET — переводим с сохранением структуры. Ключевые переводы:

| Поле | LT | LV | ET | RU |
|---|---|---|---|---|
| `eyebrow` | `PO PALEIDIMO` | `PĒC PALAIŠANAS` | `PÄRAST KÄIVITAMIST` | `ПОСЛЕ ЗАПУСКА` |
| `h2` | `Tavo landingas vis dar uždirba. Mes jį palaikom aštrų.` | `Tava mājas lapa turpina pelnīt. Mēs to uzturam asu.` | `Sinu sait teenib edasi. Meie hoiame ta teravalt.` | `Ваш лендинг продолжает приносить лиды. Мы держим его в форме.` |
| `monthly` | `Kas mėnesį` | `Mēnesī` | `Kuus` | `Помесячно` |
| `annual` | `Metiniai` | `Gadā` | `Aastas` | `Ежегодно` |
| `whyHead` | `Kainos tau` | `Cenas tev` | `Hinnad sulle` | `Что стоит` |
| `whyWithout` | `Be prenumeratos` | `Bez abonementa` | `Tellimuseta` | `Без подписки` |
| `whyWith` | `Su Care €15/mėn.` | `Ar Care €15/mēn.` | `Care'ga €15/kuus` | `С Care €15/мес.` |

### 3.4. Подключить в page.tsx

**Файл:** `code/app/[locale]/page.tsx`

После Pricing, перед Comparison:
```tsx
<Pricing />
<Subscription />  {/* NEW */}
<Comparison />
<Process />
```

---

## БЛОК 4 — /order Multi-step Brief

### 4.1. Структура

5 шагов:
1. **Basics** — имя, бизнес, контакт, язык сайта
2. **Design choice** — выбор из 6 шаблонов (3 наших SVG-концепта + 3 real screenshots когда появятся)
3. **Content** — заголовок, преимущества, контакт для формы на сайте
4. **Files & branding** — лого, фото, бренд-цвета (через UploadThing)
5. **Confirm & Pay** — сводка, опциональный bundle Care, кнопка Stripe Checkout

Прогресс-бар сверху. Кнопки `Back` / `Next`. Состояние сохраняется в localStorage.

### 4.2. Создать роут

**Создать файл:** `code/app/[locale]/order/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { StepBasics } from "@/components/order/StepBasics";
import { StepDesign } from "@/components/order/StepDesign";
import { StepContent } from "@/components/order/StepContent";
import { StepFiles } from "@/components/order/StepFiles";
import { StepReview } from "@/components/order/StepReview";

export type OrderState = {
  plan: "setup" | "pro";
  bundle: boolean;
  // Step 1
  name: string;
  business: string;
  contact: string;
  siteLocale: string;
  // Step 2
  designId: string;
  designNote: string;
  // Step 3
  headline: string;
  bullets: string;
  leadEmail: string;
  // Step 4
  logoUrl: string;
  photoUrls: string[];
  textsUrl: string;
  // Meta
  locale: string;
};

const STORAGE_KEY = "baltic-order-state-v1";

export default function OrderPage() {
  const locale = useLocale();
  const t = useTranslations("order");
  const params = useSearchParams();
  const router = useRouter();

  const initialPlan = (params.get("plan") as "setup" | "pro") || "setup";
  const initialBundle = params.get("bundle") === "care6";

  const [step, setStep] = useState(1);
  const [state, setState] = useState<OrderState>({
    plan: initialPlan,
    bundle: initialBundle,
    name: "",
    business: "",
    contact: "",
    siteLocale: locale,
    designId: "",
    designNote: "",
    headline: "",
    bullets: "",
    leadEmail: "",
    logoUrl: "",
    photoUrls: [],
    textsUrl: "",
    locale,
  });

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch: Partial<OrderState>) => setState((s) => ({ ...s, ...patch }));

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canProceed = (() => {
    if (step === 1) return state.name && state.business && state.contact;
    if (step === 2) return !!state.designId;
    if (step === 3) return state.headline && state.bullets;
    return true;
  })();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-2">
            <span>{t("step")} {step} {t("of")} {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-[var(--surface)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-10">
          {step === 1 && <StepBasics state={state} update={update} />}
          {step === 2 && <StepDesign state={state} update={update} />}
          {step === 3 && <StepContent state={state} update={update} />}
          {step === 4 && <StepFiles state={state} update={update} />}
          {step === 5 && <StepReview state={state} update={update} />}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
            >
              <ArrowLeft className="size-4" /> {t("back")}
            </button>
          ) : (
            <a href={`/${locale}#pricing`} className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm">
              <ArrowLeft className="size-4" /> {t("backToPricing")}
            </a>
          )}

          {step < totalSteps && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-3 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {t("next")} <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
```

### 4.3. Step components

Создать 5 файлов в `code/components/order/`:

- `StepBasics.tsx` — текстовые поля name, business, contact, siteLocale selector
- `StepDesign.tsx` — grid из 6 design cards (3 концепта + 3 placeholder), радиокнопка выбора + textarea для комментариев
- `StepContent.tsx` — headline (input), bullets (textarea), leadEmail (input)
- `StepFiles.tsx` — UploadThing dropzone для лого + photos + texts
- `StepReview.tsx` — сводка + Stripe button

Пример `StepReview.tsx` (самый важный, шаг с финальной оплатой):

```tsx
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

export function StepReview({ state, update }: { state: OrderState; update: (p: Partial<OrderState>) => void }) {
  const t = useTranslations("order.review");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const prices: Record<string, number> = { setup: 200, pro: 500 };
  const basePrice = prices[state.plan];
  const bundlePrice = state.bundle ? 60 : 0;
  const total = basePrice + bundlePrice;
  const totalFmt = locale === "en" ? `€${total}` : `${total} €`;

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(t("error"));
        setLoading(false);
      }
    } catch (e) {
      alert(t("error"));
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t("plan")}</span>
          <span className="font-medium">{state.plan === "setup" ? "Setup" : "Setup Pro"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t("design")}</span>
          <span className="font-medium">{state.designId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t("language")}</span>
          <span className="font-medium uppercase">{state.siteLocale}</span>
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-[var(--border)]">
          <input
            type="checkbox"
            checked={state.bundle}
            onChange={(e) => update({ bundle: e.target.checked })}
            className="mt-1 accent-[var(--accent)] size-4"
          />
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">{t("bundle")}</div>
            <div className="text-xs text-[var(--muted)]">{t("bundleNote")}</div>
          </div>
        </label>

        <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg">
          <span className="font-medium">{t("total")}</span>
          <span className="font-medium text-[var(--accent)]">{totalFmt}</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-4 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 min-h-[52px]"
      >
        {loading ? t("redirecting") : t("payButton")}
      </button>

      <p className="text-xs text-[var(--subtle)] text-center mt-4">{t("secure")}</p>
    </div>
  );
}
```

### 4.3.bis — Полный код 4-х оставшихся step-компонентов

**Создать `code/components/order/StepBasics.tsx`:**

```tsx
"use client";

import { useTranslations } from "next-intl";
import type { OrderState } from "@/app/[locale]/order/page";

const LOCALES = ["lt", "lv", "et", "en", "ru"];

export function StepBasics({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.basics");
  const fields = t.raw("fields") as Record<string, { label: string; placeholder: string }>;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-5">
        <Field
          label={fields.name.label}
          placeholder={fields.name.placeholder}
          value={state.name}
          onChange={(v) => update({ name: v })}
        />
        <Field
          label={fields.business.label}
          placeholder={fields.business.placeholder}
          value={state.business}
          onChange={(v) => update({ business: v })}
        />
        <Field
          label={fields.contact.label}
          placeholder={fields.contact.placeholder}
          value={state.contact}
          onChange={(v) => update({ contact: v })}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            {fields.siteLocale.label}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => update({ siteLocale: loc })}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  state.siteLocale === loc
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)]"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px]"
      />
    </div>
  );
}
```

---

**Создать `code/components/order/StepDesign.tsx`:**

```tsx
"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Check } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

type Design = {
  id: string;
  name: string;
  niche: string;
  image: string;
  status: "live" | "concept";
};

// Hardcoded for now — when more real screenshots arrive, just add to this array.
const DESIGNS: Design[] = [
  { id: "terratech", name: "Terratech", niche: "B2B equipment", image: "/portfolio/terratech.webp", status: "live" },
  { id: "ipoolgo", name: "IPOOLGO", niche: "E-commerce / seasonal", image: "/portfolio/ipoolgo.webp", status: "live" },
  { id: "applecitylab", name: "Applecitylab", niche: "Local services", image: "/portfolio/applecitylab.webp", status: "live" },
  { id: "mindshift", name: "Mindshift", niche: "Coaching / private specialists", image: "/portfolio/coach-concept.svg", status: "concept" },
  { id: "cutshop", name: "CutShop", niche: "Barbershop / lifestyle", image: "/portfolio/barbershop-concept.svg", status: "concept" },
  { id: "dentacare", name: "DentaCare", niche: "Clinic / health", image: "/portfolio/dental-concept.svg", status: "concept" },
];

export function StepDesign({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.design");

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DESIGNS.map((d) => {
          const selected = state.designId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => update({ designId: d.id })}
              className={`group text-left bg-[var(--surface)] border rounded-2xl overflow-hidden transition-all ${
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="relative aspect-[16/10] bg-[var(--background)]">
                <Image
                  src={d.image}
                  alt={`${d.name} — ${d.niche}`}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                  unoptimized={d.image.endsWith(".svg")}
                />
                {selected && (
                  <div className="absolute top-3 right-3 size-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <Check className="size-4 text-[var(--accent-foreground)]" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-[var(--foreground)]">{d.name}</h3>
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      d.status === "live"
                        ? "bg-[rgba(74,222,128,0.12)] text-[#86efac]"
                        : "bg-white/[0.06] text-[var(--subtle)]"
                    }`}
                  >
                    {d.status === "live" ? "Live" : "Concept"}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">{d.niche}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          {t("noteLabel")}
        </label>
        <textarea
          value={state.designNote}
          onChange={(e) => update({ designNote: e.target.value })}
          placeholder={t("notePlaceholder")}
          rows={3}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
        />
      </div>
    </div>
  );
}
```

---

**Создать `code/components/order/StepContent.tsx`:**

```tsx
"use client";

import { useTranslations } from "next-intl";
import type { OrderState } from "@/app/[locale]/order/page";

export function StepContent({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.content");
  const fields = t.raw("fields") as Record<string, { label: string; placeholder: string }>;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.headline.label}
          </label>
          <input
            type="text"
            value={state.headline}
            onChange={(e) => update({ headline: e.target.value })}
            placeholder={fields.headline.placeholder}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.bullets.label}
          </label>
          <textarea
            value={state.bullets}
            onChange={(e) => update({ bullets: e.target.value })}
            placeholder={fields.bullets.placeholder}
            rows={5}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {fields.leadEmail.label}
          </label>
          <input
            type="email"
            value={state.leadEmail}
            onChange={(e) => update({ leadEmail: e.target.value })}
            placeholder={fields.leadEmail.placeholder}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px]"
          />
        </div>
      </div>
    </div>
  );
}
```

---

**Создать `code/components/order/StepFiles.tsx`:**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import type { OrderState } from "@/app/[locale]/order/page";

export function StepFiles({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.files");

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-6">
        {/* Logo */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
            <ImageIcon className="size-4 text-[var(--accent)]" /> {t("logoLabel")}
          </label>
          {state.logoUrl ? (
            <FileChip url={state.logoUrl} onRemove={() => update({ logoUrl: "" })} />
          ) : (
            <UploadDropzone<OurFileRouter, "logoUploader">
              endpoint="logoUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) update({ logoUrl: res[0].url });
              }}
              appearance={{
                container: "border-[var(--border)] border-dashed rounded-xl bg-[var(--surface)] ut-uploading:bg-[var(--surface-elevated)]",
                button: "bg-[var(--accent)] text-[var(--accent-foreground)]",
                label: "text-[var(--foreground)]",
                allowedContent: "text-[var(--subtle)]",
              }}
            />
          )}
        </div>

        {/* Photos */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
            <ImageIcon className="size-4 text-[var(--accent)]" /> {t("photoLabel")}
          </label>
          {state.photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {state.photoUrls.map((url, i) => (
                <FileChip
                  key={i}
                  url={url}
                  onRemove={() =>
                    update({ photoUrls: state.photoUrls.filter((_, j) => j !== i) })
                  }
                />
              ))}
            </div>
          )}
          <UploadDropzone<OurFileRouter, "photoUploader">
            endpoint="photoUploader"
            onClientUploadComplete={(res) => {
              const urls = res?.map((r) => r.url) ?? [];
              update({ photoUrls: [...state.photoUrls, ...urls] });
            }}
            appearance={{
              container: "border-[var(--border)] border-dashed rounded-xl bg-[var(--surface)] ut-uploading:bg-[var(--surface-elevated)]",
              button: "bg-[var(--accent)] text-[var(--accent-foreground)]",
              label: "text-[var(--foreground)]",
              allowedContent: "text-[var(--subtle)]",
            }}
          />
        </div>

        {/* Texts */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
            <FileText className="size-4 text-[var(--accent)]" /> {t("textsLabel")}
          </label>
          {state.textsUrl ? (
            <FileChip url={state.textsUrl} onRemove={() => update({ textsUrl: "" })} />
          ) : (
            <UploadDropzone<OurFileRouter, "textsUploader">
              endpoint="textsUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) update({ textsUrl: res[0].url });
              }}
              appearance={{
                container: "border-[var(--border)] border-dashed rounded-xl bg-[var(--surface)] ut-uploading:bg-[var(--surface-elevated)]",
                button: "bg-[var(--accent)] text-[var(--accent-foreground)]",
                label: "text-[var(--foreground)]",
                allowedContent: "text-[var(--subtle)]",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FileChip({ url, onRemove }: { url: string; onRemove: () => void }) {
  const filename = url.split("/").pop() || "file";
  return (
    <div className="flex items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--foreground)] hover:text-[var(--accent)] truncate"
      >
        {filename}
      </a>
      <button
        type="button"
        onClick={onRemove}
        className="text-[var(--muted)] hover:text-[var(--danger)] shrink-0"
        aria-label="Remove file"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
```

**Дополнительно — обёртка UploadThing для SSR-сейфа:**

В `code/app/[locale]/order/page.tsx` в самом верху файла добавить:

```tsx
import "@uploadthing/react/styles.css";
```

В `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "utfs.io" },
    { protocol: "https", hostname: "*.ufs.sh" },
  ],
  dangerouslyAllowSVG: true,
  contentDispositionType: "attachment",
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},
```

(SVG нужен для рендера концептов в Step 2.)

### 4.4. UploadThing setup

```bash
npm install uploadthing @uploadthing/react
```

**Создать `code/app/api/uploadthing/core.ts`:**

```ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  logoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
  photoUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
  textsUploader: f({ "application/pdf": { maxFileSize: "4MB" }, "text/plain": { maxFileSize: "1MB" } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

**Создать `code/app/api/uploadthing/route.ts`:**

```ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

**В `StepFiles.tsx`** использовать `<UploadDropzone>` из `@uploadthing/react`.

### 4.5. Контент `/order` в `content/*.json`

Добавить новый ключ `order` со всеми лейблами и плейсхолдерами. Структура:

```json
"order": {
  "step": "Step",
  "of": "of",
  "back": "Back",
  "backToPricing": "Back to pricing",
  "next": "Next",
  "basics": {
    "title": "Tell us about you",
    "subtitle": "Takes 30 seconds.",
    "fields": {
      "name": { "label": "Your name", "placeholder": "Anna Kuznecova" },
      "business": { "label": "Your business + niche", "placeholder": "Coaching for executives, Vilnius" },
      "contact": { "label": "Telegram or phone", "placeholder": "@username or +370..." },
      "siteLocale": { "label": "Site language", "placeholder": "Pick one" }
    }
  },
  "design": {
    "title": "Choose your starting design",
    "subtitle": "We'll customize it with your brand and content. Don't worry about pixel-perfect — you can request changes.",
    "noteLabel": "Anything you want changed about it? (optional)",
    "notePlaceholder": "E.g. \"Make the hero photo darker, more masculine\"..."
  },
  "content": {
    "title": "What goes on your site",
    "subtitle": "We'll write the polished copy — you give us the substance.",
    "fields": {
      "headline": { "label": "One-sentence pitch", "placeholder": "What you do, in plain language" },
      "bullets": { "label": "3–5 key things you offer", "placeholder": "One per line" },
      "leadEmail": { "label": "Where to send leads from the form?", "placeholder": "your@email.com" }
    }
  },
  "files": {
    "title": "Files and branding",
    "subtitle": "Drop your logo, photos, existing texts. Skip anything you don't have — we'll work with what you give us.",
    "logoLabel": "Logo (SVG/PNG preferred)",
    "photoLabel": "Photos (team, work, products) — up to 10",
    "textsLabel": "Existing texts (optional — Word/PDF/Google Doc link)"
  },
  "review": {
    "title": "Confirm and pay",
    "subtitle": "After payment we'll send a Trello link where you'll see your project progress in real-time.",
    "plan": "Plan",
    "design": "Design",
    "language": "Site language",
    "bundle": "Add 6 months of Care for €60 (save €30)",
    "bundleNote": "Hosting + domain + edits for the next 6 months. Cancel anytime.",
    "total": "Total today",
    "payButton": "Pay securely with Stripe",
    "redirecting": "Redirecting to Stripe...",
    "secure": "Secure payment by Stripe. VAT applied automatically for EU companies.",
    "error": "Something went wrong. Try again or write to @balticlanding on Telegram."
  }
}
```

Переводы на LT/RU/LV/ET — в том же ключе, переводчик понимает паттерн.

---

## БЛОК 5 — Backend: /api/order + Trello + Stripe

### 5.1. /api/order — основной endpoint

**Создать `code/app/api/order/route.ts`:**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";

const OrderSchema = z.object({
  plan: z.enum(["setup", "pro"]),
  bundle: z.boolean(),
  name: z.string().min(2).max(100),
  business: z.string().min(2).max(500),
  contact: z.string().min(3).max(100),
  siteLocale: z.string(),
  designId: z.string(),
  designNote: z.string().optional(),
  headline: z.string().min(2).max(500),
  bullets: z.string().min(2).max(2000),
  leadEmail: z.string().email().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  photoUrls: z.array(z.string().url()),
  textsUrl: z.string().url().optional().or(z.literal("")),
  locale: z.string(),
});

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c]!));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = OrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // 1) Create Trello card (status: Waiting payment)
    const trelloCardId = await createTrelloCard(data);

    // 2) Create Stripe Checkout session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (data.plan === "setup") lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    if (data.plan === "pro") lineItems.push({ price: process.env.STRIPE_PRICE_SETUP_PRO!, quantity: 1 });
    if (data.bundle) lineItems.push({ price: process.env.STRIPE_PRICE_CARE_6MO!, quantity: 1 });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/${data.locale}/order/success?session_id={CHECKOUT_SESSION_ID}&card=${trelloCardId}`,
      cancel_url: `${baseUrl}/${data.locale}/order?plan=${data.plan}${data.bundle ? "&bundle=care6" : ""}`,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      metadata: { trelloCardId, plan: data.plan, bundle: data.bundle ? "yes" : "no", locale: data.locale },
    });

    // 3) Notify Telegram (fire-and-forget)
    notifyTelegram(data, trelloCardId, session.url || "");

    return NextResponse.json({ checkoutUrl: session.url, trelloCardId });
  } catch (e) {
    console.error("Order error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function createTrelloCard(data: z.infer<typeof OrderSchema>): Promise<string> {
  const key = process.env.TRELLO_API_KEY!;
  const token = process.env.TRELLO_TOKEN!;
  const listId = process.env.TRELLO_LIST_NEW!;

  const labelMap: Record<string, string> = {
    setup: process.env.TRELLO_LABEL_SETUP!,
    pro: process.env.TRELLO_LABEL_SETUP_PRO!,
  };

  const desc = `
**Plan:** ${data.plan}${data.bundle ? " + 6 months Care bundle" : ""}
**Locale:** ${data.locale} · **Site language:** ${data.siteLocale}

**Contact**
- Name: ${data.name}
- Business: ${data.business}
- Telegram/phone: ${data.contact}
- Lead email: ${data.leadEmail || "—"}

**Design choice**
- Selected: ${data.designId}
- Notes: ${data.designNote || "—"}

**Site content**
- Headline: ${data.headline}
- Bullets:
${data.bullets.split("\n").map((l) => `  - ${l}`).join("\n")}

**Files**
- Logo: ${data.logoUrl || "—"}
- Photos: ${data.photoUrls.length ? data.photoUrls.join(", ") : "—"}
- Texts: ${data.textsUrl || "—"}
`.trim();

  const params = new URLSearchParams({
    idList: listId,
    name: `${data.name} — ${data.plan.toUpperCase()} — ${data.business}`,
    desc,
    idLabels: labelMap[data.plan],
    key,
    token,
  });

  const res = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, { method: "POST" });
  if (!res.ok) throw new Error(`Trello error: ${res.status}`);
  const card = await res.json();

  // Attach logo if present
  if (data.logoUrl) {
    await fetch(`https://api.trello.com/1/cards/${card.id}/attachments?url=${encodeURIComponent(data.logoUrl)}&name=Logo&key=${key}&token=${token}`, { method: "POST" });
  }
  // Attach photos
  for (const photoUrl of data.photoUrls) {
    await fetch(`https://api.trello.com/1/cards/${card.id}/attachments?url=${encodeURIComponent(photoUrl)}&name=Photo&key=${key}&token=${token}`, { method: "POST" });
  }
  // Attach texts
  if (data.textsUrl) {
    await fetch(`https://api.trello.com/1/cards/${card.id}/attachments?url=${encodeURIComponent(data.textsUrl)}&name=Texts&key=${key}&token=${token}`, { method: "POST" });
  }

  return card.id;
}

async function notifyTelegram(data: z.infer<typeof OrderSchema>, cardId: string, checkoutUrl: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = `🔥 <b>NEW ORDER — ${data.plan.toUpperCase()}${data.bundle ? " + bundle" : ""}</b>

👤 ${esc(data.name)}
💼 ${esc(data.business)}
📞 ${esc(data.contact)}
🌍 ${data.locale.toUpperCase()} site: ${data.siteLocale.toUpperCase()}

📋 Trello: https://trello.com/c/${cardId}
💳 Status: <i>Waiting payment</i>`;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  }).catch(() => {});
}
```

### 5.2. Stripe webhook — обновление статуса в Trello

**Создать `code/app/api/webhook/stripe/route.ts`:**

```ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!sig) return NextResponse.json({ error: "No sig" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid sig" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const cardId = session.metadata?.trelloCardId;
    const amount = (session.amount_total ?? 0) / 100;

    if (cardId) {
      // Move card to "Paid (new)" list
      const params = new URLSearchParams({
        idList: process.env.TRELLO_LIST_PAID!,
        key: process.env.TRELLO_API_KEY!,
        token: process.env.TRELLO_TOKEN!,
      });
      await fetch(`https://api.trello.com/1/cards/${cardId}?${params.toString()}`, { method: "PUT" });

      // Add comment with payment info
      const commentParams = new URLSearchParams({
        text: `💰 Paid €${amount} via Stripe.\nSession: ${session.id}\nCustomer email: ${session.customer_details?.email || "—"}`,
        key: process.env.TRELLO_API_KEY!,
        token: process.env.TRELLO_TOKEN!,
      });
      await fetch(`https://api.trello.com/1/cards/${cardId}/actions/comments?${commentParams.toString()}`, { method: "POST" });
    }

    // Notify Telegram about payment
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `💰 <b>PAYMENT RECEIVED</b>\n\nAmount: €${amount}\nTrello card: https://trello.com/c/${cardId}\n\n→ Move to "In progress" when you start.`,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
```

В Stripe Dashboard добавить webhook endpoint: `https://balticlanding.com/api/webhook/stripe`, событие `checkout.session.completed`, скопировать `whsec_...` в `STRIPE_WEBHOOK_SECRET`.

### 5.3. Success page

**Создать `code/app/[locale]/order/success/page.tsx`:**

```tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const t = useTranslations("orderSuccess");
  const locale = useLocale();
  const params = useSearchParams();
  const cardId = params.get("card");

  // Clear order state from localStorage
  useEffect(() => {
    localStorage.removeItem("baltic-order-state-v1");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-8">
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="size-16 rounded-full bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-8">
          <Check className="size-8 text-[var(--accent)]" />
        </div>
        <h1 className="text-3xl md:text-5xl tracking-tight font-medium mb-4">{t("title")}</h1>
        <p className="text-lg text-[var(--muted)] mb-10">{t("subtitle")}</p>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 text-left space-y-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-2">{t("nextStep1Label")}</p>
            <p className="text-[var(--foreground)]">{t("nextStep1")}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-2">{t("nextStep2Label")}</p>
            <p className="text-[var(--foreground)]">{t("nextStep2")}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-2">{t("nextStep3Label")}</p>
            <p className="text-[var(--foreground)]">{t("nextStep3")}</p>
          </div>
        </div>

        <a
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 bg-transparent text-[var(--foreground)] border border-[var(--border-strong)] rounded-xl px-6 py-3 text-base font-medium hover:bg-[var(--surface)]"
        >
          {t("backHome")}
        </a>
      </div>
    </main>
  );
}
```

Контент `orderSuccess` в `content/*.json`:
```json
"orderSuccess": {
  "title": "Order received. Let's build.",
  "subtitle": "Payment confirmed. Here's what happens next.",
  "nextStep1Label": "Within 1 hour",
  "nextStep1": "Denis will message you on Telegram with a Trello board link.",
  "nextStep2Label": "Day 1",
  "nextStep2": "30-minute call to confirm the brief and start design.",
  "nextStep3Label": "Day 3",
  "nextStep3": "Your landing is live. You get domain + admin access.",
  "backHome": "Back to homepage"
}
```

---

## БЛОК 6 — Обновлённый FAQ

### 6.1. Новые/изменённые вопросы

Добавить и переписать в `content/*.json`, секция `faq.items`:

**Новый Q (между Q1 и Q2):**
```
Q: Шаблоны? А не custom design?
A: Да, в Setup за €200 — это «pick from 6 proven layouts», не дизайн с нуля. Это сознательное решение: за €200 невозможно сделать качественный custom design (себестоимость дизайна 4-8 часов = €120-240). Шаблоны — это не «дёшево», это другой продукт: мы наполняем готовый протестированный дизайн твоим контентом, цветами, лого. Если нужен полностью индивидуальный дизайн — Setup Pro (€500) добавляет кастомизацию, Custom (от €1200) — дизайн с нуля.
```

**Изменённый Q5 (вместо «можно ли расширить до многостраничного»):**
```
Q: А реальные сайты ваших клиентов где?
A: Пока не показываем — клиенты в основном B2B, попросили не разглашать ссылки публично. На созвоне покажу несколько живых сайтов и расскажу историю каждого. Telegram: @balticlanding.
```

(Это правда — пока у Дениса нет explicit permission показывать сайты публично. Это honest framing.)

### 6.2. FAQ про подписку — расширить

Текущий Q2 («что если перестану платить») перепиши:
```
Q: А если я перестану платить за Care?
A: Сайт остаётся твоим — ты получаешь архив кода. Но автоматически:
- Хостинг переоформляется на тебя (€10–15/мес у Vercel)
- Домен продлеваешь сам (€12–25/год)
- Любые правки — €40/час фрилансеру
- Если сайт сломается ночью — никто не починит
С Care это всё включено за €15/мес — большинство клиентов считают это дешевле, чем поддерживать самим.
```

---

## БЛОК 7 — Подключение всего вместе

### 7.1. Обновить `code/app/[locale]/page.tsx`

```tsx
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhatsIncluded } from "@/components/sections/WhatsIncluded";
import { Pricing } from "@/components/sections/Pricing";
import { Subscription } from "@/components/sections/Subscription";  // NEW
import { Comparison } from "@/components/sections/Comparison";      // NEW (вместо Portfolio)
import { Process } from "@/components/sections/Process";
import { ForWhom } from "@/components/sections/ForWhom";
import { FAQ } from "@/components/sections/FAQ";
import { ContactCTA } from "@/components/sections/ContactCTA";

// JSON-LD (см. V1 fix 2.3) — оставить как было

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  // ... JSON-LD setup as before

  return (
    <>
      {/* JSON-LD script */}
      <Hero />
      <TrustStrip />
      <WhatsIncluded />
      <Pricing />
      <Subscription />
      <Comparison />
      <Process />
      <ForWhom />
      <FAQ />
      <ContactCTA />
    </>
  );
}
```

### 7.2. Обновить Header CTA

Кнопка `Order` в Header должна вести не на `#contact`, а на `/[locale]/order?plan=setup`.

**Файл:** `code/components/layout/Header.tsx`, найти `<a href="#contact">` и заменить на:

```tsx
<a href={`/${locale}/order?plan=setup`}>...</a>
```

(использовать `useLocale()` из next-intl)

То же — для Hero primary CTA и Sticky Mobile CTA.

### 7.3. ContactCTA остаётся

Не удаляем, но позиционируем как «not ready to order? talk first». Обновить заголовок:

```json
"cta": {
  "h2": "Not ready? Let's talk.",
  "subtitle": "If you're not sure which tier fits, or want to show me your existing site first — book a 15-min call.",
  ...
}
```

---

## ✅ Чек-лист после V3

### Контент
- [ ] Pricing показывает 3 тарифа: Setup, Setup Pro, Custom
- [ ] Bundle toggle на Setup карточке («Add 6 months Care for €60»)
- [ ] Subscription секция отдельная, с annual toggle, examples и whyTable
- [ ] Portfolio секция удалена с лендинга
- [ ] Comparison таблица добавлена
- [ ] FAQ обновлён (новый Q про шаблоны, переписан Q про сайты клиентов)

### Flow
- [ ] Кнопки тарифов ведут на `/{locale}/order?plan=setup|pro`
- [ ] Custom тариф ведёт на `#contact`
- [ ] /order загружает 5-шаговый брифинг с прогресс-баром
- [ ] State сохраняется в localStorage между сессиями
- [ ] Кнопка «Pay» создаёт Trello card + Stripe Checkout session
- [ ] Stripe webhook двигает Trello card из «Waiting» в «Paid»
- [ ] /order/success показывает следующие шаги после оплаты

### Интеграции
- [ ] UploadThing работает: drag-drop логи/фото/тексты, файлы прикрепляются к Trello card
- [ ] Trello API key + token + label IDs в `.env.local`
- [ ] Stripe Products созданы в Dashboard, price IDs в `.env.local`
- [ ] Stripe webhook endpoint настроен
- [ ] Telegram уведомления приходят на каждый заказ + на каждую оплату

### Локализация
- [ ] Все строки на 5 языках присутствуют для новых секций
- [ ] Custom CTA на тарифе локализован
- [ ] Цена в формате `€200` для EN, `200 €` для LT/LV/ET/RU

### Тесты
- [ ] Тестовый заказ в Stripe test mode проходит до success page
- [ ] Trello card создаётся в правильной колонке с правильным лейблом
- [ ] При оплате карточка двигается в «Paid»
- [ ] Telegram-уведомление приходит 2 раза (на создание + на оплату)
- [ ] При cancel в Stripe — возврат на /order с сохранением состояния

---

## Приоритеты Sonnet

Если все три фикс-файла применять последовательно:

**Sprint 1 (4 часа):**
- V1 Блок 1 (cyrillic + html lang + sanitize + Hero mockup)
- V1 Блок 2 (sitemap, robots, JSON-LD, OG, privacy/terms, analytics)
- V2 Блок 1 (5→3 дня)
- V2 Блок 2 (копирайт)

**Sprint 2 (4 часа):**
- V3 Блок 1 (удалить Portfolio, добавить Comparison)
- V3 Блок 2 (3 тарифа + bundle)
- V3 Блок 3 (Subscription секция)
- V2 Блок 3 (дизайн-фиксы)

**Sprint 3 (4 часа):**
- V3 Блок 4 (/order multi-step)
- V3 Блок 5 (Trello + Stripe + webhook)
- V3 Блок 6 (FAQ)
- V3 Блок 7 (подключить всё)

**Итого:** ~12 часов работы Sonnet. По 4 часа в день = 3 дня. Запустить можно в конце 3-го дня.

Параллельно Денис делает:
- Trello board + API keys (15 минут)
- UploadThing аккаунт (10 минут)
- Stripe Products + webhook (30 минут)
- Реквизиты ЛТ фирмы или решение убрать
- 3 реальных скриншота портфолио (опционально — могут добавиться позже без code changes)
- Фото Дениса (10 минут)

Удачи 🚀
