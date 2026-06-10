"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

type PlanId = "setup" | "pro" | "custom";

const PLAN_IDS: PlanId[] = ["setup", "pro", "custom"];

export function StepPlan({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.plan");
  const locale = useLocale();
  const router = useRouter();

  const plans = t.raw("plans") as {
    id: PlanId;
    name: string;
    price: string;
    badge?: string;
    desc: string;
    features: string[];
    cta: string;
  }[];

  const handleSelect = (id: PlanId) => {
    if (id === "custom") {
      router.push(`/${locale}#contact`);
      return;
    }
    update({ plan: id });
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
        {t("title")}
      </h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = plan.id !== "custom" && state.plan === plan.id;
          const isCustom = plan.id === "custom";

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelect(plan.id)}
              className={`relative text-left rounded-2xl border p-5 transition-all flex flex-col gap-3 ${
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-muted)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)] px-3 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div>
                <p className="text-sm font-medium text-[var(--muted)] mb-0.5">{plan.name}</p>
                <p className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                  {plan.price}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">{plan.desc}</p>
              </div>

              <ul className="space-y-1.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <Check
                      className={`size-4 mt-0.5 shrink-0 ${
                        isCustom ? "text-[var(--subtle)]" : "text-[var(--accent)]"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <span
                className={`mt-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : isCustom
                    ? "border border-[var(--border)] text-[var(--muted)] bg-transparent"
                    : "border border-[var(--border)] text-[var(--foreground)] bg-transparent hover:bg-[var(--surface-elevated)]"
                }`}
              >
                {isSelected ? "✓ " : ""}
                {plan.cta}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
