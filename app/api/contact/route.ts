import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  business: z.string().min(2).max(500),
  contact: z.string().min(3).max(100),
  site: z.string().url().optional().or(z.literal("")),
  locale: z.string().optional(),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, business, contact, site, locale } = parsed.data;

    const safe = {
      name: escapeHtml(name),
      business: escapeHtml(business),
      contact: escapeHtml(contact),
      site: site ? escapeHtml(site) : "",
      locale: locale || "unknown",
    };

    // Telegram notification (non-blocking)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const tgText = `🔥 <b>New lead — ${safe.locale.toUpperCase()}</b>\n\n👤 <b>${safe.name}</b>\n💼 ${safe.business}\n📞 ${safe.contact}${safe.site ? `\n🌐 ${safe.site}` : ""}\n\n⏰ Reply within 1 hour.`;
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: tgText,
          parse_mode: "HTML",
        }),
      }).catch((err) => console.error("Telegram error:", err));
    }

    // Resend email (non-blocking)
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendTo = process.env.RESEND_TO_EMAIL;
    const resendFrom = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && resendTo && resendFrom) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      resend.emails
        .send({
          from: resendFrom,
          to: resendTo,
          subject: `New lead (${safe.locale.toUpperCase()}): ${safe.name}`,
          html: `
            <h2>New lead from Baltic Landing — ${safe.locale.toUpperCase()}</h2>
            <p><b>Name:</b> ${safe.name}</p>
            <p><b>Business:</b> ${safe.business}</p>
            <p><b>Contact:</b> ${safe.contact}</p>
            ${safe.site ? `<p><b>Current site:</b> <a href="${safe.site}">${safe.site}</a></p>` : ""}
            <hr/>
            <p style="color:#999;font-size:12px">Sent via balticlanding.com contact form</p>
          `,
        })
        .catch((err) => console.error("Resend error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
