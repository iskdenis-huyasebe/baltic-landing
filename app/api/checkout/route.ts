import { NextResponse } from "next/server";

type Plan = "setup" | "care" | "growth" | "setup+care" | "setup+growth";

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

    const { plan, locale = "lt" } = (await request.json()) as {
      plan: Plan;
      locale?: string;
    };

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let mode: "payment" | "subscription" = "payment";

    if (plan === "setup") {
      lineItems.push({ price: process.env.STRIPE_PRICE_SETUP!, quantity: 1 });
    } else if (plan === "care") {
      lineItems.push({ price: process.env.STRIPE_PRICE_CARE!, quantity: 1 });
      mode = "subscription";
    } else if (plan === "growth") {
      lineItems.push({ price: process.env.STRIPE_PRICE_GROWTH!, quantity: 1 });
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balticlanding.com";
    const stripeLocale = (["lt", "lv", "et", "ru"].includes(locale) ? locale : "en") as
      import("stripe").Stripe.Checkout.SessionCreateParams.Locale;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${baseUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}#pricing`,
      locale: stripeLocale,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
