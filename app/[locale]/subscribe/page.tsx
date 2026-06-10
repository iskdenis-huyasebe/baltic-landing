"use client";

import { useState, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, ShieldCheck, ArrowLeft } from "lucide-react";

type Plan = "care" | "growth";

function SubscribeInner() {
  const t = useTranslations("subscribe");
  const ts = useTranslations("subscriptions");
  const locale = useLocale();
  const params = useSearchParams();

  const initial = (params.get("plan") as Plan) === "growth" ? "growth" : "care";
  const [plan, setPlan] = useState<Plan>(initial);
  const [cycle, setCycle] = useState<"month" | "year">(params.get("cycle") === "year" ? "year" : "month");
  const [clientRef, setClientRef] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prices: Record<Plan, string> = { care: "15", growth: "30" };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientRef.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, cycle, locale, clientRef: clientRef.trim(), email: email.trim(), contact: contact.trim() }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(t("error")); setLoading(false); }
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  };

  const field =
    "w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 min-h-[48px]";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-28 pb-16 px-6 md:px-8">
      <div className="max-w-md mx-auto">
        <a href={`/${locale}#subscriptions`} className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8">
          <ArrowLeft className="size-4" /> {t("back")}
        </a>

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">{t("h1")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <form onSubmit={submit} className="space-y-5" noValidate>
          {/* Billing cycle toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
              {(["month", "year"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    cycle === c ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {c === "month" ? ts("cycleMonth") : ts("cycleYear")}
                </button>
              ))}
            </div>
          </div>

          {/* Plan toggle */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("planLabel")}</label>
            <div className="grid grid-cols-2 gap-2">
              {(["care", "growth"] as const).map((p) => {
                const active = plan === p;
                const monthly = parseInt(prices[p], 10);
                const shown = cycle === "year" ? Math.round(monthly * 12 * 0.7) : monthly;
                const per = cycle === "year" ? ts("perYear") : (ts.raw(p) as { period: string }).period;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-medium">{(ts.raw(p) as { title: string }).title}</span>
                      {active && <Check className="size-4 text-[var(--accent)]" />}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {locale === "en" ? `€${shown}` : `${shown} €`}
                      {per}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("clientLabel")} <span className="text-[var(--danger)]">*</span>
            </label>
            <input value={clientRef} onChange={(e) => setClientRef(e.target.value)} placeholder={t("clientPlaceholder")} className={field} />
            <p className="text-xs text-[var(--subtle)] mt-1.5">{t("clientHint")}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("emailLabel")} <span className="text-[var(--danger)]">*</span>
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} className={field} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("contactLabel")}</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t("contactPlaceholder")} className={field} />
          </div>

          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !clientRef.trim() || !email.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-4 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
          >
            {loading ? t("submitting") : t("submit")}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-[var(--subtle)]">
            <ShieldCheck className="size-3.5" /> {t("secure")}
          </div>
          <p className="text-center text-xs text-[var(--subtle)]">
            <a href={`/${locale}/order`} className="hover:text-[var(--accent)] transition-colors underline underline-offset-2">
              {t("noClient")}
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--muted)]">Loading...</div>}>
      <SubscribeInner />
    </Suspense>
  );
}
