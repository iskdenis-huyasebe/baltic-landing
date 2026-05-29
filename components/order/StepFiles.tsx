"use client";

import { useTranslations } from "next-intl";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import type { OrderState } from "@/app/[locale]/order/page";

// Simple file input — UploadThing can be integrated when UPLOADTHING_TOKEN is configured
function FileDropzone({
  label,
  icon: Icon,
  placeholder,
  skipLabel,
  onSkip,
  value,
  onClear,
}: {
  label: string;
  icon: React.ElementType;
  placeholder: string;
  skipLabel: string;
  onSkip: () => void;
  value: string;
  onClear: () => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
        <Icon className="size-4 text-[var(--accent)]" />
        {label}
      </label>
      {value ? (
        <div className="flex items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--accent)]/30 rounded-xl px-4 py-3">
          <span className="text-sm text-[var(--foreground)] truncate">{value}</span>
          <button type="button" onClick={onClear} className="text-[var(--muted)] hover:text-[var(--foreground)] shrink-0">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center space-y-3 bg-[var(--surface)]/50">
          <Upload className="size-6 text-[var(--subtle)] mx-auto" />
          <p className="text-sm text-[var(--muted)]">{placeholder}</p>
          <p className="text-xs text-[var(--subtle)] italic">UploadThing integration coming soon</p>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-[var(--subtle)] hover:text-[var(--accent)] transition-colors underline"
          >
            {skipLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export function StepFiles({
  state,
  update,
}: {
  state: OrderState;
  update: (p: Partial<OrderState>) => void;
}) {
  const t = useTranslations("order.files");

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-6">
        <FileDropzone
          label={t("logoLabel")}
          icon={ImageIcon}
          placeholder={t("uploadPlaceholder")}
          skipLabel={t("skipLabel")}
          onSkip={() => update({ logoUrl: "skip" })}
          value={state.logoUrl === "skip" ? "" : state.logoUrl}
          onClear={() => update({ logoUrl: "" })}
        />

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
            <ImageIcon className="size-4 text-[var(--accent)]" />
            {t("photoLabel")}
          </label>
          <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center space-y-3 bg-[var(--surface)]/50">
            <Upload className="size-6 text-[var(--subtle)] mx-auto" />
            <p className="text-sm text-[var(--muted)]">{t("uploadPlaceholder")}</p>
            <p className="text-xs text-[var(--subtle)] italic">UploadThing integration coming soon</p>
            <button
              type="button"
              onClick={() => update({ photoUrls: ["skip"] })}
              className="text-xs text-[var(--subtle)] hover:text-[var(--accent)] transition-colors underline"
            >
              {t("skipLabel")}
            </button>
          </div>
        </div>

        <FileDropzone
          label={t("textsLabel")}
          icon={FileText}
          placeholder={t("uploadPlaceholder")}
          skipLabel={t("skipLabel")}
          onSkip={() => update({ textsUrl: "skip" })}
          value={state.textsUrl === "skip" ? "" : state.textsUrl}
          onClear={() => update({ textsUrl: "" })}
        />
      </div>
    </div>
  );
}
