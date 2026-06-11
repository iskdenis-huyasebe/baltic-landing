import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";

// Generate crypto-random client reference: UW-XXXXXX
// Alphabet excludes 0/O/1/I/L to avoid visual confusion
const CLIENT_REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateClientRef(): string {
  const bytes = randomBytes(6);
  const chars = Array.from(bytes).map(
    (b) => CLIENT_REF_ALPHABET[b % CLIENT_REF_ALPHABET.length]
  );
  return `UW-${chars.join("")}`;
}

const OrderSchema = z.object({
  plan: z.enum(["setup", "pro"]),
  bundle: z.boolean(),
  name: z.string().min(1).max(100),
  business: z.string().min(1).max(500),
  contact: z.string().min(1).max(100),
  siteLocale: z.string(),
  designId: z.string(),
  designNote: z.string().optional(),
  headline: z.string().min(1).max(500),
  bullets: z.string().min(1).max(2000),
  leadEmail: z.string().email().optional().or(z.literal("")),
  promo: z.string().max(64).optional(),
  subPlan: z.enum(["care", "growth", "none"]).optional(),
  subCycle: z.enum(["month", "year"]).optional(),
  locale: z.string(),
});

const subLabel = (s?: string, c?: string) => {
  if (s === "none") return "Свой хостинг (без подписки)";
  const cyc = c === "year" ? "год" : "мес";
  if (s === "care") return `Care (${cyc})`;
  if (s === "growth") return `Growth (${cyc})`;
  return "Не выбрано";
};

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

async function createTrelloCard(
  data: z.infer<typeof OrderSchema>,
  clientRef: string
): Promise<string | null> {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const listId = process.env.TRELLO_LIST_NEW;
  if (!key || !token || !listId) return null;

  const labelMap: Record<string, string | undefined> = {
    setup: process.env.TRELLO_LABEL_SETUP,
    pro: process.env.TRELLO_LABEL_SETUP_PRO,
  };

  const planLabel = data.plan === "setup" ? "Setup €200" : "Setup Pro €500";

  const desc = `CLIENT: ${clientRef}
PLAN: ${data.plan}

**План:** ${planLabel}${data.bundle ? " + 6 мес. Care" : ""}
**Подписка (2-й мес):** ${subLabel(data.subPlan, data.subCycle)}
**Язык клиента:** ${data.locale.toUpperCase()} · **Язык сайта:** ${data.siteLocale.toUpperCase()}

---

**Контакт**
- Имя: ${data.name}
- Бизнес: ${data.business}
- Telegram/телефон: ${data.contact}
- Email: ${data.leadEmail || "—"}

**Дизайн**
- Выбран: ${data.designId}
- Пожелания: ${data.designNote || "—"}

**Контент**
- Заголовок: ${data.headline}
- Ключевые пункты:
${data.bullets.split("\n").map((l) => `  - ${l.trim()}`).filter(Boolean).join("\n")}`;

  const params = new URLSearchParams({
    idList: listId,
    name: `${esc(data.name)} — ${planLabel} — ${esc(data.business)}`,
    desc,
    key,
    token,
    ...(labelMap[data.plan] ? { idLabels: labelMap[data.plan]! } : {}),
  });

  try {
    const res = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, {
      method: "POST",
    });
    if (!res.ok) {
      console.error("Trello error:", await res.text());
      return null;
    }
    const card = await res.json();
    return card.id as string;
  } catch {
    return null;
  }
}

async function attachFileToTrello(cardId: string, file: File, name: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) return;

  const form = new FormData();
  form.append("key", key);
  form.append("token", token);
  form.append("name", name);
  form.append("file", file, file.name);

  await fetch(`https://api.trello.com/1/cards/${cardId}/attachments`, {
    method: "POST",
    body: form,
  }).catch(() => {});
}

