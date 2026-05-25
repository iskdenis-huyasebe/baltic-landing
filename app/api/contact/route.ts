import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, business, contact, site } = body;

    if (!name || !business || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Telegram notification
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const message = `🔥 <b>New lead — Baltic Landing</b>\n\n👤 <b>${name}</b>\n💼 ${business}\n📞 ${contact}${site ? `\n🌐 ${site}` : ""}\n\n⏰ Reply within 1 hour.`;
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChatId, text: message, parse_mode: "HTML" }),
      }).catch(() => {}); // Non-blocking
    }

    // Resend email notification
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendTo = process.env.RESEND_TO_EMAIL;
    const resendFrom = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && resendTo && resendFrom) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: resendFrom,
        to: resendTo,
        subject: `New lead: ${name} — Baltic Landing`,
        html: `<h2>New lead</h2><p><b>Name:</b> ${name}</p><p><b>Business:</b> ${business}</p><p><b>Contact:</b> ${contact}</p>${site ? `<p><b>Site:</b> <a href="${site}">${site}</a></p>` : ""}`,
      }).catch(() => {}); // Non-blocking
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
