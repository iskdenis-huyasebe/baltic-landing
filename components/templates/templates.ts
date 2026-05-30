// Single source of truth for the 5 universal landing templates.
// Display strings (name, tagline) come from i18n content under "templates.items".
// Visual identity (style, accent, demo file) lives here.

export type TemplateStyle = "minimal" | "classic" | "bigtype" | "cards" | "split";

export type Template = {
  id: string;
  style: TemplateStyle;
  accent: string;
  demo: string; // path under /public
};

export const TEMPLATES: Template[] = [
  { id: "aurora", style: "minimal", accent: "#bef264", demo: "/templates/aurora.html" },
  { id: "monolith", style: "classic", accent: "#60a5fa", demo: "/templates/monolith.html" },
  { id: "halo", style: "bigtype", accent: "#fb923c", demo: "/templates/halo.html" },
  { id: "mosaic", style: "cards", accent: "#a78bfa", demo: "/templates/mosaic.html" },
  { id: "split", style: "split", accent: "#34d399", demo: "/templates/split.html" },
];