async function notifyTelegram(
  data: z.infer<typeof OrderSchema>,
  cardId: string | null,
  checkoutUrl: string,
  isTest = false,
  clientRef = ""
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const planLabel = data.plan === "setup" ? "Setup €200" : "Setup Pro €500";
  const header = isTest
    ? `🧪 <b>ТЕСТОВЫЙ ЗАКАЗ — ${planLabel}${data.bundle ? " + Care" : ""}</b>`
    : `🔥 <b>НОВЫЙ ЗАКАЗ — ${planLabel}${data.bundle ? " + Care" : ""}</b>`;

  const text = `${header}

🔑 ${clientRef || "—"}
👤 ${esc(data.name)}
💼 ${esc(data.business)}
📞 ${esc(data.contact)}
🌍 ${data.locale.toUpperCase()} → сайт: ${data.siteLocale.toUpperCase()}
🎨 Дизайн: ${data.designId}
🔁 Подписка (2-й мес): ${subLabel(data.subPlan, data.subCycle)}

${cardId ? `📋 Trello: https://trello.com/c/${cardId}` : "⚠️ Trello не настроен"}
💳 Статус: <i>${isTest ? "ТЕСТ — без оплаты (промокод)" : "Ожидает оплаты"}</i>`;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const parsed = OrderSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // 0. Generate client reference number
    const clientRef = generateClientRef();

    // 1. Создать карточку в Trello
    const trelloCardId = await createTrelloCard(data, clientRef);

    // 2. Прикрепить файлы к карточке
    if (trelloCardId) {
      const logo = formData.get("logo");
      if (logo instanceof File) {
        await attachFileToTrello(trelloCardId, logo, `logo — ${logo.name}`);
      }
      let i = 0;
      while (true) {
        const photo = formData.get(`photo_${i}`);
        if (!(photo instanceof File)) break;
        await attachFileToTrello(trelloCardId, photo, `фото ${i + 1} — ${photo.name}`);
        i++;
      }
      const texts = formData.get("texts");
      if (texts instanceof File) {
        await attachFileToTrello(trelloCardId, texts, `тексты — ${texts.name}`);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unoweb.eu";

    // 3. Internal test promo — skip payment, jump straight to success (full client journey)
    const TEST_CODE = (process.env.TEST_PROMO_CODE || "UNOWEB-TEST").toUpperCase();
    if (data.promo && data.promo.trim().toUpperCase() === TEST_CODE) {
      const successUrl = `${baseUrl}/${data.locale}/order/success?test=1&ref=${clientRef}`;
      notifyTelegram(data, trelloCardId, successUrl, true, clientRef);
      return NextResponse.json({ checkoutUrl: successUrl, clientRef });
    }

    // 4. Stripe Checkout (real payment)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-01-27.acacia" as import("stripe").Stripe.LatestApiVersion,
    });

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    if (data.plan === "setup") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    } else {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP_PRO!, quantity: 1 });
    }
    if (data.bundle) {
      lineItems.push({ price: process.env.STRIPE_PRICE_CARE_6MO!, quantity: 1 });
    }

    const stripeLocale = (["lt", "lv", "et", "ru"].includes(data.locale) ? data.locale : "en") as
      import("stripe").Stripe.Checkout.SessionCreateParams.Locale;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/${data.locale}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${data.locale}/order?plan=${data.plan}${data.bundle ? "&bundle=care6" : ""}`,
      locale: stripeLocale,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      // save the card + create a customer so the webhook can auto-start the subscription with a trial
      customer_creation: "always",
      payment_intent_data: { setup_future_usage: "off_session" },
      metadata: {
        trelloCardId: trelloCardId || "",
        clientRef,
        plan: data.plan,
        bundle: data.bundle ? "yes" : "no",
        subPlan: data.subPlan || "none",
        subCycle: data.subCycle || "month",
        locale: data.locale,
        clientName: data.name,
        clientEmail: data.leadEmail || "",
      },
    });

    // 4. Уведомить в Telegram
    notifyTelegram(data, trelloCardId, session.url || "", false, clientRef);

    return NextResponse.json({ checkoutUrl: session.url, clientRef });
  } catch (e) {
    console.error("Order error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
