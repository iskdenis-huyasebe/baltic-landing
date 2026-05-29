"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import type { OrderFiles } from "@/app/[locale]/order/page";

function FileChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--accent)]/30 rounded-lg px-3 py-1.5 text-sm">
      <span className="truncate max-w-[200px]">{name}</span>
      <button type="button" onClick={onRemove} className="text-[var(--muted)] hover:text-[var(--foreground)] shrink-0">
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function DropZone({
  label,
  icon: Icon,
  hint,
  multiple,
  accept,
  onFiles,
  onSkip,
  skipLabel,
  children,
}: {
  label: string;
  icon: React.ElementType;
  hint: string;
  multiple?: boolean;
  accept: string;
  onFiles: (files: File[]) => void;
  onSkip: () => void;
  skipLabel: string;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    onFiles(dropped);
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
        <Icon className="size-4 text-[var(--accent)]" />
        {label}
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 rounded-xl p-5 text-center space-y-2 bg-[var(--surface)]/50 cursor-pointer transition-colors"
      >
        <Upload className="size-5 text-[var(--subtle)] mx-auto" />
        <p className="text-sm text-[var(--muted)]">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {children && <div className="flex flex-wrap gap-2 mt-3">{children}</div>}

      <button
        type="button"
        onClick={onSkip}
        className="mt-2 text-xs text-[var(--subtle)] hover:text-[var(--accent)] transition-colors underline"
      >
        {skipLabel}
      </button>
    </div>
  );
}

export function StepFiles({
  files,
  setFiles,
}: {
  files: OrderFiles;
  setFiles: React.Dispatch<React.SetStateAction<OrderFiles>>;
}) {
  const t = useTranslations("order.files");

  const SKIP_FILE = new File([], "__skip__");

  const isSkipped = (f?: File) => f?.name === "__skip__";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">{t("title")}</h2>
      <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

      <div className="space-y-8">
        {/* Logo */}
        {isSkipped(files.logo) ? (
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <ImageIcon className="size-4" /> {t("logoLabel")} — {t("skipped")}
            </div>
            <button type="button" onClick={() => setFiles((f) => ({ ...f, logo: undefined }))} className="text-xs text-[var(--accent)] hover:underline">{t("change")}</button>
          </div>
        ) : files.logo ? (
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--accent)]/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="size-4 text-[var(--accent)]" />
              <span className="truncate max-w-[260px]">{files.logo.name}</span>
            </div>
            <button type="button" onClick={() => setFiles((f) => ({ ...f, logo: undefined }))} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="size-4" /></button>
          </div>
        ) : (
          <DropZone
            label={t("logoLabel")}
            icon={ImageIcon}
            hint={t("logoHint")}
            accept="image/*,.svg,.ai,.eps,.pdf"
            onFiles={(fs) => setFiles((f) => ({ ...f, logo: fs[0] }))}
            onSkip={() => setFiles((f) => ({ ...f, logo: SKIP_FILE }))}
            skipLabel={t("skipLabel")}
          />
        )}

        {/* Photos */}
        <DropZone
          label={t("photoLabel")}
          icon={ImageIcon}
          hint={t("photoHint")}
          accept="image/*"
          multiple
          onFiles={(fs) => setFiles((f) => ({ ...f, photos: [...f.photos.filter(p => p.name !== "__skip__"), ...fs] }))}
          onSkip={() => setFiles((f) => ({ ...f, photos: [SKIP_FILE] }))}
          skipLabel={t("skipLabel")}
        >
          {files.photos.filter(p => p.name !== "__skip__").map((p, i) => (
            <FileChip
              key={i}
              name={p.name}
              onRemove={() => setFiles((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
            />
          ))}
          {files.photos.some(p => p.name === "__skip__") && (
            <span className="text-sm text-[var(--muted)] italic">{t("skipped")}</span>
          )}
        </DropZone>

        {/* Texts */}
        {isSkipped(files.texts) ? (
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <FileText className="size-4" /> {t("textsLabel")} — {t("skipped")}
            </div>
            <button type="button" onClick={() => setFiles((f) => ({ ...f, texts: undefined }))} className="text-xs text-[var(--accent)] hover:underline">{t("change")}</button>
          </div>
        ) : files.texts ? (
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--accent)]/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="size-4 text-[var(--accent)]" />
              <span className="truncate max-w-[260px]">{files.texts.name}</span>
            </div>
            <button type="button" onClick={() => setFiles((f) => ({ ...f, texts: undefined }))} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="size-4" /></button>
          </div>
        ) : (
          <DropZone
            label={t("textsLabel")}
            icon={FileText}
            hint={t("textsHint")}
            accept=".doc,.docx,.txt,.pdf,.gdoc"
            onFiles={(fs) => setFiles((f) => ({ ...f, texts: fs[0] }))}
            onSkip={() => setFiles((f) => ({ ...f, texts: SKIP_FILE }))}
            skipLabel={t("skipLabel")}
          />
        )}
      </div>
    </div>
  );
}
