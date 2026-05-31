#!/usr/bin/env python3
"""Generate 6 standalone, visually distinct HTML template demos into public/templates/.
Each template renders in its OWN theme (light/dark + palette) and its OWN layout,
so they read as six different products rather than recolors of one page.
Placeholder content uses a generic business so the visitor judges layout, not copy.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "templates")
os.makedirs(OUT, exist_ok=True)

# id, name, style, desc, theme dict (mirrors components/templates/templates.ts)
TEMPLATES = [
    ("aurora", "Aurora", "minimal", "Minimal & airy", dict(
        mode="light", bg="#f6f6f1", fg="#1a1a17", muted="#6b6b63",
        surface="#ffffff", border="rgba(0,0,0,.09)", accent="#65a30d", accent2="#84cc16")),
    ("monolith", "Monolith", "classic", "Classic & structured", dict(
        mode="dark", bg="#0b1220", fg="#e8eef8", muted="#90a2c0",
        surface="#131d30", border="rgba(255,255,255,.09)", accent="#3b82f6", accent2="#60a5fa")),
    ("halo", "Halo", "bigtype", "Bold typography", dict(
        mode="dark", bg="#0a0a0a", fg="#fafafa", muted="#9a9a98",
        surface="#171310", border="rgba(255,255,255,.10)", accent="#f97316", accent2="#fb923c")),
    ("mosaic", "Mosaic", "cards", "Modular card grid", dict(
        mode="light", bg="#f3f1fb", fg="#211c33", muted="#6b6585",
        surface="#ffffff", border="rgba(124,58,237,.14)", accent="#7c3aed", accent2="#a78bfa")),
    ("split", "Split", "split", "Split-screen editorial", dict(
        mode="light", bg="#faf8f3", fg="#1b1a17", muted="#6f6b61",
        surface="#ffffff", border="rgba(0,0,0,.08)", accent="#10b981", accent2="#064e3b")),
    ("pulse", "Pulse", "spotlight", "Modern SaaS spotlight", dict(
        mode="dark", bg="#070b14", fg="#eaf4f8", muted="#8aa0b4",
        surface="#0e1622", border="rgba(255,255,255,.09)", accent="#06b6d4", accent2="#6366f1")),
]


def base_css(t):
    head_font = "'Georgia', 'Times New Roman', serif" if t["style"] in ("split",) else \
        "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif"
    chip_bg = "rgba(255,255,255,.06)" if t["mode"] == "dark" else "rgba(0,0,0,.05)"
    soft = "rgba(255,255,255,.06)" if t["mode"] == "dark" else "rgba(0,0,0,.05)"
    return f"""
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--bg:{t['bg']};--fg:{t['fg']};--muted:{t['muted']};--surface:{t['surface']};--border:{t['border']};--accent:{t['accent']};--accent2:{t.get('accent2', t['accent'])};--soft:{soft}}}
html{{scroll-behavior:smooth}}
body{{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;line-height:1.55;-webkit-font-smoothing:antialiased}}
h1,h2,h3{{font-family:{head_font}}}
a{{color:inherit;text-decoration:none}}
.wrap{{max-width:1080px;margin:0 auto;padding:0 24px}}
.demo-bar{{position:fixed;top:0;left:0;right:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--border);font-size:13px;color:var(--muted)}}
.demo-bar .wrap{{display:flex;align-items:center;justify-content:space-between;height:44px}}
.demo-bar b{{color:var(--fg)}}
.demo-bar .badge{{background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--accent);padding:3px 10px;border-radius:999px;font-weight:700}}
header.site{{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 80%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}}
header.site .wrap{{display:flex;align-items:center;justify-content:space-between;height:64px}}
.logo{{display:flex;align-items:center;gap:8px;font-weight:700}}
.logo .dot{{width:18px;height:18px;border-radius:6px;background:var(--accent)}}
nav{{display:flex;gap:26px;font-size:14px;color:var(--muted)}}
nav a:hover{{color:var(--fg)}}
.btn{{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;font-weight:600;padding:12px 22px;border-radius:12px;font-size:14px;transition:.2s;border:none;cursor:pointer}}
.btn:hover{{filter:brightness(1.05);transform:translateY(-1px)}}
.btn.ghost{{background:transparent;color:var(--fg);border:1px solid var(--border)}}
.eyebrow{{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:18px}}
.muted{{color:var(--muted)}}
section{{padding:88px 0}}
.feature{{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:26px}}
.feature .ico{{width:40px;height:40px;border-radius:10px;background:color-mix(in srgb,var(--accent) 20%,transparent);margin-bottom:16px}}
.feature h3{{font-size:18px;margin-bottom:8px}}
.feature p{{font-size:14px;color:var(--muted)}}
.grid3{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}}
footer.cta{{text-align:center;border-top:1px solid var(--border);background:color-mix(in srgb,var(--accent) 6%,var(--bg))}}
footer.cta h2{{font-size:clamp(28px,4vw,44px);margin-bottom:16px}}
@media(max-width:760px){{.grid3{{grid-template-columns:1fr}}nav{{display:none}}}}
"""


DEMO_BAR = '<div class="demo-bar"><div class="wrap"><span><b>{name}</b> · {desc} — demo template</span><span class="badge">€200</span></div></div>'
HEADER = '<header class="site"><div class="wrap"><div class="logo"><span class="dot"></span> YourBrand</div><nav><a href="#">Product</a><a href="#">Pricing</a><a href="#">About</a><a href="#">Contact</a></nav><a class="btn" href="#">Get started</a></div></header>'
FEATURES = '<section><div class="wrap"><div class="grid3"><div class="feature"><div class="ico"></div><h3>Fast delivery</h3><p>Your page goes live in three business days, fixed scope, fixed price.</p></div><div class="feature"><div class="ico"></div><h3>Built to convert</h3><p>Clear hierarchy, one strong call to action, mobile-first layout.</p></div><div class="feature"><div class="ico"></div><h3>Yours to keep</h3><p>Own the domain and the code. No lock-in, no surprises.</p></div></div></div></section>'
FOOTER = '<footer class="cta"><section><div class="wrap"><div class="eyebrow">Ready when you are</div><h2>Let\'s build your landing page</h2><p class="muted" style="max-width:520px;margin:0 auto 28px">This is the <b style="color:var(--fg)">{name}</b> template. We fill it with your brand, content and language — live in 3 business days for €200.</p><a class="btn" href="#" style="padding:14px 28px;font-size:16px">Order this template →</a></div></section></footer>'


def hero(style):
    if style == "minimal":
        return """<section style="text-align:center;padding-top:150px"><div class="wrap" style="max-width:740px">
