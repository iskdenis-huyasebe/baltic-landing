// Single source of truth for the 5 universal landing templates.
// Display strings (name, tagline) come from i18n content under "templates.items".
// Visual identity (style, palette, demo file) lives here so the preview and the
// standalone demo page stay in sync.

export type TemplateStyle =
  | "minimal"
  | "classic"
  | "bigtype"
  | "cards"
  | "split"
  | "spotlight";

export type TemplateTheme = {
  bg: string; // page background inside the browser frame
  fg: string; // primary text
  muted: string; // secondary text
  surface: string; // cards / panels
  border: string; // hairlines
  accent: string; // brand accent
  accent2?: string; // optional secondary tone (e.g. split panel)
  mode: "light" | "dark";
};

export type Template = {
  id: string;
  style: TemplateStyle;
  accent: string; // mirror of theme.accent for chips/badges in the gallery
  theme: TemplateTheme;
  demo: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "aurora",
    style: "minimal",
    accent: "#65a30d",
    demo: "/templates/aurora.html",
    theme: {
      mode: "light",
      bg: "#f6f6f1",
      fg: "#1a1a17",
      muted: "#6b6b63",
      surface: "#ffffff",
      border: "rgba(0,0,0,0.09)",
      accent: "#65a30d",
    },
  },
  {
    id: "monolith",
    style: "classic",
    accent: "#3b82f6",
    demo: "/templates/monolith.html",
    theme: {
      mode: "dark",
      bg: "#0b1220",
      fg: "#e8eef8",
      muted: "#90a2c0",
      surface: "#131d30",
      border: "rgba(255,255,255,0.09)",
      accent: "#3b82f6",
    },
  },
  {
    id: "halo",
    style: "bigtype",
    accent: "#f97316",
    demo: "/templates/halo.html",
    theme: {
      mode: "dark",
      bg: "#0a0a0a",
      fg: "#fafafa",
      muted: "#9a9a98",
      surface: "#171310",
      border: "rgba(255,255,255,0.10)",
      accent: "#f97316",
    },
  },
  {
    id: "mosaic",
    style: "cards",
    accent: "#7c3aed",
    demo: "/templates/mosaic.html",
    theme: {
      mode: "light",
      bg: "#f3f1fb",
      fg: "#211c33",
      muted: "#6b6585",
      surface: "#ffffff",
      border: "rgba(124,58,237,0.14)",
      accent: "#7c3aed",
    },
  },
  {
    id: "split",
    style: "split",
    accent: "#10b981",
    demo: "/templates/split.html",
    theme: {
      mode: "light",
      bg: "#faf8f3",
      fg: "#1b1a17",
      muted: "#6f6b61",
      surface: "#ffffff",
      border: "rgba(0,0,0,0.08)",
      accent: "#10b981",
      accent2: "#064e3b",
    },
  },
  {
    id: "pulse",
    style: "spotlight",
    accent: "#06b6d4",
    demo: "/templates/pulse.html",
    theme: {
      mode: "dark",
      bg: "#070b14",
      fg: "#eaf4f8",
      muted: "#8aa0b4",
      surface: "#0e1622",
      border: "rgba(255,255,255,0.09)",
      accent: "#06b6d4",
      accent2: "#6366f1",
    },
  },
];
