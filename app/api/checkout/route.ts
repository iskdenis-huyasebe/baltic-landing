import { NextResponse } from "next/server";

type Plan = "setup" | "care" | "growth" | "setup+care" | "setup+growth";

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

async function notifySubscription(
  plan: string,
  clientRef: string,
  email: string,
  contact: string,
  locale: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  const text = `🔁 <b>НОВАЯ ПОДПИСКА — ${plan.toUpperCase()}</b>

🆔 Клиент: ${esc(clientRef) || "—"}
✉️ ${esc(email) || "—"}
📞 ${esc(contact) || "—"}
🌍 ${locale.toUpperCase()}
💳 Статус: <i>Ожидает оплаты</i>`;
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
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-01-27.acacia" as import("stripe").Stripe.LatestApiVersion,
    });

    const {
      plan,
      locale = "lt",
      cycle = "month",
      clientRef = "",
      email = "",
      contact = "",
    } = (await request.json()) as {
      plan: Plan;
      locale?: string;
      cycle?: "month" | "year";
      clientRef?: string;
      email?: string;
      contact?: string;
    };

    const carePrice = cycle === "year" ? process.env.STRIPE_PRICE_CARE_YEAR : process.env.STRIPE_PRICE_CARE;
    const growthPrice = cycle === "year" ? process.env.STRIPE_PRICE_GROWTH_YEAR : process.env.STRIPE_PRICE_GROWTH;

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let mode: "payment" | "subscription" = "payment";

    if (plan === "setup") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    } else if (plan === "care") {
      lineItems.push({ price: carePrice!, quantity: 1 });
      mode = "subscription";
    } else if (plan === "growth") {
      lineItems.push({ price: growthPrice!, quantity: 1 });
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unoweb.eu";
    const stripeLocale = (["lt", "lv", "et", "ru"].includes(locale) ? locale : "en") as
      import("stripe").Stripe.Checkout.SessionCreateParams.Locale;

    const metadata = { plan, cycle, clientRef, locale, type: "subscription" };

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${baseUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/subscribe?plan=${plan}`,
      locale: stripeLocale,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      ...(email ? { customer_email: email } : {}),
      metadata,
      ...(mode === "subscription"
        ? { subscription_data: { metadata, trial_period_days: 30 } }
        : {}),
    });

    if (mode === "subscription") {
      notifySubscription(plan, clientRef, email, contact, locale);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
