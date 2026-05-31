"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Send, Check, Mail, MessageCircle, Instagram, Phone, ArrowUpRight } from "lucide-react";

// Fill in to show each channel (empty = hidden). Telegram & Email come from the signature below.
const WHATSAPP = ""; // phone digits incl. country code, e.g. "37061234567"
const MESSENGER = ""; // facebook page/username for m.me/<username>
const VIBER = ""; // phone digits incl. country code, e.g. "37061234567"
const INSTAGRAM = ""; // instagram username for ig.me/m/<username>

export function ContactCTA() {
  const t = useTranslations("cta");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", business: "", contact: "", site: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("required");
    if (!form.business.trim()) e.business = t("required");
    if (!form.contact.trim()) e.contact = t("required");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (res.ok) { setStatus("success"); }
      else { setStatus("error"); }
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = (name: string) =>
    `w-full bg-[var(--surface)] border rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors duration-200 hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[44px] ${
      errors[name] ? "border-[var(--danger)]" : "border-[var(--border)]"
    }`;

  const fields = t.raw("fields") as Record<string, { label: string; placeholder: string }>;

  const tgHandle = t("signature.telegram").replace("@", "");
  const email = t("signature.email");
  const messengers = [
    { name: "Telegram", handle: t("signature.telegram"), href: `https://t.me/${tgHandle}`, color: "#229ED9", Icon: Send },
    ...(WHATSAPP ? [{ name: "WhatsApp", handle: `+${WHATSAPP}`, href: `https://wa.me/${WHATSAPP}`, color: "#25D366", Icon: MessageCircle }] : []),
    ...(MESSENGER ? [{ name: "Messenger", handle: "Facebook", href: `https://m.me/${MESSENGER}`, color: "#0084FF", Icon: MessageCircle }] : []),
    ...(VIBER ? [{ name: "Viber", handle: `+${VIBER}`, href: `viber://chat?number=%2B${VIBER}`, color: "#7360F2", Icon: Phone }] : []),
    ...(INSTAGRAM ? [{ name: "Instagram", handle: `@${INSTAGRAM}`, href: `https://ig.me/m/${INSTAGRAM}`, color: "#E1306C", Icon: Instagram }] : []),
    { name: "Email", handle: email, href: `mailto:${email}`, color: "var(--accent)", Icon: Mail },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 px-6 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
            {t("h2")}
          </h2>
          <p className="text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Form */}
          <div>
            <p className="text-sm font-medium text-[var(--foreground)] mb-6">{t("formTitle")}</p>

            {status === "success" ? (
              <div className="p-6 bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-2xl flex items-start gap-3">
                <Check className="size-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--foreground)]">{t("successMsg")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {(["name", "business", "contact", "site"] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      {fields[key].label}
                      {key !== "site" && (
                        <span className="text-[var(--danger)] ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder={fields[key].placeholder}
                      value={form[key]}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, [key]: e.target.value }));
                        if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
                      }}
                      className={fieldClass(key)}
                    />
                    {errors[key] && (
                      <p className="text-xs text-[var(--danger)] mt-1.5">{errors[key]}</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-4 text-base font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {status === "loading" ? t("submitting") : t("submit")}
                </button>

                {status === "error" && (
                  <p className="text-sm text-[var(--danger)]">{t("errorMsg")}</p>
                )}

                <p className="text-xs text-[var(--subtle)]">{t("replyNote")}</p>
              </form>
            )}
          </div>

          {/* Messengers */}
          <div className="flex flex-col">
            <div className="p-6 md:p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex-1">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center mb-5">
                <MessageCircle className="size-5 text-[var(--accent)]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">{t("directTitle")}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{t("directSubtitle")}</p>

              <div className="flex flex-col gap-3">
                {messengers.map((m) => (
                  <a
                    key={m.name}
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--surface-elevated)] min-h-[56px]"
                  >
                    <span
                      className="size-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${m.color} 16%, transparent)`, color: m.color }}
                    >
                      <m.Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--foreground)]">{m.name}</span>
                      <span className="text-xs text-[var(--muted)]">{m.handle}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--subtle)] ml-auto group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div className="mt-6 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-lg font-medium text-[var(--accent)]">
                D
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{t("signature.name")}</p>
                <p className="text-xs text-[var(--subtle)]">{t("signature.email")}</p>
                <p className="text-xs text-[var(--subtle)]">{t("signature.telegram")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
