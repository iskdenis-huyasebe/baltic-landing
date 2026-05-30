import { Check } from "lucide-react";
import type { Template } from "./templates";

// A browser-framed, CSS-only preview that looks visibly different per style.
export function TemplatePreview({
  template,
  selected,
}: {
  template: Template;
  selected?: boolean;
}) {
  const a = template.accent;

  return (
    <div
      className="aspect-[16/10] relative overflow-hidden rounded-t-xl"
      style={{ background: "linear-gradient(160deg, #191919 0%, #101010 100%)" }}
    >
      {/* accent glow */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% -10%, ${a} 0%, transparent 60%)` }}
      />

      {/* browser chrome */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 h-7 z-10"
        style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="size-2 rounded-full bg-red-400/50" />
        <div className="size-2 rounded-full bg-yellow-400/50" />
        <div className="size-2 rounded-full bg-green-400/50" />
        <div className="flex-1 mx-3 rounded-full h-3.5" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <div className="absolute inset-0 pt-7">
        {template.style === "minimal" && <MinimalBody a={a} />}
        {template.style === "classic" && <ClassicBody a={a} />}
        {template.style === "bigtype" && <BigtypeBody a={a} />}
        {template.style === "cards" && <CardsBody a={a} />}
        {template.style === "split" && <SplitBody a={a} />}
      </div>

      {selected && (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-[var(--accent)] flex items-center justify-center z-20">
          <Check className="size-3.5 text-[var(--accent-foreground)]" />
        </div>
      )}
    </div>
  );
}

/* ---- style bodies ---- */

// Minimal: centered, airy, single column, lots of whitespace.
function MinimalBody({ a }: { a: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2.5 px-10">
      <div className="h-1.5 w-10 rounded-full" style={{ background: a, opacity: 0.9 }} />
      <div className="h-3 w-3/5 rounded bg-white/12" />
      <div className="h-2 w-2/5 rounded bg-white/6" />
      <div className="h-6 w-20 rounded-lg mt-2" style={{ background: a }} />
    </div>
  );
}

// Classic: top nav, left hero, 3-col feature row. Structured/corporate.
function ClassicBody({ a }: { a: string }) {
  return (
    <div className="h-full flex flex-col px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <div className="h-2.5 w-12 rounded" style={{ background: a, opacity: 0.85 }} />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-6 rounded bg-white/15" />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-1/2 rounded bg-white/12" />
        <div className="h-2 w-2/3 rounded bg-white/6" />
        <div className="h-6 w-16 rounded-lg mt-1.5" style={{ background: a }} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-auto">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md p-2 space-y-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="size-3 rounded" style={{ background: `${a}55` }} />
            <div className="h-1.5 rounded bg-white/12 w-full" />
            <div className="h-1.5 rounded bg-white/6 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Bigtype: oversized headline dominates, tiny sub, one button.
function BigtypeBody({ a }: { a: string }) {
  return (
    <div className="h-full flex flex-col justify-center px-5 gap-2">
      <div className="h-6 w-11/12 rounded bg-white/14" />
      <div className="h-6 w-3/4 rounded bg-white/14" />
      <div className="h-6 w-1/2 rounded" style={{ background: `${a}cc` }} />
      <div className="flex items-center gap-2 mt-2">
        <div className="h-5 w-16 rounded-md" style={{ background: a }} />
        <div className="h-2 w-20 rounded bg-white/6" />
      </div>
    </div>
  );
}

// Cards: small hero + bento card grid filling the canvas.
function CardsBody({ a }: { a: string }) {
  return (
    <div className="h-full flex flex-col px-4 py-3 gap-2">
      <div className="h-2.5 w-2/5 rounded bg-white/12" />
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 flex-1">
        <div className="row-span-2 rounded-md" style={{ background: `${a}22`, border: `1px solid ${a}44` }} />
        <div className="rounded-md bg-white/[0.05] border border-white/10" />
        <div className="rounded-md bg-white/[0.05] border border-white/10" />
        <div className="rounded-md" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
        <div className="rounded-md" style={{ background: `${a}18`, border: `1px solid ${a}33` }} />
      </div>
    </div>
  );
}

// Split: vertical split — text left, solid accent panel right.
function SplitBody({ a }: { a: string }) {
  return (
    <div className="h-full grid grid-cols-2">
      <div className="flex flex-col justify-center gap-2 px-4">
        <div className="h-1.5 w-8 rounded-full" style={{ background: a, opacity: 0.9 }} />
        <div className="h-3 w-5/6 rounded bg-white/12" />
        <div className="h-2 w-2/3 rounded bg-white/6" />
        <div className="h-5 w-16 rounded-lg mt-1" style={{ background: a }} />
      </div>
      <div className="relative" style={{ background: `linear-gradient(150deg, ${a}33 0%, ${a}11 100%)` }}>
        <div className="absolute inset-0 m-3 rounded-lg" style={{ background: `${a}22`, border: `1px solid ${a}55` }} />
      </div>
    </div>
  );
}
