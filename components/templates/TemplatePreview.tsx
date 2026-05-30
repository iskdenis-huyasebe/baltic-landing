"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Template } from "./templates";

// Renders the ACTUAL template demo page inside a scaled, non-interactive iframe,
// so the preview looks like a real finished landing — not a wireframe skeleton.
const BASE_W = 1280; // virtual viewport width the demo is rendered at
const BASE_H = 800; // 1280x800 ≈ 16:10, matches the card aspect ratio

export function TemplatePreview({
  template,
  selected,
}: {
  template: Template;
  selected?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="aspect-[16/10] relative overflow-hidden rounded-t-xl"
      style={{ background: template.theme.bg }}
    >
      <iframe
        src={template.demo}
        title={template.id}
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute top-0 left-0 origin-top-left pointer-events-none select-none border-0"
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
        }}
      />
      {/* transparent shield so clicks go to the card, never the iframe */}
      <div className="absolute inset-0" />

      {selected && (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-[var(--accent)] flex items-center justify-center z-20">
          <Check className="size-3.5 text-[var(--accent-foreground)]" />
        </div>
      )}
    </div>
  );
}
