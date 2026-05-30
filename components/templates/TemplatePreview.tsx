import { Check } from "lucide-react";
import type { Template, TemplateTheme } from "./templates";

// A browser-framed, CSS-only preview. Each template renders in its OWN theme
// (light/dark, palette) so the gallery reads as five different products.
export function TemplatePreview({
  template,
  selected,
}: {
  template: Template;
  selected?: boolean;
}) {
  const th = template.theme;
  const chrome = th.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const chromeBar = th.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";

  return (
    <div className="aspect-[16/10] relative overflow-hidden rounded-t-xl" style={{ background: th.bg }}>
      {/* browser chrome */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 h-7 z-10"
        style={{ background: chrome, borderBottom: `1px solid ${th.border}` }}
      >
        <div className="size-2 rounded-full" style={{ background: th.mode === "dark" ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.2)" }} />
        <div className="size-2 rounded-full" style={{ background: th.accent, opacity: 0.55 }} />
        <div className="size-2 rounded-full" style={{ background: th.mode === "dark" ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.2)" }} />
        <div className="flex-1 mx-3 rounded-full h-3.5" style={{ background: chromeBar }} />
      </div>

      <div className="absolute inset-0 pt-7">
        {template.style === "minimal" && <Minimal th={th} />}
        {template.style === "classic" && <Classic th={th} />}
        {template.style === "bigtype" && <Bigtype th={th} />}
        {template.style === "cards" && <Cards th={th} />}
        {template.style === "split" && <Split th={th} />}
        {template.style === "spotlight" && <Spotlight th={th} />}
      </div>

      {selected && (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-[var(--accent)] flex items-center justify-center z-20">
          <Check className="size-3.5 text-[var(--accent-foreground)]" />
        </div>
      )}
    </div>
  );
}

// helpers for theme-aware neutral fills
const soft = (th: TemplateTheme, n: number) =>
  th.mode === "dark" ? `rgba(255,255,255,${n})` : `rgba(0,0,0,${n})`;

/* ---------- minimal: light, centered, airy ---------- */
function Minimal({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2.5 px-12">
      <div className="h-1.5 w-9 rounded-full" style={{ background: th.accent }} />
      <div className="h-3.5 w-3/5 rounded" style={{ background: th.fg, opacity: 0.85 }} />
      <div className="h-2 w-2/5 rounded" style={{ background: th.muted, opacity: 0.55 }} />
      <div className="h-6 w-20 rounded-full mt-2" style={{ background: th.accent }} />
    </div>
  );
}

/* ---------- classic: dark navy, nav + hero + feature row ---------- */
function Classic({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full flex flex-col px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <div className="h-2.5 w-12 rounded" style={{ background: th.accent }} />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-6 rounded" style={{ background: soft(th, 0.18) }} />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-1/2 rounded" style={{ background: th.fg, opacity: 0.85 }} />
        <div className="h-2 w-2/3 rounded" style={{ background: th.muted, opacity: 0.5 }} />
        <div className="h-6 w-16 rounded-lg mt-1.5" style={{ background: th.accent }} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-auto">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md p-2 space-y-1" style={{ background: th.surface, border: `1px solid ${th.border}` }}>
            <div className="size-3 rounded" style={{ background: th.accent, opacity: 0.5 }} />
            <div className="h-1.5 rounded w-full" style={{ background: soft(th, 0.14) }} />
            <div className="h-1.5 rounded w-2/3" style={{ background: soft(th, 0.08) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- bigtype: dark, oversized headline ---------- */
function Bigtype({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full flex flex-col justify-center px-5 gap-2">
      <div className="h-6 w-11/12 rounded" style={{ background: th.fg, opacity: 0.9 }} />
      <div className="h-6 w-3/4 rounded" style={{ background: th.fg, opacity: 0.9 }} />
      <div className="h-6 w-1/2 rounded" style={{ background: th.accent }} />
      <div className="flex items-center gap-2 mt-2">
        <div className="h-5 w-16 rounded-md" style={{ background: th.accent }} />
        <div className="h-2 w-20 rounded" style={{ background: th.muted, opacity: 0.5 }} />
      </div>
    </div>
  );
}

/* ---------- cards: light lavender, bento grid ---------- */
function Cards({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full flex flex-col px-4 py-3 gap-2">
      <div className="h-2.5 w-2/5 rounded" style={{ background: th.fg, opacity: 0.8 }} />
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 flex-1">
        <div
          className="row-span-2 rounded-md"
          style={{ background: `linear-gradient(150deg, ${th.accent}, ${th.accent}66)` }}
        />
        <div className="rounded-md" style={{ background: th.surface, border: `1px solid ${th.border}` }} />
        <div className="rounded-md" style={{ background: th.surface, border: `1px solid ${th.border}` }} />
        <div className="rounded-md" style={{ background: th.surface, border: `1px solid ${th.border}` }} />
        <div className="rounded-md" style={{ background: `${th.accent}22`, border: `1px solid ${th.accent}55` }} />
      </div>
    </div>
  );
}

/* ---------- split: two-tone editorial ---------- */
function Split({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full grid grid-cols-2">
      <div className="flex flex-col justify-center gap-2 px-4">
        <div className="h-1.5 w-8 rounded-full" style={{ background: th.accent }} />
        <div className="h-3 w-5/6 rounded" style={{ background: th.fg, opacity: 0.85 }} />
        <div className="h-2 w-2/3 rounded" style={{ background: th.muted, opacity: 0.5 }} />
        <div className="h-5 w-16 rounded-lg mt-1" style={{ background: th.accent }} />
      </div>
      <div className="relative" style={{ background: th.accent2 ?? th.accent }}>
        <div
          className="absolute inset-0 m-3 rounded-lg"
          style={{ background: `${th.accent}33`, border: `1px solid ${th.accent}88` }}
        />
      </div>
    </div>
  );
}

/* ---------- spotlight: dark SaaS, centered glow + device + logos ---------- */
function Spotlight({ th }: { th: TemplateTheme }) {
  return (
    <div className="h-full relative flex flex-col items-center justify-center px-6 gap-2 overflow-hidden">
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${th.accent}66, transparent 70%)` }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 w-full">
        <div className="h-3 w-2/3 rounded" style={{ background: th.fg, opacity: 0.9 }} />
        <div className="h-2 w-2/5 rounded" style={{ background: th.muted, opacity: 0.55 }} />
        <div className="h-6 w-24 rounded-lg mt-1" style={{ background: `linear-gradient(90deg, ${th.accent}, ${th.accent2 ?? th.accent})` }} />
        <div
          className="w-3/4 h-12 rounded-lg mt-2"
          style={{ background: th.surface, border: `1px solid ${th.accent}44` }}
        />
        <div className="flex gap-3 mt-1 opacity-60">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 w-7 rounded" style={{ background: soft(th, 0.2) }} />
          ))}
        </div>
      </div>
    </div>
  );
}