<div class="eyebrow">Minimal template</div>
<h1 style="font-size:clamp(40px,6vw,66px);line-height:1.05;letter-spacing:-.02em;font-weight:600;margin-bottom:22px">One clear message.<br>Nothing in the way.</h1>
<p class="muted" style="font-size:19px;max-width:500px;margin:0 auto 34px">Lots of whitespace, a single focus, a calm path to one button.</p>
<a class="btn" href="#" style="padding:15px 30px;font-size:16px;border-radius:999px">Get started →</a>
</div></section>"""
    if style == "classic":
        return """<section style="padding-top:120px"><div class="wrap">
<div style="display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center">
<div><div class="eyebrow">Classic template</div>
<h1 style="font-size:clamp(34px,4.5vw,52px);line-height:1.1;letter-spacing:-.02em;font-weight:600;margin-bottom:18px">Corporate trust,<br>clear structure.</h1>
<p class="muted" style="font-size:17px;margin-bottom:26px">Top navigation, a confident hero, a tidy feature grid. Built for B2B and established businesses.</p>
<div style="display:flex;gap:12px"><a class="btn" href="#">Request a quote</a><a class="btn ghost" href="#">Learn more</a></div></div>
<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;display:flex;flex-direction:column;gap:14px">
<div style="height:120px;border-radius:12px;background:linear-gradient(150deg,color-mix(in srgb,var(--accent) 40%,transparent),transparent)"></div>
<div style="height:12px;width:70%;background:var(--soft);border-radius:6px"></div>
<div style="height:12px;width:45%;background:var(--soft);border-radius:6px"></div></div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:54px;text-align:center">
<div><div style="font-size:30px;font-weight:700;color:var(--accent)">12+</div><div class="muted" style="font-size:13px">years</div></div>
<div><div style="font-size:30px;font-weight:700;color:var(--accent)">240</div><div class="muted" style="font-size:13px">clients</div></div>
<div><div style="font-size:30px;font-weight:700;color:var(--accent)">18</div><div class="muted" style="font-size:13px">countries</div></div>
<div><div style="font-size:30px;font-weight:700;color:var(--accent)">99%</div><div class="muted" style="font-size:13px">retention</div></div></div>
</div></section>"""
    if style == "bigtype":
        return """<section style="padding-top:150px;padding-bottom:30px"><div class="wrap">
<div class="eyebrow">Bold typography template</div>
<h1 style="font-size:clamp(52px,11vw,140px);line-height:.92;letter-spacing:-.04em;font-weight:800">We make<br>it <span style="color:var(--accent)">obvious.</span></h1>
<div style="display:flex;align-items:center;gap:24px;margin-top:38px;flex-wrap:wrap">
<a class="btn" href="#" style="padding:16px 34px;font-size:17px">Start now →</a>
<p class="muted" style="font-size:17px;max-width:380px">When the headline carries the brand. Oversized type, minimal noise.</p></div>
</div></section>"""
    if style == "cards":
        return """<section style="padding-top:120px"><div class="wrap">
