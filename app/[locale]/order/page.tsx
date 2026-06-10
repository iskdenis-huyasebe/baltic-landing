"use client";

import { useState, useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StepPlan } from "@/components/order/StepPlan";
import { StepBasics } from "@/components/order/StepBasics";
import { StepDesign } from "@/components/order/StepDesign";
import { StepContent } from "@/components/order/StepContent";
import { StepFiles } from "@/components/order/StepFiles";
import { StepReview } from "@/components/order/StepReview";

export type OrderState = {
  plan: "setup" | "pro";
  bundle: boolean;
  subPlan: "care" | "growth" | "none";
  subCycle: "month" | "year";
  name: string;
  business: string;
  contact: string;
  siteLocale: string;
  designId: string;
  designNote: string;
  headline: string;
  bullets: string;
  leadEmail: string;
  promo: string;
  locale: string;
};

export type OrderFiles = {
  logo?: File;
  photos: File[];
  texts?: File;
};

const STORAGE_KEY = "unoweb-order-v2";
const TOTAL_STEPS = 5;

function OrderPageInner() {
  const locale = useLocale();
  const t = useTranslations("order");
  const params = useSearchParams();

  const initialBundle = params.get("bundle") === "care6";
  const initialDesign = params.get("design") || "";

  // Step 0 = plan selection; steps 1-5 = form
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OrderState>({
    plan: "setup",
    bundle: initialBundle,
    subPlan: "care",
    subCycle: "month",
    name: "", business: "", contact: "", siteLocale: locale,
    designId: initialDesign, designNote: "", headline: "", bullets: "", leadEmail: "",
    promo: "",
    locale,
  });

  // Files are NOT in localStorage — File objects can't be serialized
  const [files, setFiles] = useState<OrderFiles>({ photos: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          bundle: initialBundle,
          ...(initialDesign ? { designId: initialDesign } : {}),
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const update = (patch: Partial<OrderState>) => setState((s) => ({ ...s, ...patch }));

  const formStep = step; // 1–5 when in form
  const progress = (formStep / TOTAL_STEPS) * 100;

  const canProceed = (() => {
    if (step === 1) return !!(state.name && state.business && state.contact);
    if (step === 2) return !!state.designId;
    if (step === 3) return !!(state.headline && state.bullets);
    return true;
  })();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Step 0 — Plan selection */}
        {step === 0 && (
          <>
            <div className="mb-10">
              <StepPlan state={state} update={update} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <a
                href={`/${locale}#pricing`}
                className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
              >
                <ArrowLeft className="size-4" /> {t("backToPricing")}
              </a>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-3 text-base font-medium transition-all hover:opacity-90 min-h-[44px]"
              >
                {t("next")}
              </button>
            </div>
          </>
        )}

        {/* Steps 1–5 — Form */}
        {step >= 1 && (
          <>
            {/* Progress bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-2">
                <span>{t("step")} {formStep} {t("of")} {TOTAL_STEPS}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-[var(--surface)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: "var(--accent)" }}
                />
              </div>
            </div>

            {/* Step content */}
            <div className="mb-10">
              {step === 1 && <StepBasics state={state} update={update} />}
              {step === 2 && <StepDesign state={state} update={update} />}
              {step === 3 && <StepContent state={state} update={update} />}
              {step === 4 && <StepFiles files={files} setFiles={setFiles} />}
              {step === 5 && <StepReview state={state} update={update} files={files} />}
            </div>

            {/* Navigation */}
            {step < TOTAL_STEPS && (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
                >
                  <ArrowLeft className="size-4" /> {t("back")}
                </button>
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-3 text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--muted)]">Loading...</div>}>
      <OrderPageInner />
    </Suspense>
  );
}
