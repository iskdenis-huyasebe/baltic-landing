import { NextResponse } from "next/server";
import { z } from "zod";

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
  logoUrl: z.string().optional(),
  photoUrls: z.array(z.string()),
  textsUrl: z.string().optional(),
  locale: z.string(),
});

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

async function createTrelloCard(data: z.infer<typeof OrderSchema>): Promise<string | null> {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const listId = process.env.TRELLO_LIST_NEW;
  if (!key || !token || !listId) return null;

  const labelMap: Record<string, string | undefined> = {
    setup: process.env.TRELLO_LABEL_SETUP,
    pro: process.env.TRELLO_LABEL_SETUP_PRO,
  };

  const desc = `**Plan:** ${data.plan}${data.bundle ? " + 6mo Care bundle" : ""}
**Locale:** ${data.locale} · **Site language:** ${data.siteLocale}

**Contact**
- Name: ${data.name}
- Business: ${data.business}
- Telegram/phone: ${data.contact}
- Lead email: ${data.leadEmail || "—"}

**Design**
- Selected: ${data.designId}
- Notes: ${data.designNote || "—"}

**Content**
- Headline: ${data.headline}
- Key points:
${data.bullets.split("\n").map((l) => `  - ${l}`).join("\n")}

**Files**
- Logo: ${data.logoUrl || "—"}
- Photos: ${data.photoUrls.filter((u) => u !== "skip").join(", ") || "—"}
- Texts: ${data.textsUrl || "—"}`;

  const params = new URLSearchParams({
    idList: listId,
    name: `${esc(data.name)} — ${data.plan.toUpperCase()} — ${esc(data.business)}`,
    desc,
    key,
    token,
    ...(labelMap[data.plan] ? { idLabels: labelMap[data.plan]! } : {}),
  });

  try {
    const res = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, {
      method: "POST",
    });
    if (!res.ok) return null;
    const card = await res.json();
    return card.id as string;
  } catch {
    return null;
  }
}

async function notifyTelegram(
  data: z.infer<typeof OrderSchema>,
  cardId: string | null,
  checkoutUrl: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = `🔥 <b>NEW ORDER — ${data.plan.toUpperCase()}${data.bundle ? " + bundle" : ""}</b>

👤 ${esc(data.name)}
💼 ${esc(data.business)}
📞 ${esc(data.contact)}
🌍 ${data.locale.toUpperCase()} → site: ${data.siteLocale.toUpperCase()}
🎨 Design: ${data.designId}

${cardId ? `📋 Trello: https://trello.com/c/${cardId}` : "⚠️ Trello not configured"}
💳 Status: <i>Awaiting payment</i>`;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = OrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // 1. Create Trello card
    const trelloCardId = await createTrelloCard(data);

    // 2. Stripe checkout
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-01-27.acacia" as import("stripe").Stripe.LatestApiVersion,
    });

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (data.plan === "setup") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    } else if (data.plan === "pro") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP_PRO!, quantity: 1 });
    }

    if (data.bundle) {
      lineItems.push({ price: process.env.STRIPE_PRICE_CARE_6MO!, quantity: 1 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";
    const stripeLocale = (["lt", "lv", "et", "ru"].includes(data.locale) ? data.locale : "en") as
      import("stripe").Stripe.Checkout.SessionCreateParams.Locale;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/${data.locale}/order/success?session_id={CHECKOUT_SESSION_ID}${trelloCardId ? `&card=${trelloCardId}` : ""}`,
      cancel_url: `${baseUrl}/${data.locale}/order?plan=${data.plan}${data.bundle ? "&bundle=care6" : ""}`,
      locale: stripeLocale,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      metadata: {
        trelloCardId: trelloCardId || "",
        plan: data.plan,
        bundle: data.bundle ? "yes" : "no",
        locale: data.locale,
        clientName: data.name,
      },
    });

    // 3. Notify Telegram
    notifyTelegram(data, trelloCardId, session.url || "");

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("Order error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
