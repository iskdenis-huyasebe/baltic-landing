// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

async function moveTrelloCard(cardId: string, listId: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) return;
  await fetch(`https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idList: listId }) }
  ).catch(() => {});
}

async function notifyTelegram(session: Stripe.Checkout.Session) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  const { clientRef, clientName, plan, bundle } = session.metadata ?? {};
  const amount = session.amount_total ? `€${(session.amount_total / 100).toFixed(0)}` : "?";
  const planLabel = plan === "pro" ? "Setup Pro €500" : "Setup €200";
  const text = `✅ <b>ОПЛАТА ПОЛУЧЕНА — ${planLabel}${bundle === "yes" ? " + Care" : ""}</b>\n\n🔑 ${clientRef || "—"}\n👤 ${clientName || "—"}\n💳 Сумма: ${amount}\n📋 Trello: карточка перемещена → Оплачено`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { trelloCardId } = session.metadata ?? {};
    const paidListId = process.env.TRELLO_LIST_PAID;
    if (trelloCardId && paidListId) await moveTrelloCard(trelloCardId, paidListId);
    await notifyTelegram(session);
  }
  return NextResponse.json({ received: true });
}
