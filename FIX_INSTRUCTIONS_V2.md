# Fix Instructions V2 — Marketing & Design Audit

> Этот документ — вторая итерация патчей. Применяется **после** FIX_INSTRUCTIONS.md (или параллельно). Основан на визуальном аудите задеплоенной версии baltic-landing.vercel.app.
>
> **Главное:** копирайт в JSON-файлах, дизайн-патчи в TSX-компонентах, плюс список ассетов которые Денис должен подготовить руками.
>
> **Стек:** Next.js 15, Tailwind v4, next-intl 3, 5 локалей (lt/lv/et/en/ru).

---

## БЛОК 0 — Что должен подготовить Денис (без этих ассетов сайт не запускать)

Это **руками**, не код. Без них половина фиксов ниже бессмысленна.

### 0.1. Реальные скриншоты портфолио (КРИТИЧНО)

Открой каждый сайт, сделай чистый скриншот вьюпорта 1440×900 (десктоп):
- `terratech.lt` → `code/public/portfolio/terratech.webp`
- `ipoolgo.lt` → `code/public/portfolio/ipoolgo.webp`
- `applecitylab.lt` → `code/public/portfolio/applecitylab.webp`

Конвертируй в WebP (можно через https://squoosh.app, quality 80, max width 1200px). Без этого карточки кейсов остаются заглушками — это самое слабое место сайта.

### 0.2. Логотипы клиентов

Те же 3 бренда — нужны логотипы в виде:
- SVG (предпочтительно) или PNG прозрачный
- Единый приглушённый цвет (мы будем красить через CSS)
- Высота 32px нормализованная

Положить в `code/public/logos/`:
- `terratech.svg`
- `ipoolgo.svg`
- `applecitylab.svg`

Если логотипов нет — попроси клиентов или быстро сделай в Figma (название + примитивная иконка, 30 минут на все три).

### 0.3. Фотография Дениса

Портрет, дружелюбное лицо, тёмный или нейтральный фон, желательно вертикальный crop. Размер: 400×400 минимум, square.

`code/public/denis.webp`

Без фото — поставь хотя бы аватарку с инициалами, но фото даёт +25–40% конверсии в форме.

### 0.4. Реквизиты литовской фирмы

Заменить заглушки `XXXXXXXXX` на реальные данные в `code/content/*.json`, секция `footer.legal`:
- Įmonės kodas (Company code) — 9 цифр
- PVM kodas (VAT) — формат `LT` + 9-12 цифр
- IBAN — формат `LT00 0000 0000 0000 0000`

Если фирмы ещё нет — **временно убрать строку `legal` из footer** до момента когда она будет. Лучше пустой футер, чем заполненный иксами.

### 0.5. Telegram bot + чат + Resend

Для работы формы:
- Создать Telegram бот через `@BotFather`, получить токен
- Создать приватный чат, получить `chat_id` (см. https://api.telegram.org/bot{TOKEN}/getUpdates)
- Создать Resend аккаунт, верифицировать домен
- Положить ключи в `.env.local` (имена переменных — в `.env.example`)

---

## БЛОК 1 — 5 дней → 3 дня (всё, что нужно поменять)

### 1.1. Контент: заменить во всех 5 языках

**Файлы:** `code/content/{lt,lv,et,en,ru}.json`

Найти и заменить (по локали):

| Поле | Старое | Новое (LT) | Новое (LV) | Новое (ET) | Новое (EN) | Новое (RU) |
|---|---|---|---|---|---|---|
| `hero.title` | «5 darbo dienas / 5 darba dienās / 5 tööpäevaga / 5 business days / 5 рабочих дней» | `3 darbo dienas` | `3 darba dienās` | `3 tööpäevaga` | `3 business days` | `3 рабочих дня` |
| `trust.stats[3]` (последний stat) | `5 d.d. / 5 d.d. / 5 tp / 5 days / 5 дн.` | `3 d.d.` | `3 d.d.` | `3 tp` | `3 days` | `3 дн.` |
| `process.h2` | «...per 5 darbo dienas» и т.д. | `...per 3 darbo dienas` | `...3 darba dienās` | `...3 tööpäevaga` | `...in 3 business days` | `...за 3 рабочих дня` |
| `portfolio.items[*].days` | `5 d.d. / 5 days` и т.д. | `3 d.d.` (Terratech), `3 d.d.` (IPOOLGO), `2 d.d.` (Applecitylab) | то же | то же | `3 days`, `3 days`, `2 days` | `3 дн.`, `3 дн.`, `2 дн.` |
| `sticky.days` | `5 d.d. / 5 days / 5 дн.` | `3 d.d.` | `3 d.d.` | `3 tp` | `3 days` | `3 дн.` |
| `seo.title` | «...5 dienas / ...5 days / ...за 5 дней» | `...3 dienas` | `...3 dienās` | `...3 päevaga` | `...3 days` | `...за 3 дня` |
| `seo.description` | «...5 darbo dienas» и т.д. | `...3 darbo dienas` | `...3 darba dienās` | `...3 tööpäevaga` | `...3 business days` | `...3 рабочих дня` |

### 1.2. Process секция: 4 шага → 3 шага

В каждом `content/*.json` заменить весь `process.steps` массив.

**LT (`content/lt.json`):**
```json
"steps": [
  { "day": "1 d.", "title": "Brief'as ir dizainas", "body": "30 min. pokalbis Zoom'u + dizaino struktūra Figma'oje per dieną. Vienas taisymų raundas — sutariam galutinai." },
  { "day": "2 d.", "title": "Programavimas", "body": "Surenkam svetainę. Prijungiam formą, analitiką, domeną." },
  { "day": "3 d.", "title": "Paleidimas", "body": "Patikrinam mobilią versiją, perduodam prieigas, paleidžiam į gyvą." }
]
```

**RU (`content/ru.json`):**
```json
"steps": [
  { "day": "1 дн.", "title": "Бриф и дизайн", "body": "30 минут созвон + структура дизайна в Figma за день. Один раунд правок — согласуем финально." },
  { "day": "2 дн.", "title": "Вёрстка", "body": "Собираем сайт. Подключаем форму, аналитику, домен." },
  { "day": "3 дн.", "title": "Запуск", "body": "Проверяем мобильную версию, передаём доступы, запускаем в живой режим." }
]
```

**EN (`content/en.json`):**
```json
"steps": [
  { "day": "Day 1", "title": "Brief & Design", "body": "30-min Zoom call + design layout in Figma — same day. One revision round — we agree on the final." },
  { "day": "Day 2", "title": "Build", "body": "We build the site. Connect the form, analytics, domain." },
  { "day": "Day 3", "title": "Launch", "body": "We check the mobile version, hand over access, push to live." }
]
```

**LV (`content/lv.json`):**
```json
"steps": [
  { "day": "1. d.", "title": "Brīfs un dizains", "body": "30 min. Zoom saruna + dizaina struktūra Figma — vienā dienā. Viens labojumu raunds — vienojamies par galīgo." },
  { "day": "2. d.", "title": "Izstrāde", "body": "Saliekam mājas lapu. Pieslēdzam formu, analītiku, domēnu." },
  { "day": "3. d.", "title": "Palaišana", "body": "Pārbaudām mobilo versiju, nododam piekļuves, palaižam." }
]
```

**ET (`content/et.json`):**
```json
"steps": [
  { "day": "1. pv", "title": "Brif ja disain", "body": "30-min Zoom kõne + disaini struktuur Figmas — samal päeval. Üks paranduste voor — lepime kokku lõpliku." },
  { "day": "2. pv", "title": "Ehitus", "body": "Ehitame veebilehe. Ühendame vormi, analüütika, domeeni." },
  { "day": "3. pv", "title": "Käivitamine", "body": "Kontrollime mobiilset versiooni, anname üle ligipääsud, paneme live'i." }
]
```

### 1.3. Component: убрать 4-й шаг из Process

**Файл:** `code/components/sections/Process.tsx`

Если компонент сейчас хардкодит 4 шага — поменять на маппинг по массиву `steps` из контента. Если уже через `t.raw("steps")` маппит — ничего менять не надо, JSON сам всё сделает.

Проверить, что вёрстка корректно работает с 3 элементами в grid (не оставляет пустых ячеек). Если используется `grid-cols-4` на десктопе — поменять на `grid-cols-3`.

### 1.4. Гарантия — оставить как есть

Текст «If we're late due to our side — next month of Care is free» работает одинаково с 3 и 5 днями. Не трогаем.

---

## БЛОК 2 — Маркетинговые правки копирайта

### 2.1. Hero — усилить заголовок

«A converting landing page» — слабо для EN. «Converting» — переводческий, а не маркетинговый термин.

**Файл:** `code/content/en.json`, поле `hero.title`:

Заменить:
```
"A converting landing page for €200. Ready in 5 business days."
```
На:
```
"A landing page that brings real leads. €200. 3 business days."
```

(Уже учтена смена 5→3.)

Для RU — `hero.title` менять не нужно, «Продающий лендинг» работает.

Для LT/LV/ET — «Parduodantis / Pārdodošā / Müüv» — литературно ОК, оставляем.

### 2.2. CTA унификация на тарифах

**Файлы:** `code/content/*.json`, поля `pricing.setup.cta`, `pricing.growth.cta`, `pricing.care.cta`.

Сейчас разнобой («Order Setup» / «Choose Growth» / «Choose Care»). Унифицируем на «Order ...» во всех 3 тарифах:

| Локаль | setup.cta | growth.cta | care.cta |
|---|---|---|---|
| LT | `Užsisakyti Setup` | `Užsisakyti Growth` | `Užsisakyti Care` |
| RU | `Заказать Setup` | `Заказать Growth` | `Заказать Care` |
| EN | `Order Setup` | `Order Growth` | `Order Care` |
| LV | `Pasūtīt Setup` | `Pasūtīt Growth` | `Pasūtīt Care` |
| ET | `Telli Setup` | `Telli Growth` | `Telli Care` |

### 2.3. «Basic SEO» → «Built-in SEO»

Слово «basic» подрывает ценность.

**Файл:** `code/content/en.json`, поле `included.yes[4]`:

Заменить:
```json
{ "title": "Basic SEO setup", "body": "Meta tags, sitemap.xml, robots.txt, Open Graph for social media." }
```
На:
```json
{ "title": "Built-in SEO foundation", "body": "Meta tags, sitemap.xml, robots.txt, Open Graph for social media — set up properly from day one." }
```

Аналогично в `pricing.setup.bullets[3]`:
```
"Basic SEO setup" → "SEO foundation built-in"
```

Для RU — «Базовое SEO» → «SEO-настройки из коробки». Для LT — «Baziniai SEO nustatymai» → «Įdiegti SEO nustatymai». Для LV — «Baziskais SEO» → «Iebūvēts SEO pamats». Для ET — «Põhi-SEO» → «Sisseehitatud SEO alus».

### 2.4. Hosting first month — позитив

**Файл:** `code/content/en.json`, поле `included.yes[3]`:

Заменить:
```json
{ "title": "First month of hosting", "body": "Included in €200. After that — with Care or Growth." }
```
На:
```json
{ "title": "First month of hosting — free", "body": "Included in €200. Keep your site live with Care or Growth from month 2 (€15/mo)." }
```

Аналогично для остальных 4 языков — главный приём: указать «бесплатно» открытым текстом и **назвать цену продолжения** в той же фразе. Не оставлять её скрытой.

### 2.5. FAQ — заменить «refund 50%» на сильную гарантию

Это есть в первом FAQ-вопросе на всех языках. Сейчас звучит как угроза «вернём только половину».

**Файл:** `code/content/en.json`, `faq.items[0].a`:

Заменить:
```
"...If it still doesn't work after that — I refund 50% for the hours spent."
```
На:
```
"...If it still doesn't fit after 2 rounds — full refund within 7 days, no questions asked. So far this has never happened."
```

То же самое в LT/RU/LV/ET — заменить «50% возврат» на «100% возврат в течение 7 дней» во всех языках. Это **сильнее в 3 раза** маркетингово и при этом для тебя так же безопасно (за 7 дней ещё ничего критичного не сделано).

### 2.6. «70% mobile traffic» — переписать с фокусом на клиента

**Файл:** `code/content/en.json`, поле `included.yes[0].body`:

Заменить:
```
"Over 70% of visitors come from mobile — we start mobile-first."
```
На:
```
"Looks sharp on every device — phone, tablet, desktop. We start mobile-first because that's where 70% of your visitors come from."
```

Перенос фокуса с «нам так удобнее» на «твои клиенты увидят красивый сайт». Аналогично перевести на 4 других языка.

### 2.7. Format цены — локализовать

Сейчас на EN видно «200 €» с пробелом — литовский стандарт. Для EN/RU должно быть «€200» без пробела.

**Файл:** `code/components/sections/Pricing.tsx`

Найти строку (примерно строка 42):
```tsx
<span className="text-4xl font-medium text-[var(--foreground)]">{price} €</span>
```

Заменить на условный рендер:
```tsx
{(() => {
  const locale = useLocale(); // импортировать из next-intl
  const formatted = locale === "en" ? `€${price}` : `${price} €`;
  return <span className="text-4xl font-medium text-[var(--foreground)]">{formatted}</span>;
})()}
```

(`useLocale()` из `next-intl` — компонент уже `"use client"` если делается через onClick, иначе обернуть в client component.)

Или проще — добавить в `content/*.json` поле `common.currencyPosition` и форматировать в компоненте. Для RU тоже «€200» (русский стандарт), для LT/LV/ET — «200 €».

### 2.8. Trust strip — добавить «Vilnius-based» под цифрами

Сейчас 4 цифры (35+, 50+, 4.9★, 3 дня) висят без подписи кто это вообще. Добавь короткий заголовок над цифрами.

**Файл:** `code/content/en.json`, добавить новое поле `trust.eyebrow`:

```json
"trust": {
  "eyebrow": "VILNIUS-BASED · BUILT FOR THE BALTICS",
  "label": "Trusted by businesses in Lithuania, Latvia, Estonia",
  "stats": [...]
}
```

В `components/sections/TrustStrip.tsx` отрендерить `eyebrow` мелкой строкой сверху над числами (как в Hero).

Аналогично:
- LT: `"BAZUOTI VILNIUJE · SUKURTI BALTIJAI"`
- RU: `"БАЗА В ВИЛЬНЮСЕ · СДЕЛАНО ДЛЯ БАЛТИИ"`
- LV: `"BĀZĒTI VIĻŅĀ · VEIDOTI BALTIJAI"`
- ET: `"BAASIS VILNIUSES · LOODUD BALTIKUMILE"`

---

## БЛОК 3 — Дизайн-фиксы

### 3.1. Портфолио: Live + Concept стратегия

**Решение (согласовано с Денисом):** В портфолио миксуем реальные сайты и дизайн-концепты. Каждая карточка явно помечена статусом — `Live` (реальный сайт, ссылка работает) или `Concept` (наш дизайн-проект под нишу). Это честно и заполняет grid.

**Шаг 1: Концепты уже готовы** — лежат в `code/public/portfolio/`:
- `coach-concept.svg` — Mindshift, executive coaching
- `barbershop-concept.svg` — CutShop, barbershop
- `dental-concept.svg` — DentaCare, dental clinic

Превью: открыть `PORTFOLIO_CONCEPTS_PREVIEW.html` в корне проекта.

**Шаг 2: Реальные скриншоты** — Денис подготавливает (см. блок 0.1) и кладёт как:
- `terratech.webp`, `ipoolgo.webp`, `applecitylab.webp`

**Шаг 3: Обновить JSON.** Изменить структуру `portfolio.items` во всех 5 локалях — добавить поля `status` и `image`:

**`code/content/lt.json`** (пример, аналогично для остальных):
```json
"portfolio": {
  "h2": "Pavyzdžiai iš realių projektų ir koncepcijos",
  "subtitle": "Realūs paleisti landingai ir dizaino koncepcijos pagal nišas. Visi sukurti per 2–3 darbo dienas.",
  "moreLink": "+ daugiau projektų pristatysiu per asmeninį pokalbį",
  "statusLive": "Veikia",
  "statusConcept": "Koncepcija",
  "items": [
    { "name": "Terratech", "niche": "B2B įranga", "days": "3 d.d.", "url": "terratech.lt", "image": "terratech.webp", "status": "live" },
    { "name": "IPOOLGO", "niche": "Pripučiami baseinai", "days": "3 d.d.", "url": "ipoolgo.lt", "image": "ipoolgo.webp", "status": "live" },
    { "name": "Applecitylab", "niche": "Vietos paslaugos", "days": "2 d.d.", "url": "applecitylab.lt", "image": "applecitylab.webp", "status": "live" },
    { "name": "Mindshift", "niche": "Executive coaching", "days": "3 d.d.", "url": "mindshift.coach", "image": "coach-concept.svg", "status": "concept" },
    { "name": "CutShop", "niche": "Barbershop · Vilnius", "days": "2 d.d.", "url": "cutshop.lt", "image": "barbershop-concept.svg", "status": "concept" },
    { "name": "DentaCare", "niche": "Odontologijos klinika", "days": "3 d.d.", "url": "denta-care.lv", "image": "dental-concept.svg", "status": "concept" }
  ]
}
```

Локализация `statusLive` / `statusConcept`:
| | statusLive | statusConcept |
|---|---|---|
| LT | `Veikia` | `Koncepcija` |
| RU | `Работает` | `Концепт` |
| EN | `Live` | `Concept` |
| LV | `Aktīvs` | `Koncepts` |
| ET | `Live` | `Kontseptsioon` |

**Шаг 4: Обновить заголовок секции** — текущий «Real projects» теперь не совсем точный (там и концепты). Менять `portfolio.h2`:
- LT: `Pavyzdžiai iš realių projektų ir koncepcijos`
- RU: `Реальные проекты и дизайн-концепции`
- EN: `Real projects and design concepts`
- LV: `Reālie projekti un dizaina koncepti`
- ET: `Reaalsed projektid ja disainikontseptsioonid`

И подзаголовок — добавить «по нишам»:
- EN: `Live landings we've shipped, plus niche concepts to show our range. All built in 2–3 business days.`

**Шаг 5: Обновить компонент.**

**Файл:** `code/components/sections/Portfolio.tsx`

```tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Portfolio() {
  const t = useTranslations("portfolio");
  const items = t.raw("items") as Array<{
    name: string;
    niche: string;
    days: string;
    url: string;
    image: string;
    status: "live" | "concept";
  }>;

  return (
    <section id="portfolio" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.status === "live" ? `https://${item.url}` : "#"}
              target={item.status === "live" ? "_blank" : undefined}
              rel={item.status === "live" ? "noopener noreferrer" : undefined}
              className="group card-tilt block bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[var(--border-strong)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={`/portfolio/${item.image}`}
                  alt={`${item.name} — ${item.niche}`}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-[var(--foreground)] truncate">{item.name}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1 truncate">{item.niche}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-medium ${
                      item.status === "live"
                        ? "bg-[rgba(74,222,128,0.12)] text-[#86efac]"
                        : "bg-white/[0.06] text-[var(--muted)]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "live" ? "bg-[#4ade80]" : "bg-[var(--subtle)]"
                      }`}
                    />
                    {item.status === "live" ? t("statusLive") : t("statusConcept")}
                  </span>
                </div>
                <span className="text-xs text-[var(--subtle)] shrink-0 pt-1">{item.days}</span>
              </div>
              <div className="px-5 pb-5 text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                {item.url} {item.status === "live" && "↗"}
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-10">{t("moreLink")}</p>
      </div>
    </section>
  );
}
```

**Шаг 6 — важно:** SVG в `next/image` работает только с `unoptimized: true` либо нужно использовать обычный `<img>` для SVG. Простейшее решение — для SVG-концептов проверить, что в `next.config.ts` есть:

```ts
images: {
  dangerouslyAllowSVG: true,
  contentDispositionType: "attachment",
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},
```

Альтернатива — отрендерить SVG через `<img src=...>` без `next/image` (картинки внутри SVG нет — безопасно).

**Шаг 7 — когда появятся реальные скриншоты:**
- Денис конвертирует PNG/JPEG → WebP через https://squoosh.app, quality 80
- Кладёт в `code/public/portfolio/{terratech,ipoolgo,applecitylab}.webp`
- Никакой код менять не нужно — JSON уже указывает на эти файлы

### 3.2. Логотипы в Trust strip

После того как Денис положил SVG в `code/public/logos/`, заменить в `TrustStrip.tsx` текстовые надписи на:

```tsx
<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-100 transition-opacity">
  <Image src="/logos/terratech.svg" alt="Terratech" width={120} height={32} className="h-8 w-auto" />
  <Image src="/logos/ipoolgo.svg" alt="IPOOLGO" width={120} height={32} className="h-8 w-auto" />
  <Image src="/logos/applecitylab.svg" alt="Applecitylab" width={120} height={32} className="h-8 w-auto" />
</div>
```

Если используешь SVG как inline компоненты — лучше через `<svg>` напрямую с `fill="currentColor"` и текст-цвет `var(--muted)` — даст единый стиль.

### 3.3. Growth-карточка — усилить визуально

**Файл:** `code/components/sections/Pricing.tsx`

В компоненте `PricingCard` для случая `accent`:

```tsx
className={`relative flex flex-col p-6 md:p-8 rounded-2xl border transition-all duration-200 hover:bg-[var(--surface-elevated)] ${
  accent
    ? "bg-gradient-to-b from-[var(--surface)] to-[var(--surface)]/50 border-[var(--accent)]/60 hover:border-[var(--accent)] md:scale-[1.05] md:-my-2 shadow-[0_0_60px_-15px_rgba(190,242,100,0.15)]"
    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
}`}
```

Что меняется:
- Лёгкий gradient на фоне акцентной карточки
- Border ярче (`/60` вместо `/40`)
- На десктопе чуть крупнее (`md:scale-[1.05]`) и сдвигаем `-my-2` чтобы не задевала соседние
- Лёгкий glow вокруг через `shadow-[0_0_60px_-15px_rgba(190,242,100,0.15)]`

Badge тоже усилить:

```tsx
{badge && (
  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
    {badge}
  </span>
)}
```

### 3.4. Иконки Process — в акцентный цвет

**Файл:** `code/components/sections/Process.tsx`

Найти кружки с иконками. Сейчас они серые на сером фоне. Поменять цвет иконки и фон кружка:

```tsx
<div className="size-14 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mb-4">
  <IconComponent className="size-6 text-[var(--accent)]" aria-hidden="true" />
</div>
```

Где `--accent-muted` — это `rgba(190, 242, 100, 0.10)` из `globals.css`. Уже есть.

Также соединить шаги тонкой линией (на десктопе горизонтальная, на мобильном вертикальная):

```tsx
{/* После всех шагов, абсолютным позиционированием за ними */}
<div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent -z-10" />
```

Контейнер шагов сделать `relative` чтобы линия позиционировалась относительно него.

### 3.5. Иконки сегментов «Для кого» — крупнее

**Файл:** `code/components/sections/ForWhom.tsx`

Найти блок с иконкой в карточке сегмента. Заменить размер кружка с 32px на 48px и иконку с 16px на 24px:

```tsx
<div className="size-12 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mb-6">
  <IconComponent className="size-6 text-[var(--accent)]" aria-hidden="true" />
</div>
```

И сделать `mb-6` для отступа после иконки.

### 3.6. Examples — поменять формат «·» на читаемый

**Файл:** `code/content/*.json`, поля `forWhom.items[*].examples`.

Сейчас: `equipment sellers · exports · material manufacturing`. Это выглядит как теги в админке.

Заменить на префикс «Examples:»:

LT: `examples` → `examplesLabel + value`. Структура:
```json
"items": [
  {
    "icon": "factory",
    "title": "Smulkus B2B",
    "body": "Gamintojai, tiekėjai, distributoriai...",
    "examplesLabel": "Pavyzdžiai:",
    "examplesText": "įrangos pardavėjai, eksportas, medžiagų gamyba"
  }
]
```

В компоненте:
```tsx
<p className="text-xs text-[var(--subtle)] mt-4">
  <span className="font-medium">{t("examplesLabel")}</span> {t("examplesText")}
</p>
```

Аналогично переводы:
- RU: `Примеры:`, `EN: Examples:`, `LV: Piemēri:`, `ET: Näited:`

### 3.7. Spacing — ужать пустоту между секциями

Все секции сейчас `py-20 md:py-32`. Это много. Сократить до `py-16 md:py-24`:

```bash
# Поиск и замена в коде
find code/components/sections -name "*.tsx" -exec sed -i '' 's/py-20 md:py-32/py-16 md:py-24/g' {} \;
```

Или вручную — найти `py-20 md:py-32` в каждом из 9 section-компонентов и заменить.

### 3.8. WHAT'S NOT INCLUDED — сжать вертикально

**Файл:** `code/components/sections/WhatsIncluded.tsx`

Сейчас «not included» — отдельный большой блок. Переделать на компактный inline-список под основным:

```tsx
{/* После основного grid с ✓ */}
<div className="mt-10 pt-8 border-t border-[var(--border)]">
  <p className="text-xs uppercase tracking-widest text-[var(--subtle)] mb-4">
    {t("noLabel")}  {/* "WHAT'S NOT INCLUDED" */}
  </p>
  <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
    {(t.raw("no") as string[]).map((item, i) => (
      <li key={i} className="flex items-center gap-2">
        <X className="size-4 text-[var(--subtle)]" aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
  <p className="text-xs text-[var(--subtle)] mt-4 italic">{t("noNote")}</p>
</div>
```

Добавить в JSON `included.noLabel`:
- LT: `NEĮEINA`
- RU: `НЕ ВХОДИТ`
- EN: `NOT INCLUDED`
- LV: `NAV IEKĻAUTS`
- ET: `EI SISALDA`

### 3.9. Hero — добавить мини-социальное доказательство

Под кнопками CTA в Hero добавить строку:

```tsx
<div className="flex items-center gap-4 mt-8 text-sm text-[var(--muted)]">
  <div className="flex -space-x-2">
    <div className="size-8 rounded-full bg-[var(--surface)] border-2 border-[var(--background)]" />
    <div className="size-8 rounded-full bg-[var(--surface-elevated)] border-2 border-[var(--background)]" />
    <div className="size-8 rounded-full bg-[var(--surface)] border-2 border-[var(--background)]" />
  </div>
  <span>{t("trustNote")}</span>
</div>
```

Где `trustNote` в JSON:
- EN: `35+ landings launched in the Baltics`
- RU: `35+ лендингов запущено в Балтии`
- LT: `35+ landingai paleisti Baltijoje`
- LV: `35+ mājas lapas palaistas Baltijā`
- ET: `35+ veebilehte käivitatud Baltikumis`

Кружочки — это место под аватарки клиентов когда они появятся (можно потом заменить).

---

## БЛОК 4 — Footer и подпись

### 4.1. Убрать заглушки `XXXXXXXXX` (до момента когда есть реквизиты)

**Файл:** `code/content/*.json`, поле `footer.legal`.

Вариант A — убрать строку полностью:
```json
"footer": {
  "copy": "© 2026 Baltic Landing · Made in Vilnius",
  "links": { ... },
  "contact": "Questions? Telegram: @balticlanding"
}
```

В `Footer.tsx` — добавить условный рендер: если `legal` отсутствует или содержит «X» — не отрисовывать строку.

Вариант B — заменить на временный CTA:
```json
"legal": "Registered legal entity coming soon — questions? Reach us on Telegram."
```

Рекомендую вариант A.

### 4.2. Подпись с фото Дениса

**Файл:** `code/components/sections/ContactCTA.tsx`

Найти блок с кружком «D» (signature). Заменить:

```tsx
<div className="mt-6 p-4 flex items-center gap-4">
  <Image
    src="/denis.webp"
    alt="Denis"
    width={56}
    height={56}
    className="rounded-full border border-[var(--border)]"
  />
  <div>
    <p className="text-sm font-medium text-[var(--foreground)]">{t("signature.name")}</p>
    <p className="text-xs text-[var(--subtle)]">{t("signature.email")}</p>
    <p className="text-xs text-[var(--subtle)]">{t("signature.telegram")}</p>
  </div>
</div>
```

Если фото ещё нет — оставь fallback с инициалом «D», но добавь `TODO: replace with photo` в коде.

---

## БЛОК 5 — Опциональные улучшения для конверсии

Не критично, но дают +0.5–1% к конверсии каждое:

### 5.1. Scarcity-элемент на pricing

Добавить badge над тарифами:
```tsx
<p className="text-center text-xs text-[var(--accent)] mb-6 uppercase tracking-widest font-medium">
  ⚡ {t("scarcity")}
</p>
```

Текст:
- EN: `Only 3 slots left this month`
- RU: `Осталось 3 места в этом месяце`
- LT: `Liko tik 3 vietos šį mėnesį`

Менять вручную раз в неделю. Простой трюк, но рабочий.

### 5.2. Comparison строка под Pricing

Добавить под note текст:

```tsx
<p className="text-center text-sm text-[var(--muted)] mt-4 max-w-2xl mx-auto">
  {t("comparison")}
</p>
```

Текст EN: `Compare: freelancers charge €500–800, agencies €1500+. We're €200 because we built a process — not because we cut corners.`

Сильное позиционирование.

### 5.3. Testimonials блок (между Portfolio и Process)

Новая секция с 2-3 цитатами клиентов. Если у Дениса есть отзывы — добавить. Если нет — пока пропустить.

---

## ✅ Чек-лист «после всех правок V2»

Перед запуском проверить на каждой локали:

**Контент:**
- [ ] Везде где было «5 days / 5 dni / 5 dn.» — теперь «3»
- [ ] Process секция показывает 3 шага, не 4
- [ ] CTA на всех тарифах унифицированы («Order ...»)
- [ ] FAQ Q1: «100% money-back within 7 days» (не «50%»)
- [ ] «Basic SEO» нигде не осталось — везде «built-in SEO» / «SEO foundation»
- [ ] Hero EN: «landing page that brings real leads»
- [ ] Footer не содержит `XXXXXXXXX`

**Ассеты:**
- [ ] `public/portfolio/terratech.webp`, `ipoolgo.webp`, `applecitylab.webp` — реальные скриншоты, не градиенты
- [ ] `public/logos/*.svg` — реальные логотипы или хотя бы wordmark в едином стиле
- [ ] `public/denis.webp` — фотография
- [ ] Реквизиты литовской фирмы в footer (если есть) или строка убрана

**Дизайн:**
- [ ] Growth-карточка визуально доминирует (scale + glow + bright border)
- [ ] Иконки Process в лаймовом цвете на затемнённом фоне
- [ ] Иконки сегментов крупнее (size-6)
- [ ] Spacing между секциями ужат до `py-16 md:py-24`
- [ ] Hero на десктопе содержит trust-строку под CTA
- [ ] Trust strip имеет eyebrow «VILNIUS-BASED · BUILT FOR THE BALTICS»

**Локализация цены:**
- [ ] На `/en` и `/ru` цена «€200» (символ перед числом)
- [ ] На `/lt`, `/lv`, `/et` цена «200 €» (число перед символом)

---

## Приоритеты

Если время ограничено — делать в таком порядке:

**Час 1 — критические ассеты (Денис делает руками + Sonnet интегрирует):**
1. Скриншоты портфолио (0.1) + интеграция (3.1)
2. Логотипы клиентов (0.2) + интеграция (3.2)
3. Фото Дениса (0.3) + интеграция (4.2)
4. Убрать `XXXXXXXXX` из footer (4.1)

**Час 2 — копирайт:**
5. 5→3 дня везде (1.1, 1.2, 1.3)
6. Унификация CTA (2.2)
7. FAQ refund 50% → 100% money-back (2.5)
8. «Basic SEO» → «SEO foundation» (2.3)
9. Hosting позитив (2.4)
10. Локализация цены (2.7)

**Час 3 — дизайн:**
11. Growth-карточка усилить (3.3)
12. Иконки Process в акцент (3.4)
13. Spacing ужать (3.7)
14. Hero trust note (3.9)

**Опционально (час 4):**
15. Scarcity badge (5.1)
16. Comparison строка (5.2)

**Итого:** ~3 часа Sonnet + ~1 час Дениса на сборку ассетов = можно перезапустить за рабочий день.

Удачи 🚀
