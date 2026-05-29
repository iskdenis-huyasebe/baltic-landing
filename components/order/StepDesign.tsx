"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

type Design = {
  id: string;
  name: string;
  niche: string;
  status: "live" | "concept";
  accent: string;
};

const DESIGNS: Design[] = [
  { id: "terratech", name: "Terratech", niche: "B2B equipment / industrial", status: "live", accent: "#bef264" },
  { id: "ipoolgo", name: "IPOOLGO", niche: "E-commerce / seasonal", status: "live", accent: "#60a5fa" },
  { id: "applecitylab", name: "Applecitylab", niche: "Local services", status: "live", accent: "#fb923c" },
  { id: "coach", name: "Mindshift", niche: "Coaching / private specialists", status: "concept", accent: "#a78bfa" },
  { id: "barbershop", name: "CutShop", niche: "Barbershop / lifestyle", status: "concept", accent: "#34d399" },
  { id: "dental", name: "DentaCare", niche: "Clinic / health", status: "concept", accent: "#f472b6" },
];

function DesignPreview({ design, selected }: { design: Design; selected: boolean }) {
  return (
    <div
      className="aspect-[16/10] relative overflow-hidden rounded-t-xl"
      style={{ background: "linear-gradient(160deg, #1a1a1a 0%, #111 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${design.accent} 0%, transparent 65%)` }}
      />
      <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 h-7" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="size-2 rounded-full bg-red-400/50" />
        <div className="size-2 rounded-full bg-yellow-400/50" />
        <div className="size-2 rounded-full bg-green-400/50" />
        <div className="flex-1 mx-3 rounded-full h-3.5" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="absolute inset-0 pt-8 px-4 pb-3 flex flex-col gap-2">
        <div className="h-1.5 rounded-full w-12" style={{ background: design.accent, opacity: 0.9 }} />
        <div className="h-4 rounded bg-white/10 w-3/4" />
        <div className="h-2 rounded bg-white/5 w-1/2" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 rounded-lg" style={{ background: design.accent }} />
          <div className="h-6 w-16 rounded-lg border border-white/15" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded p-1.5 space-y-1" style={{ background: `${design.accent}15`, border: `1px solid ${design.accent}22` }}>
              <div className="h-1.5 rounded bg-white/15 w-3/4" />
              <div className="h-1 rounded bg-white/5 w-full" />
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-[var(--accent)] flex items-center justify-center z-10">
          <Check className="size-3.5 text-[var(--accent-foreground)]" />
        </div>
      )}
    </div>
  );
}

export function StepDesign({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.design");

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DESIGNS.map((d) => {
          const selected = state.designId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => update({ designId: d.id })}
              className={`text-left bg-[var(--surface)] border rounded-xl overflow-hidden transition-all ${
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <DesignPreview design={d} selected={selected} />
              <div className="p-3">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-medium text-[var(--foreground)]">{d.name}</span>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${d.status === "live" ? "bg-green-400/10 text-green-400" : "bg-white/6 text-[var(--subtle)]"}`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">{d.niche}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">{t("noteLabel")}</label>
        <textarea
          value={state.designNote}
          onChange={(e) => update({ designNote: e.target.value })}
          placeholder={t("notePlaceholder")}
          rows={3}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--subtle)] transition-colors hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
        />
      </div>
    </div>
  );
}
