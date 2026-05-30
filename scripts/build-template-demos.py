#!/usr/bin/env python3
"""Generate 5 standalone HTML template demos into public/templates/.
Each is a self-contained, dark-themed sample landing showing the layout style.
Placeholder content uses a generic business so the visitor judges layout, not copy.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "templates")
os.makedirs(OUT, exist_ok=True)

TEMPLATES = [
    ("aurora",   "Aurora",   "minimal",  "#bef264", "Minimal & airy"),
    ("monolith", "Monolith", "classic",  "#60a5fa", "Classic & structured"),
    ("halo",     "Halo",     "bigtype",  "#fb923c", "Bold typography"),
    ("mosaic",   "Mosaic",   "cards",    "#a78bfa", "Modular card grid"),
    ("split",    "Split",    "split",    "#34d399", "Split-screen editorial"),
]

BASE_CSS = """
*{margin:0;padding:0;box-sizing:border-box}
:root{--accent:__ACCENT__;--bg:#0a0a0a;--surface:#141414;--surface2:#1c1c1c;--border:rgba(255,255,255,.1);--fg:#fafafa;--muted:#a1a1aa;--subtle:#71717a}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}
.demo-bar{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,10,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);font-size:13px;color:var(--muted)}
.demo-bar .wrap{display:flex;align-items:center;justify-content:space-between;height:44px}
.demo-bar b{color:var(--fg)}
.demo-bar .badge{background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent);padding:3px 10px;border-radius:999px;font-weight:600}
header.site{position:sticky;top:44px;z-index:50;background:rgba(10,10,10,.7);backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{display:flex;align-items:center;gap:8px;font-weight:600}
.logo .dot{width:18px;height:18px;border-radius:6px;background:var(--accent)}
nav{display:flex;gap:28px;font-size:14px;color:var(--muted)}
nav a:hover{color:var(--fg)}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#0a0a0a;font-weight:600;padding:11px 20px;border-radius:12px;font-size:14px;transition:.2s}
.btn:hover{opacity:.9;transform:translateY(-1px)}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid rgba(255,255,255,.2)}
.eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:20px}
.muted{color:var(--muted)}
section{padding:90px 0}
.feature{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px}
.feature .ico{width:40px;height:40px;border-radius:10px;background:color-mix(in srgb,var(--accent) 18%,transparent);margin-bottom:16px}
.feature h3{font-size:18px;margin-bottom:8px}
.feature p{font-size:14px;color:var(--muted)}
footer.cta{text-align:center;background:linear-gradient(180deg,var(--surface),var(--bg));border-top:1px solid var(--border)}
footer.cta h2{font-size:clamp(28px,4vw,44px);margin-bottom:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:760px){.grid3{grid-template-columns:1fr}nav{display:none}}
"""

DEMO_BAR = """<div class="demo-bar"><div class="wrap"><span><b>%(name)s</b> · %(desc)s — demo template</span><span class="badge">€200</span></div></div>"""

HEADER = """<header class="site"><div class="wrap">
<div class="logo"><span class="dot"></span> YourBrand</div>
<nav><a href="#">Product</a><a href="#">Pricing</a><a href="#">About</a><a href="#">Contact</a></nav>
<a class="btn" href="#">Get started</a>
</div></header>"""

FOOTER = """<footer class="cta"><section><div class="wrap">
<div class="eyebrow">Ready when you are</div>
<h2>Let's build your landing page</h2>
<p class="muted" style="max-width:520px;margin:0 auto 28px">This is the <b style="color:var(--fg)">%(name)s</b> template. We fill it with your brand, content and language — live in 3 business days for €200.</p>
<a class="btn" href="#" style="padding:14px 28px;font-size:16px">Order this template →</a>
</div></section></footer>"""

FEATURES = """<section><div class="wrap">
<div class="grid3">
<div class="feature"><div class="ico"></div><h3>Fast delivery</h3><p>Your page goes live in three business days, fixed scope, fixed price.</p></div>
<div class="feature"><div class="ico"></div><h3>Built to convert</h3><p>Clear hierarchy, one strong call to action, mobile-first layout.</p></div>
<div class="feature"><div class="ico"></div><h3>Yours to keep</h3><p>Own the domain and the code. No lock-in, no surprises.</p></div>
</div>
</div></section>"""


def hero(style, accent):
    if style == "minimal":
        return """<section style="text-align:center;padding-top:150px"><div class="wrap" style="max-width:760px">
<div class="eyebrow">Minimal template</div>
<h1 style="font-size:clamp(40px,6vw,68px);line-height:1.05;letter-spacing:-.02em;font-weight:600;margin-bottom:24px">One clear message.<br>Nothing in the way.</h1>
<p class="muted" style="font-size:19px;max-width:520px;margin:0 auto 36px">Lots of whitespace, a single focus, a calm path to one button. Perfect when the offer speaks for itself.</p>
<a class="btn" href="#" style="padding:15px 30px;font-size:16px">Get started →</a>
</div></section>"""
    if style == "classic":
        return """<section style="padding-top:130px"><div class="wrap">
