"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

const BASE_W = 1280;
const BASE_H = 820;

const EXAMPLES = [
  {
    id: "auto",
    before: "/templates/monolith.html",
    after: "/templates/monolith-auto.html",
    bg: "#0b1220",
  },
  {
    id: "beauty",
    before: "/templates/aurora.html",
    after: "/templates/aurora-beauty.html",
    bg: "#f6f6f1",
  },
  {
    id: "legal",
    before: "/templates/split.html",
    after: "/templates/split-legal.html",
    bg: "#faf8f3",
  },
];

function Slider({
  before,
  after,
  bg,
  labelBefore,
  labelAfter,
}: {
  before: string;
  after: string;
  bg: string;
  labelBefore: string;
  labelAfter: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.42);
  const dragging = useRef(false);
  const [scale, setScale] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"before" | "after">("after");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(w / BASE_W);
      setIsMobile(w < 600);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getPos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0.42;
    return Math.min(0.95, Math.max(0.05, (clientX - rect.left) / rect.width));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    setPos(getPos(e.clientX));
  };
  const onMouseMove = useCallback(
    (e: MouseEvent) => { if (dragging.current) setPos(getPos(e.clientX)); },
    [getPos]
  );
  const onMouseUp = () => { dragging.current = false; };
  const onTouchMove = useCallback(
    (e: TouchEvent) => { if (e.touches[0]) setPos(getPos(e.touches[0].clientX)); },
    [getPos]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onTouchMove]);

  const containerH = Math.round(BASE_H * scale);

  if (isMobile) {
    return (
      <div>
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl border border-[var(--border)]"
          style={{ background: bg, height: containerH }}
        >
          <iframe
            key={mobileView === "before" ? before : after}
            src={mobileView === "before" ? before : after}
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute top-0 left-0 origin-top-left pointer-events-none border-0"
            style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
          />
        </div>
        <div className="flex mt-3 justify-center">
          <div className="inline-flex rounded-full border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
            <button
              onClick={() => setMobileView("before")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                mobileView === "before"
                  ? "bg-[var(--surface-elevated)] text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {labelBefore}
            </button>
            <button
              onClick={() => setMobileView("after")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                mobileView === "after"
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {labelAfter}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-[var(--border)] cursor-col-resize select-none"
      style={{ background: bg, height: containerH }}
      onMouseDown={onMouseDown}
      onTouchStart={(e) => {
        if (e.touches[0]) setPos(getPos(e.touches[0].clientX));
      }}
    >
      {/* After — bottom layer */}
      <iframe
        src={after}
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute top-0 left-0 origin-top-left pointer-events-none border-0"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
      />

      {/* Before — clipped top layer */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${pos * 100}%` }}
      >
        <iframe
          src={before}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute top-0 left-0 origin-top-left border-0"
          style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/60 pointer-events-none"
        style={{ left: `${pos * 100}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${pos * 100}%` }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M6 4L2 9l4 5M12 4l4 5-4 5"
            stroke="#374151"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 text-xs font-semibold bg-black/50 text-white px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm">
        {labelBefore}
      </div>
      <div className="absolute top-3 right-3 text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)] px-2.5 py-1 rounded-full pointer-events-none">
        {labelAfter}
      </div>
    </div>
  );
}

export function Showcase() {
  const t = useTranslations("showcase");
  const tabs = t.raw("tabs") as { label: string; tag: string }[];
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-10 md:mb-12">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-medium">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-[var(--foreground)] mb-4">
              {t("h2")}
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl">{t("subtitle")}</p>
          </div>
        </FadeIn>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab, i) => (
            <button
              key={tab.id ?? i}
              type="button"
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                active === i
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-transparent"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] bg-transparent"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  active === i
                    ? "bg-white/20 text-[var(--accent-foreground)]"
                    : "bg-[var(--surface-elevated)] text-[var(--subtle)]"
                }`}
              >
                {tab.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Slider */}
        <FadeIn key={active}>
          <Slider
            before={EXAMPLES[active].before}
            after={EXAMPLES[active].after}
            bg={EXAMPLES[active].bg}
            labelBefore={t("before")}
            labelAfter={t("after")}
          />
        </FadeIn>

        <p className="mt-4 text-center text-xs text-[var(--subtle)]">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
