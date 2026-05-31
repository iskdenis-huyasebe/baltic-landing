"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Template } from "./templates";

// Renders the ACTUAL template demo page inside a scaled, non-interactive iframe.
// An optional `accent` live-updates the preview color via postMessage.
const BASE_W = 1280;
const BASE_H = 800;

export function TemplatePreview({
  template,
  selected,
  accent,
}: {
  template: Template;
  selected?: boolean;
  accent?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.3);

  // keep latest desired accent for the onLoad handler
  const desired = accent || template.theme.accent;
  const desiredRef = useRef(desired);
  desiredRef.current = desired;

  const pushAccent = () => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage({ type: "tpl-accent", accent: desiredRef.current }, "*");
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // re-push whenever the requested accent changes
  useEffect(() => {
    pushAccent();
  }, [desired]);

  return (
    <div
      ref={boxRef}
      className="aspect-[16/10] relative overflow-hidden rounded-t-xl"
      style={{ background: template.theme.bg }}
    >
      <iframe
        ref={iframeRef}
        src={template.demo}
        title={template.id}
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={pushAccent}
        className="absolute top-0 left-0 origin-top-left pointer-events-none select-none border-0"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
      />
      <div className="absolute inset-0" />

      {selected && (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-[var(--accent)] flex items-center justify-center z-20">
          <Check className="size-3.5 text-[var(--accent-foreground)]" />
        </div>
      )}
    </div>
  );
}