<div style="display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center">
<div>
<div class="eyebrow">Classic template</div>
<h1 style="font-size:clamp(34px,4.5vw,54px);line-height:1.1;letter-spacing:-.02em;font-weight:600;margin-bottom:20px">Corporate trust,<br>clear structure.</h1>
<p class="muted" style="font-size:17px;margin-bottom:28px">A familiar, dependable layout: top navigation, a confident hero, and a tidy feature grid. Built for B2B and established businesses.</p>
<div style="display:flex;gap:12px"><a class="btn" href="#">Request a quote</a><a class="btn ghost" href="#">Learn more</a></div>
</div>
<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:14px">
<div style="height:120px;border-radius:12px;background:linear-gradient(150deg,color-mix(in srgb,var(--accent) 35%,transparent),transparent)"></div>
<div style="height:12px;width:70%;background:rgba(255,255,255,.12);border-radius:6px"></div>
<div style="height:12px;width:45%;background:rgba(255,255,255,.07);border-radius:6px"></div>
</div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:56px;text-align:center">
<div><div style="font-size:30px;font-weight:600;color:var(--accent)">12+</div><div class="muted" style="font-size:13px">years</div></div>
<div><div style="font-size:30px;font-weight:600;color:var(--accent)">240</div><div class="muted" style="font-size:13px">clients</div></div>
<div><div style="font-size:30px;font-weight:600;color:var(--accent)">18</div><div class="muted" style="font-size:13px">countries</div></div>
<div><div style="font-size:30px;font-weight:600;color:var(--accent)">99%</div><div class="muted" style="font-size:13px">retention</div></div>
</div>
</div></section>"""
    if style == "bigtype":
        return """<section style="padding-top:150px;padding-bottom:40px"><div class="wrap">
<div class="eyebrow">Bold typography template</div>
<h1 style="font-size:clamp(52px,11vw,140px);line-height:.92;letter-spacing:-.04em;font-weight:700">
We make<br>it <span style="color:var(--accent)">obvious.</span></h1>
<div style="display:flex;align-items:center;gap:24px;margin-top:40px;flex-wrap:wrap">
<a class="btn" href="#" style="padding:16px 34px;font-size:17px">Start now →</a>
<p class="muted" style="font-size:17px;max-width:380px">When the headline carries the brand. Oversized type, minimal noise, maximum statement.</p>
</div>
</div></section>"""
    if style == "cards":
        return """<section style="padding-top:130px"><div class="wrap">
<div class="eyebrow">Modular card template</div>
<h1 style="font-size:clamp(32px,4.5vw,52px);line-height:1.1;letter-spacing:-.02em;font-weight:600;margin-bottom:36px;max-width:620px">Everything you offer, in one glance.</h1>
<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;grid-auto-rows:160px;gap:16px">
<div style="grid-row:span 2;border-radius:18px;padding:24px;background:linear-gradient(150deg,color-mix(in srgb,var(--accent) 30%,transparent),color-mix(in srgb,var(--accent) 8%,transparent));border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);display:flex;flex-direction:column;justify-content:flex-end"><h3 style="font-size:22px;margin-bottom:6px">Featured offer</h3><p class="muted" style="font-size:14px">The hero card draws the eye first.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service A</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service B</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service C</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px;background:color-mix(in srgb,var(--accent) 12%,var(--surface))"><h3 style="font-size:16px">Highlight</h3><p>An accent card for contrast.</p></div>
</div>
</div></section>"""
    # split
    return """<section style="padding:0;min-height:88vh;display:grid;grid-template-columns:1fr 1fr">
<div style="display:flex;flex-direction:column;justify-content:center;padding:60px 6vw">
<div class="eyebrow">Split-screen template</div>
<h1 style="font-size:clamp(34px,4.5vw,56px);line-height:1.08;letter-spacing:-.02em;font-weight:600;margin-bottom:22px">Text on one side.<br>Story on the other.</h1>
<p class="muted" style="font-size:17px;margin-bottom:30px;max-width:420px">An editorial, balanced layout. Message left, visual right — strong for products and personal brands.</p>
<div><a class="btn" href="#" style="padding:15px 30px;font-size:16px">See how it works →</a></div>
</div>
<div style="background:linear-gradient(150deg,color-mix(in srgb,var(--accent) 38%,#0a0a0a),#0a0a0a);position:relative">
<div style="position:absolute;inset:40px;border-radius:20px;background:color-mix(in srgb,var(--accent) 18%,transparent);border:1px solid color-mix(in srgb,var(--accent) 45%,transparent)"></div>
</div>
</section>"""


def build(slug, name, style, accent, desc):
    css = BASE_CSS.replace("__ACCENT__", accent)
    # split template hides the sticky header offset oddities — keep simple
    body = DEMO_BAR % {"name": name, "desc": desc}
    body += HEADER
    body += hero(style, accent)
    if style != "cards":  # cards hero already shows a grid; still add features for all
        body += FEATURES
    else:
        body += FEATURES
    body += FOOTER % {"name": name}
    html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{name} — template demo · €200</title>
<style>{css}</style>
</head><body>
{body}
</body></html>"""
    with open(os.path.join(OUT, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)
    return slug


for slug, name, style, accent, desc in TEMPLATES:
    build(slug, name, style, accent, desc)
    print("built", slug)
