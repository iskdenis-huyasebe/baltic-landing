# Deploy: GitHub → Vercel

Три шага. Открой Terminal и запусти по порядку.

---

## Шаг 1 — Git init + первый коммит

```bash
cd "/Users/Denis/Documents/Claude/Projects/Сайт за 100/code"

git init
git branch -m main
git add -A
git commit -m "feat: initial Baltic Landing Service website"
```

---

## Шаг 2 — Создать GitHub репо и запушить

**Вариант A** — если установлен `gh` (GitHub CLI):
```bash
gh repo create baltic-landing --public --source=. --remote=origin --push
```

**Вариант B** — вручную (GitHub.com → New repository):
1. Перейди на https://github.com/new
2. Repository name: `baltic-landing`
3. Нажми "Create repository"
4. Скопируй URL репо (например `https://github.com/iskdenis/baltic-landing.git`)
5. Выполни:
```bash
git remote add origin https://github.com/iskdenis/baltic-landing.git
git push -u origin main
```

---

## Шаг 3 — Подключить Vercel

1. Зайди на https://vercel.com/new
2. Нажми **"Import Git Repository"**
3. Выбери `baltic-landing`
4. Framework: **Next.js** (определится автоматически)
5. Нажми **Deploy**

Vercel сам сделает сборку. После деплоя — URL вида `baltic-landing.vercel.app`.

---

## Шаг 4 — Добавить переменные окружения (после деплоя)

В настройках проекта на Vercel: **Settings → Environment Variables**

```
TELEGRAM_BOT_TOKEN=     ← получи у @BotFather в Telegram
TELEGRAM_CHAT_ID=       ← твой chat_id (узнай через @userinfobot)
RESEND_API_KEY=         ← resend.com → API Keys
RESEND_FROM_EMAIL=      ← hello@balticlanding.com (после верификации домена)
RESEND_TO_EMAIL=        ← iskdenis@gmail.com
NEXT_PUBLIC_SITE_URL=   ← https://твойдомен.com
```

После добавления — нажми **Redeploy**.

---

## При каждом следующем обновлении сайта:

```bash
cd "/Users/Denis/Documents/Claude/Projects/Сайт за 100/code"
git add -A
git commit -m "update: описание изменений"
git push
```

Vercel автоматически задеплоит через ~1 минуту.
