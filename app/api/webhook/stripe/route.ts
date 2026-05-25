import { NextResponse } from "next/server";

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
      const customerEmail = session.customer_details?.email;
      const amount = (session.amount_total ?? 0) / 100;

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
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