<div class="eyebrow">Modular card template</div>
<h1 style="font-size:clamp(32px,4.5vw,50px);line-height:1.1;letter-spacing:-.02em;font-weight:600;margin-bottom:34px;max-width:600px">Everything you offer, in one glance.</h1>
<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;grid-auto-rows:158px;gap:16px">
<div style="grid-row:span 2;border-radius:18px;padding:24px;background:linear-gradient(150deg,var(--accent),var(--accent2));color:#fff;display:flex;flex-direction:column;justify-content:flex-end"><h3 style="font-size:22px;margin-bottom:6px;color:#fff">Featured offer</h3><p style="font-size:14px;opacity:.9">The hero card draws the eye first.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service A</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service B</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px"><h3 style="font-size:16px">Service C</h3><p>Short supporting line.</p></div>
<div class="feature" style="padding:20px;background:color-mix(in srgb,var(--accent) 12%,var(--surface))"><h3 style="font-size:16px">Highlight</h3><p>An accent card for contrast.</p></div>
</div></div></section>"""
    if style == "split":
        return """<section style="padding:0;min-height:86vh;display:grid;grid-template-columns:1fr 1fr">
<div style="display:flex;flex-direction:column;justify-content:center;padding:60px 6vw">
<div class="eyebrow">Split-screen template</div>
<h1 style="font-size:clamp(34px,4.5vw,56px);line-height:1.08;letter-spacing:-.01em;font-weight:600;margin-bottom:20px">Text on one side.<br>Story on the other.</h1>
<p class="muted" style="font-size:17px;margin-bottom:28px;max-width:400px">An editorial, balanced layout. Message left, visual right — strong for products and personal brands.</p>
<div><a class="btn" href="#" style="padding:15px 30px;font-size:16px">See how it works →</a></div></div>
<div style="background:linear-gradient(160deg,var(--accent2),#000);position:relative">
<div style="position:absolute;inset:38px;border-radius:18px;background:color-mix(in srgb,var(--accent) 22%,transparent);border:1px solid color-mix(in srgb,var(--accent) 50%,transparent)"></div></div>
</section>"""
    # spotlight
    return """<section style="position:relative;text-align:center;padding-top:150px;overflow:hidden">
<div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:680px;height:420px;background:radial-gradient(ellipse,color-mix(in srgb,var(--accent) 40%,transparent),transparent 65%);filter:blur(20px);pointer-events:none"></div>
<div class="wrap" style="position:relative;max-width:760px">
<div class="eyebrow">SaaS spotlight template</div>
<h1 style="font-size:clamp(38px,6vw,64px);line-height:1.05;letter-spacing:-.02em;font-weight:700;margin-bottom:20px">The product,<br>front and center.</h1>
<p class="muted" style="font-size:18px;max-width:480px;margin:0 auto 30px">Gradient glow, a single device shot, a row of trust logos. The modern SaaS landing pattern.</p>
<a class="btn" href="#" style="padding:15px 32px;font-size:16px;background:linear-gradient(90deg,var(--accent),var(--accent2))">Try it free →</a>
<div style="margin-top:44px;height:280px;border-radius:18px;background:var(--surface);border:1px solid color-mix(in srgb,var(--accent) 30%,var(--border));box-shadow:0 30px 80px -20px color-mix(in srgb,var(--accent) 30%,transparent)"></div>
<div style="display:flex;justify-content:center;gap:34px;margin-top:32px;opacity:.5">
<div style="width:70px;height:16px;background:var(--soft);border-radius:5px"></div>
<div style="width:70px;height:16px;background:var(--soft);border-radius:5px"></div>
<div style="width:70px;height:16px;background:var(--soft);border-radius:5px"></div>
<div style="width:70px;height:16px;background:var(--soft);border-radius:5px"></div></div>
</div></section>"""


def build(slug, name, style, desc, theme):
    t = dict(theme); t["style"] = style
    css = base_css(t)
    body = HEADER + hero(style) + FEATURES + FOOTER.format(name=name)
    accent_script = (
        "<script>(function(){function s(c){if(c){"
        "document.documentElement.style.setProperty('--accent',c);}}"
        "try{var p=new URLSearchParams(location.search);s(p.get('accent'));}catch(e){}"
        "window.addEventListener('message',function(e){var d=e.data;"
        "if(d&&d.type==='tpl-accent'){s(d.accent);}});})();</script>"
    )
    html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{name} — template demo · €200</title>
<style>{css}</style>
</head><body>
{body}
{accent_script}
</body></html>"""
    with open(os.path.join(OUT, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)


for slug, name, style, desc, theme in TEMPLATES:
    build(slug, name, style, desc, theme)
    print("built", slug)
