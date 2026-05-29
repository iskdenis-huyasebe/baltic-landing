# Sonnet Prompt — Baltic Landing Fix Session

> Этот файл — точка входа для Sonnet. В новом чате Денис открывает папку `code/` и копирует промт из секции **PROMPT** ниже. Всё остальное Sonnet прочитает сам.

---

## PROMPT (скопировать в чат Sonnet — целиком)

```
Привет. Это проект Baltic Landing — лендинг-сервис для рынков Литвы, Латвии, Эстонии на Next.js 15 + Tailwind v4 + next-intl (5 локалей: lt, lv, et, en, ru).

Сайт уже задеплоен на baltic-landing.vercel.app. По итогам аудита есть список патчей в двух файлах:

1. `FIX_INSTRUCTIONS.md` — критические технические фиксы (cyrillic subset для русского, <html lang> per locale, sanitize формы, SEO infrastructure, Stripe интеграция, мокап в Hero)

2. `FIX_INSTRUCTIONS_V2.md` — маркетинговые и дизайн фиксы по итогам визуального аудита (смена 5 дней → 3 дня во всех 5 языках, унификация CTA, усиление Growth-карточки, иконки Process в акцент, ужать spacing, фото Дениса, реквизиты)

3. `FIX_INSTRUCTIONS_V3.md` — стратегический pivot: 3 тарифа (Setup €200 / Setup Pro €500 / Custom €1200+), удалить Portfolio, добавить Comparison таблицу, переработать Subscription с annual discount и bundle, новая страница /order с 5-шаговым брифом, интеграция Trello + UploadThing + Stripe Checkout

Задача: применить ВСЕ патчи из трёх файлов в указанном там порядке приоритета.

Важные правила:
- Не изобретать — следовать инструкциям буквально, готовые сниппеты использовать as is
- Не трогать строки которые в инструкциях не упомянуты
- Сохранить структуру папок и имена компонентов
- Когда инструкция требует подготовить ассеты руками (фото Дениса, реальные скриншоты портфолио, реквизиты фирмы) — проверить наличие файла в public/. Если нет — оставить TODO в коде, не выдумывать заглушки. Исключение: SVG-концепты для портфолио (coach-concept.svg, barbershop-concept.svg, dental-concept.svg) уже лежат в public/portfolio/ — их использовать.

После применения — запустить `npm run build`, убедиться что проходит без ошибок, потом запустить `npm run dev` и пройтись по чек-листу в конце каждого FIX-файла.

Порядок применения — по спринтам из конца V3:

Sprint 1 (фундамент):
- V1 Блок 1 (cyrillic + html lang + sanitize + Hero mockup)
- V1 Блок 2 (sitemap, robots, JSON-LD, OG, privacy/terms, analytics)
- V2 Блок 1 (5→3 дня во всех 5 языках)
- V2 Блок 2 (копирайт)

Sprint 2 (структурный pivot):
- V3 Блок 1 (удалить Portfolio с лендинга, добавить Comparison)
- V3 Блок 2 (3 тарифа + bundle на Setup)
- V3 Блок 3 (Subscription секция отдельная)
- V2 Блок 3 (дизайн-фиксы)

Sprint 3 (flow + интеграции):
- V3 Блок 4 (/order multi-step брифинг)
- V3 Блок 5 (Trello + UploadThing + Stripe + webhook)
- V3 Блок 6 (FAQ обновление)
- V3 Блок 7 (подключение в page.tsx)

V1 Блок 3 (старая Stripe инструкция на 1 тариф) — пропустить, теперь её заменяет V3 Блок 5.
```

---

## Что лежит в этой папке (`code/`) — для самопроверки Sonnet

| Файл/папка | Что это |
|---|---|
| `SONNET_PROMPT.md` | **Этот файл — точка входа** |
| `FIX_INSTRUCTIONS.md` | Технические фиксы (критика + SEO + Stripe) |
| `FIX_INSTRUCTIONS_V2.md` | Маркетинг + дизайн фиксы |
| `README.md` | Базовый README проекта |
| `DEPLOY.md` | Заметки по деплою на Vercel |
| `app/` | Next.js App Router (layouts, pages, api routes) |
| `components/sections/` | 9 секций лендинга |
| `components/layout/` | Header, Footer, LanguageSwitcher, StickyMobileCTA |
| `content/{lt,lv,et,en,ru}.json` | Контент всех 5 локалей |
| `i18n/` | next-intl конфиг |
| `public/portfolio/` | 3 SVG-концепта (coach, barbershop, dental) + место под реальные скриншоты |
| `.env.example` | Шаблон переменных окружения |

---

## Чего Sonnet НЕ должен делать

- Не запускать `npm install` если `node_modules/` уже есть
- Не менять Next.js версию (сейчас 15, специально)
- Не переписывать ни одну секцию «с нуля» — только точечные правки
- Не подключать новые UI-библиотеки (shadcn, headless-ui, radix) — сейчас всё кастомное и так работает
- Не трогать структуру i18n routing (`/lt` default, locale префиксы всегда)
- Не подключать Stripe пока (FIX_INSTRUCTIONS.md Блок 3 пропустить)

---

## Что Денис должен подготовить ДО или ПАРАЛЛЕЛЬНО с фиксами Sonnet

Без этого половина V2-фиксов будет иметь TODO-placeholder'ы:

- [ ] `public/portfolio/terratech.webp` — скриншот terratech.lt (1440×900 → WebP quality 80)
- [ ] `public/portfolio/ipoolgo.webp` — скриншот ipoolgo.lt
- [ ] `public/portfolio/applecitylab.webp` — скриншот applecitylab.lt
- [ ] `public/logos/terratech.svg`, `ipoolgo.svg`, `applecitylab.svg` — лого клиентов (если нет — wordmark текстом)
- [ ] `public/denis.webp` — портрет Дениса для подписи в форме (400×400)
- [ ] Реквизиты литовской фирмы (Įmonės kodas, PVM, IBAN) — для footer в `content/*.json`. Если фирмы нет — Sonnet оставит footer без этой строки

Эти ассеты Sonnet сам не сделает (картинки требуют исходников). Где их подложить — указано в FIX_INSTRUCTIONS_V2.md Блок 0.

---

## После завершения работы Sonnet

1. `npm run build` — должно пройти без ошибок
2. `npm run dev` → пройтись по чек-листам в конце обоих FIX-файлов
3. Если Lighthouse Performance < 90 — Sonnet может предложить оптимизацию изображений или код-сплиттинг
4. Деплой через `git push` (Vercel автодеплоит из main ветки)

---

## История версий патчей

- **v1** (FIX_INSTRUCTIONS.md) — выпущена после первого аудита кода. Технические баги, SEO, Stripe.
- **v2** (FIX_INSTRUCTIONS_V2.md) — выпущена после визуального аудита задеплоенной версии. Маркетинг, дизайн, 5→3 дня, портфолио с концептами.
