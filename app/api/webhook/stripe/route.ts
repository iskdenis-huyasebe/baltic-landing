import { NextResponse } from "next/server";

async function moveTrelloCard(cardId: string, newListId: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token || !cardId || !newListId) return;

  await fetch(
    `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${newListId}`,
    { method: "PUT" }
  ).catch(() => {});
}

async function addTrelloComment(cardId: string, text: string) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token || !cardId) return;

  await fetch(
    `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${key}&token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  ).catch(() => {});
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!sig) return NextResponse.json({ error: "Missing sig" }, { status: 400 });

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-01-27.acacia" as import("stripe").Stripe.LatestApiVersion,
    });

    let event: import("stripe").Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Stripe webhook signature error:", err);
      return NextResponse.json({ error: "Invalid sig" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as import("stripe").Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email ?? "—";
      const customerName = session.customer_details?.name ?? "—";
      const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
      const currency = (session.currency ?? "eur").toUpperCase();
      const trelloCardId = session.metadata?.trelloCardId;
      const plan = session.metadata?.plan ?? "—";
      const clientName = session.metadata?.clientName ?? customerName;

      // 1. Move Trello card: Waiting payment → Paid (new)
      const paidListId = process.env.TRELLO_LIST_PAID;
      if (trelloCardId && paidListId) {
        await moveTrelloCard(trelloCardId, paidListId);
        await addTrelloComment(
          trelloCardId,
          `✅ Payment confirmed\n💳 ${amount} ${currency}\n📧 ${customerEmail}\n🆔 Stripe session: ${session.id}`
        );
      }

      // 2. Telegram notification
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (token && chatId) {
        const trelloLink = trelloCardId
          ? `\n📋 Trello: https://trello.com/c/${trelloCardId}`
          : "\n⚠️ Trello card not found";
        const text = `💰 <b>PAID — ${plan.toUpperCase()}</b>\n\n👤 ${clientName}\n📧 ${customerEmail}\n💵 ${amount} ${currency}${trelloLink}\n🆔 ${session.id}`;
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
