"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { StatusData } from "@/lib/status/trelloCache";
import { PLANS } from "@/lib/status/plans";
import { COOKIE_NAME } from "@/lib/status/token";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatUpdatedAt(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function supportDaysLeft(dueDate: string | null, supportDays: number): number {
  if (!dueDate) return supportDays;
  const launch = new Date(dueDate).getTime();
  const elapsed = Math.floor((Date.now() - launch) / (1000 * 60 * 60 * 24));
  return Math.max(0, supportDays - elapsed);
}

// ─── Plan chip ────────────────────────────────────────────────────────────────

function PlanChip({ variant, label }: { variant: "gray" | "lime" | "amber"; label: string }) {
  const cls =
    variant === "lime"
      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
      : variant === "amber"
      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
      : "bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]";
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

// ─── Stage icon ───────────────────────────────────────────────────────────────

function StageIcon({
  state,
}: {
  state: "done" | "active" | "pending";
}) {
  if (state === "done")
    return (
      <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--accent)] shrink-0">
        <Check size={12} strokeWidth={3} className="text-[var(--accent-foreground)]" />
      </span>
    );
  if (state === "active")
    return (
      <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--accent)]/20 border border-[var(--accent)] shrink-0">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
      </span>
    );
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center border border-[var(--border)] shrink-0">
      <span className="text-[10px] text-[var(--subtle)] font-medium" />
    </span>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({
  data,
  t,
  locale,
}: {
  data: StatusData;
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  const plan = PLANS[data.plan];
  const tPlans = useTranslations(`status.plans.${data.plan}`);
  const [open, setOpen] = useState<number | null>(data.stage > 0 ? data.stage - 1 : null);

  const isDone = data.stage > plan.stages.length;
  const isAccepted = data.stage === 0;

  return (
    <div className={`space-y-2 ${isAccepted ? "opacity-45 pointer-events-none select-none" : ""}`}>
      {plan.stages.map((stage, i) => {
        const stageIdx = i + 1;
        const state: "done" | "active" | "pending" =
          isDone || stageIdx < data.stage
            ? "done"
            : stageIdx === data.stage
            ? "active"
            : "pending";

        const isOpen = open === i;

        // Subtasks: from Trello checklists or defaults
        const subtasks: Array<{ name: string; done: boolean }> =
          data.subtasks?.[stageIdx] ??
          stage.defaultSubtaskKeys.map((_, si) => ({
            name: tPlans(`stages.${i}.sub.${si}` as any),
            done: state === "done",
          }));

        const stageName = tPlans(`stages.${i}.name` as any);

        return (
          <div
            key={i}
            className={`rounded-xl border transition-colors ${
              state === "active"
                ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
                : "border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              <StageIcon state={state} />
              <span
                className={`flex-1 text-sm font-medium ${
                  state === "pending"
                    ? "text-[var(--subtle)]"
                    : "text-[var(--foreground)]"
                }`}
              >
                {stageName}
              </span>
              {state === "active" && (
                <span className="text-xs text-[var(--accent)] font-medium mr-1">
                  {t("page.now")}
                </span>
              )}
              {isOpen ? (
                <ChevronUp size={14} className="text-[var(--subtle)] shrink-0" />
              ) : (
                <ChevronDown size={14} className="text-[var(--subtle)] shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-0">
                <ul className="space-y-2">
                  {subtasks.map((sub, si) => (
                    <li key={si} className="flex items-start gap-2.5 text-sm">
                      {sub.done ? (
                        <Check size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                      ) : state === "active" && si === subtasks.findIndex((s) => !s.done) ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] mt-0.5 shrink-0 animate-pulse" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-[var(--border)] mt-0.5 shrink-0" />
                      )}
                      <span
                        className={
                          sub.done
                            ? "text-[var(--muted)]"
                            : state === "pending"
                            ? "text-[var(--subtle)]"
                            : "text-[var(--foreground)]"
                        }
                      >
                        {sub.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Materials ────────────────────────────────────────────────────────────────

function Materials({
  links,
  isDone,
  t,
}: {
  links: StatusData["links"];
  isDone: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const items = [
    { key: "design", url: links.design, hint: t("page.materials.designHint") },
    { key: "preview", url: links.preview, hint: t("page.materials.previewHint") },
    { key: "live", url: links.live, hint: t("page.materials.liveHint") },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map(({ key, url, hint }) => {
        const isLive = key === "live";
        const label = t(`page.materials.${key}` as any);
        if (url) {
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col gap-1 px-4 py-3 rounded-xl border transition-all
                ${
                  isLive && isDone
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
            >
              <span
                className={`text-xs font-medium ${
                  isLive && isDone ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {label}
              </span>
              <span className="text-sm text-[var(--foreground)] flex items-center gap-1">
                {t("page.materials.open")}
                <ExternalLink size={12} />
              </span>
            </a>
          );
        }
        return (
          <div
            key={key}
            className="flex flex-col gap-1 px-4 py-3 rounded-xl border border-dashed border-[var(--border)] bg-transparent"
          >
            <span className="text-xs font-medium text-[var(--subtle)]">{label}</span>
            <span className="text-xs text-[var(--subtle)]">{hint}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  stage,
  totalStages,
  t,
  planT,
}: {
  stage: number;
  totalStages: number;
  t: ReturnType<typeof useTranslations>;
  planT: ReturnType<typeof useTranslations>;
}) {
  const pct = Math.round((stage / (totalStages + 1)) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs text-[var(--muted)]">
        <span>{t("page.progressLabel")}</span>
        <span className="font-medium text-[var(--foreground)]">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function StatusDashboard({ locale }: { locale: string }) {
  const t = useTranslations("status");
  const tPage = useTranslations("status.page");
  const router = useRouter();

  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<"unauthorized" | "unavailable" | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (res.status === 401) {
        setErrorType("unauthorized");
        return;
      }
      if (!res.ok) {
        setErrorType("unavailable");
        return;
      }
      const json = await res.json();
      setData(json);
      setErrorType(null);
    } catch {
      setErrorType("unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Redirect to login if unauthorized
  useEffect(() => {
    if (errorType === "unauthorized") {
      router.push(`/${locale}/status`);
    }
  }, [errorType, locale, router]);

  // ⚠️ Must be called before any early returns (Rules of Hooks)
  const tPlan = useTranslationsForPlan((data?.plan ?? "setup") as any);

  async function handleLogout() {
    await fetch("/api/status/logout", { method: "POST" });
    router.push(`/${locale}/status`);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </main>
    );
  }

  if (errorType === "unavailable" || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle size={32} className="mx-auto text-[var(--muted)]" />
          <p className="text-[var(--foreground)] font-medium">Nepavyko užkrauti statuso</p>
          <p className="text-sm text-[var(--muted)]">Pabandykite dar kartą arba parašykite mums.</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
          >
            <RefreshCw size={14} />
            Bandyti dar kartą
          </button>
        </div>
      </main>
    );
  }

  const plan = PLANS[data.plan];
  const isDone = data.stage > plan.stages.length;
  const isAccepted = data.stage === 0;
  const daysLeft = supportDaysLeft(data.dueDate, plan.supportDays);
  const SUPPORT_LINK =
    process.env.NEXT_PUBLIC_TELEGRAM_LINK || "https://t.me/unoweb_support";

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-6">

        {/* ── Header ── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1.5">
              <h1 className="text-base font-semibold text-[var(--foreground)] leading-tight">
                {data.projectName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <PlanChip variant={plan.chipVariant} label={tPlan("chip")} />
                <span className="text-xs text-[var(--subtle)] font-mono">{data.clientRef}</span>
              </div>
            </div>
            {/* Stage badge */}
            {!isDone && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-xs text-[var(--foreground)] font-medium">
                  {isAccepted
                    ? tPage("accepted").split("—")[0]?.trim()
                    : tPlan(`stages.${data.stage - 1}.name` as any).split("—")[1]?.trim() ??
                      tPlan(`stages.${data.stage - 1}.name` as any)}
                </span>
              </div>
            )}
          </div>

          {/* Updated at */}
          <p className="text-xs text-[var(--subtle)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60 animate-pulse" />
            {tPage("updatedAt")} {formatUpdatedAt(data.updatedAt, locale)}
            {data.stale && (
              <span className="text-[var(--subtle)] opacity-60"> · cached</span>
            )}
          </p>
        </div>

        {/* ── Accepted state ── */}
        {isAccepted && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-sm font-medium text-[var(--foreground)]">
              ☕ {tPage("accepted")}
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">{tPage("acceptedSub")}</p>
          </div>
        )}

        {/* ── Progress bar ── */}
        {!isAccepted && !isDone && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <ProgressBar
              stage={data.stage}
              totalStages={plan.stages.length}
              t={tPage as any}
              planT={tPlan as any}
            />
          </div>
        )}

        {/* ── Done state ── */}
        {isDone && (
          <DoneBlock
            data={data}
            daysLeft={daysLeft}
            locale={locale}
            tPage={tPage as any}
          />
        )}

        {/* ── Wait block ── */}
        {data.waitingFor.length > 0 && !data.waitingFor.includes("approve") && (
          <WaitBlock waitingFor={data.waitingFor} tPage={tPage as any} supportLink={SUPPORT_LINK} />
        )}

        {/* ── Approve block ── */}
        {data.waitingFor.includes("approve") && (
          <ApproveBlock
            data={data}
            tPage={tPage as any}
            tPlan={tPlan as any}
            onRefresh={load}
          />
        )}

        {/* ── Timeline ── */}
        <section>
          <Timeline data={data} t={t as any} locale={locale} />
        </section>

        {/* ── Materials ── */}
        <section>
          <Materials links={data.links} isDone={isDone} t={t as any} />
        </section>

        {/* ── Revision counter ── */}
        {data.revisions && (
          <RevisionCounter
            revisions={data.revisions}
            plan={data.plan}
            tPlan={tPlan as any}
          />
        )}

        {/* ── Feedback form ── */}
        <FeedbackForm data={data} tPage={tPage as any} onRefresh={load} />

        {/* ── Footer ── */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-xs text-[var(--subtle)]">
            {tPage("contact")}{" "}
            <a
              href={SUPPORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[var(--accent)]"
            >
              Telegram
            </a>
          </p>
          <button
            onClick={handleLogout}
            className="text-xs text-[var(--subtle)] hover:text-[var(--muted)] underline"
          >
            {tPage("logout")}
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── Blocks (forward declarations — defined below) ───────────────────────────

function DoneBlock({
  data,
  daysLeft,
  locale,
  tPage,
}: {
  data: StatusData;
  daysLeft: number;
  locale: string;
  tPage: any;
}) {
  return (
    <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-5 space-y-3 text-center">
      <p className="text-xl font-semibold text-[var(--foreground)]">{tPage("confetti")}</p>
      <p className="text-sm text-[var(--muted)]">{tPage("doneSub")}</p>
      {data.links.live && (
        <a
          href={data.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90"
        >
          {tPage("openSite")} <ExternalLink size={14} />
        </a>
      )}
      <p className="text-xs text-[var(--muted)]">
        {tPage("supportLeft", { n: daysLeft })}
      </p>
      <p className="text-xs text-[var(--subtle)]">
        {tPage("upsell")}{" "}
        <a href={`/${locale}/subscribe`} className="underline text-[var(--accent)]">
          {tPage("upsellLink")}
        </a>
      </p>
    </div>
  );
}

function WaitBlock({
  waitingFor,
  tPage,
  supportLink,
}: {
  waitingFor: string[];
  tPage: any;
  supportLink: string;
}) {
  const type = waitingFor[0] as "texts" | "photos" | "domain";
  return (
    <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 space-y-2">
      <p className="text-sm font-semibold text-amber-300">{tPage(`waitTitle.${type}`)}</p>
      <p className="text-sm text-[var(--muted)]">{tPage(`waitText.${type}`)}</p>
      <a
        href={supportLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-amber-300 underline font-medium"
      >
        {tPage(`waitAction.${type}`)} →
      </a>
    </div>
  );
}

function ApproveBlock({
  data,
  tPage,
  tPlan,
  onRefresh,
}: {
  data: StatusData;
  tPage: any;
  tPlan: any;
  onRefresh: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "confirmed">("idle");

  async function handleApprove() {
    setState("sending");
    try {
      const res = await fetch("/api/status/approve", { method: "POST" });
      if (res.ok) {
        setState("confirmed");
        setTimeout(onRefresh, 1500);
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
    }
  }

  if (state === "confirmed") {
    return (
      <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-5 text-center">
        <p className="text-sm font-medium text-[var(--accent)]">{tPage("approve.confirmed")}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-5 space-y-3">
      <p className="text-sm font-semibold text-[var(--foreground)]">
        👀 {tPlan("approveHeading")}
      </p>
      {data.links.design && (
        <a
          href={data.links.design}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] underline"
        >
          {(tPage as any)("materials.design")} <ExternalLink size={12} />
        </a>
      )}
      <div className="flex gap-2 flex-wrap pt-1">
        <button
          onClick={handleApprove}
          disabled={state === "sending"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium disabled:opacity-60"
        >
          {state === "sending" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            tPage("approve.yes")
          )}
        </button>
        <button
          onClick={() =>
            document.getElementById("feedback-form")?.scrollIntoView({ behavior: "smooth" })
          }
          className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          {tPage("approve.no")}
        </button>
      </div>
    </div>
  );
}

function RevisionCounter({
  revisions,
  plan,
  tPlan,
}: {
  revisions: { used: number; total: number };
  plan: string;
  tPlan: any;
}) {
  const { used, total } = revisions;
  const key =
    plan === "custom"
      ? "status.page.revisionsCustom"
      : plan === "pro"
      ? "status.page.revisionsTypo"
      : "status.page.revisions";

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-2">
      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
        {tPlan("revisionLabel", { used, total })}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              i < used
                ? "bg-[var(--accent)] border-[var(--accent)]"
                : "border-[var(--border)]"
            }`}
          >
            {i < used && <Check size={10} className="text-[var(--accent-foreground)]" strokeWidth={3} />}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeedbackForm({
  data,
  tPage,
  onRefresh,
}: {
  data: StatusData;
  tPage: any;
  onRefresh: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [cooldown, setCooldown] = useState(0);

  const topics: string[] = tPage.raw("feedback.topics");

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter(
      (f) => f.size <= 10 * 1024 * 1024 && /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    if (message.length < 10 || message.length > 2000) return;
    if (cooldown > 0) return;

    setState("sending");
    const fd = new FormData();
    fd.append("topic", topic);
    fd.append("message", message);
    files.forEach((f, i) => fd.append(`file_${i}`, f, f.name));

    try {
      const res = await fetch("/api/status/feedback", { method: "POST", body: fd });
      if (res.ok) {
        setState("success");
        setTopic("");
        setMessage("");
        setFiles([]);
        setCooldown(60);
      } else if (res.status === 429) {
        setState("error");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <section id="feedback-form" className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          {tPage("feedback.title")}
        </h2>
        <p className="text-xs text-[var(--muted)] mt-0.5">{tPage("feedback.subtitle")}</p>
      </div>

      {state === "success" ? (
        <div className="text-center py-4 space-y-1">
          <p className="font-medium text-[var(--accent)]">✓ {tPage("feedback.successTitle")}</p>
          <p className="text-sm text-[var(--muted)]">{tPage("feedback.successText")}</p>
          {cooldown > 0 && (
            <p className="text-xs text-[var(--subtle)] mt-2">
              {tPage("feedback.cooldown", { s: cooldown })}
            </p>
          )}
          <button
            onClick={() => setState("idle")}
            className="mt-3 text-xs underline text-[var(--muted)]"
          >
            ↩ ещё
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Topic selector */}
          <div className="flex flex-wrap gap-2">
            {topics.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setTopic(tp)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  topic === tp
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-transparent"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tp}
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={tPage("feedback.messagePlaceholder")}
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-sm text-[var(--foreground)] placeholder-[var(--subtle)] outline-none focus:border-[var(--accent)] resize-none transition-colors"
          />

          {/* File upload */}
          <div>
            <label className="block text-xs text-[var(--subtle)] mb-2">
              {tPage("feedback.upload")}
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="text-xs text-[var(--muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[var(--border)] file:bg-[var(--surface-elevated)] file:text-xs file:text-[var(--foreground)] file:cursor-pointer"
            />
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg px-2 py-1"
                  >
                    <span className="truncate max-w-[120px]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="text-[var(--subtle)] hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state === "error" && (
            <p className="text-xs text-red-400">{tPage("feedback.errorText")}</p>
          )}

          <button
            type="submit"
            disabled={state === "sending" || !topic || message.length < 10 || cooldown > 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium disabled:opacity-40"
          >
            {state === "sending" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {tPage("feedback.sending")}
              </>
            ) : (
              tPage("feedback.submit")
            )}
          </button>
        </form>
      )}
    </section>
  );
}

// Helper: get plan translations
function useTranslationsForPlan(plan: string) {
  return useTranslations(`status.plans.${plan}` as any);
}
