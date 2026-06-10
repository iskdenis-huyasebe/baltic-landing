#!/usr/bin/env python3
"""Generate 3 filled example demo pages for the Showcase before/after slider.
Each page uses a real template style but filled with a fictional Baltic business.
Content is in Lithuanian (primary market). Honest disclaimer shown in each demo.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "templates")
os.makedirs(OUT, exist_ok=True)

BASE_CSS = """
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:%(bg)s;--fg:%(fg)s;--muted:%(muted)s;--surface:%(surface)s;--border:%(border)s;--accent:%(accent)s;--accent2:%(accent2)s}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}
.eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px}
.muted{color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;font-weight:600;padding:13px 24px;border-radius:12px;font-size:15px;cursor:pointer;border:none}
.btn:hover{filter:brightness(1.05)}
.btn.ghost{background:transparent;border:1px solid var(--border);color:var(--fg)}
header.site{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 85%%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:700;font-size:17px;display:flex;align-items:center;gap:8px}
.logo .dot{width:20px;height:20px;border-radius:6px;background:var(--accent)}
nav{display:flex;gap:24px;font-size:14px;color:var(--muted)}
nav a:hover{color:var(--fg)}
.disclaimer{position:fixed;bottom:12px;left:50%%;transform:translateX(-50%%);background:rgba(0,0,0,.7);color:#fff;font-size:11px;padding:5px 14px;border-radius:999px;z-index:100;white-space:nowrap;pointer-events:none}
@media(max-width:700px){nav{display:none}}
"""


# ─── MONOLITH AUTO ────────────────────────────────────────────────────────────
def build_auto():
    t = dict(
        bg="#0b1220", fg="#e8eef8", muted="#90a2c0",
        surface="#131d30", border="rgba(255,255,255,.09)",
        accent="#3b82f6", accent2="#60a5fa"
    )
    css = BASE_CSS % t + """
section{padding:80px 0}
.hero{padding-top:120px;padding-bottom:60px}
.badge{display:inline-flex;align-items:center;gap:6px;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);color:#93c5fd;font-size:12px;font-weight:600;padding:5px 14px;border-radius:999px;margin-bottom:22px;letter-spacing:.04em}
h1{font-size:clamp(36px,5.5vw,58px);line-height:1.06;letter-spacing:-.02em;font-weight:700;margin-bottom:18px}
.hero p{font-size:18px;color:var(--muted);max-width:520px;margin-bottom:30px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-top:60px}
.stat{background:var(--surface);padding:20px;text-align:center}
.stat strong{display:block;font-size:26px;font-weight:700;color:var(--accent)}
.stat span{font-size:13px;color:var(--muted)}
.services-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:36px}
.service-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px}
.service-card .ico{width:40px;height:40px;border-radius:10px;background:rgba(59,130,246,.15);margin-bottom:14px;display:flex;align-items:center;justify-content:center;font-size:18px}
.service-card h3{font-size:17px;font-weight:600;margin-bottom:6px}
.service-card p{font-size:14px;color:var(--muted);margin-bottom:12px}
.service-card .price{font-size:13px;font-weight:700;color:var(--accent)}
.cta-section{text-align:center;background:linear-gradient(135deg,rgba(59,130,246,.08),rgba(96,165,250,.04));border:1px solid rgba(59,130,246,.15);border-radius:24px;padding:60px 40px}
.cta-section h2{font-size:clamp(28px,4vw,42px);font-weight:700;margin-bottom:14px}
.trust-row{display:flex;justify-content:center;gap:28px;margin-top:22px;flex-wrap:wrap}
.trust-item{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:6px}
.trust-item::before{content:"✓";color:var(--accent);font-weight:700}
@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}.services-grid{grid-template-columns:1fr}}
"""
    html = f"""<!DOCTYPE html>
<html lang="lt"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>AutoPro Vilnius — autoservisas</title>
<style>{css}</style>
</head><body>

<header class="site">
  <div class="wrap">
    <div class="logo"><span class="dot"></span> AutoPro Vilnius</div>
    <nav>
      <a href="#">Paslaugos</a>
      <a href="#">Kainos</a>
      <a href="#">Apie mus</a>
      <a href="#">Kontaktai</a>
    </nav>
    <a class="btn" href="#" style="padding:10px 20px;font-size:14px">Registruotis</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="badge">⭐ 4.8 Google · Ozo g. 25, Vilnius</div>
    <h1>Jūsų automobilis —<br>mūsų atsakomybė</h1>
    <p>Diagnostika, remontas ir techninė priežiūra Vilniuje. Dirbame su visais markiais. Darbai su 12 mėn. garantija.</p>
    <div class="hero-actions">
      <a class="btn" href="#">Registruotis online →</a>
      <a class="btn ghost" href="#">+370 600 00000</a>
    </div>
    <div class="stats">
      <div class="stat"><strong>8+</strong><span>metų patirtis</span></div>
      <div class="stat"><strong>2 400+</strong><span>klientų</span></div>
      <div class="stat"><strong>12 mėn.</strong><span>garantija</span></div>
      <div class="stat"><strong>1 d.d.</strong><span>vid. laikas</span></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow">Paslaugos</div>
    <h2 style="font-size:clamp(26px,3.5vw,38px);font-weight:700;margin-bottom:8px">Viskas vienoje vietoje</h2>
    <p class="muted" style="font-size:16px;margin-bottom:0">Nuo diagnostikos iki pilno remonto — dirbame greitai ir skaidriai.</p>
    <div class="services-grid">
      <div class="service-card">
        <div class="ico">🔧</div>
        <h3>Kompiuterinė diagnostika</h3>
        <p>Tikslus gedimų nustatymas per 30 min. Išduodame diagnostikos ataskaitą.</p>
        <div class="price">nuo 25 €</div>
      </div>
      <div class="service-card">
        <div class="ico">🛞</div>
        <h3>Padangų keitimas ir balansavimas</h3>
        <p>Greitai ir tiksliai. Saugome padangas sezono metu. Galima užsiregistruoti iš anksto.</p>
        <div class="price">nuo 40 €</div>
      </div>
      <div class="service-card">
        <div class="ico">🛑</div>
        <h3>Stabdžių sistema</h3>
        <p>Diskų, kaladėlių ir skysčio patikra bei keitimas. Saugumas pirmiausia.</p>
        <div class="price">nuo 60 €</div>
      </div>
      <div class="service-card">
        <div class="ico">📋</div>
        <h3>Techninė apžiūra (TA)</h3>
        <p>Paruošiame automobilį TA: tikriname visus mazgus, pašaliname gedimus.</p>
        <div class="price">nuo 35 €</div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta-section">
      <div class="eyebrow">Registracija</div>
      <h2>Rezervuokite laiką internetu</h2>
      <p class="muted" style="font-size:16px;max-width:440px;margin:0 auto 28px">Pasirinkite paslaugą ir patogų laiką. Patvirtinimas per 15 min.</p>
      <a class="btn" href="#" style="padding:15px 32px;font-size:16px">Registruotis dabar →</a>
      <div class="trust-row">
        <div class="trust-item">Darbai su garantija</div>
        <div class="trust-item">Nemokama diagnostika</div>
        <div class="trust-item">Skaidri kaina</div>
      </div>
    </div>
  </div>
</section>

<div class="disclaimer">Pavyzdys · Fiktyvus verslas</div>
</body></html>"""
    with open(os.path.join(OUT, "monolith-auto.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("built monolith-auto.html")


# ─── AURORA BEAUTY ────────────────────────────────────────────────────────────
def build_beauty():
    t = dict(
        bg="#f6f6f1", fg="#1a1a17", muted="#6b6b63",
        surface="#ffffff", border="rgba(0,0,0,.09)",
        accent="#65a30d", accent2="#84cc16"
    )
    css = BASE_CSS % t + """
section{padding:80px 0}
.hero{padding-top:140px;padding-bottom:60px;text-align:center}
.tag{display:inline-block;background:rgba(101,163,13,.1);color:#4d7c0f;font-size:12px;font-weight:600;padding:5px 14px;border-radius:999px;margin-bottom:20px;letter-spacing:.06em;text-transform:uppercase}
h1{font-size:clamp(38px,5.5vw,62px);line-height:1.06;letter-spacing:-.02em;font-weight:600;margin-bottom:18px;max-width:640px;margin-left:auto;margin-right:auto}
.hero p{font-size:18px;color:var(--muted);max-width:460px;margin:0 auto 32px}
.hero-row{display:flex;justify-content:center;gap:28px;margin-top:40px;flex-wrap:wrap}
.hero-stat{text-align:center}
.hero-stat strong{display:block;font-size:22px;font-weight:700;color:var(--fg)}
.hero-stat span{font-size:13px;color:var(--muted)}
.services{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.svc{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;text-align:center;transition:.2s}
.svc:hover{border-color:var(--accent);transform:translateY(-3px)}
.svc .emoji{font-size:28px;margin-bottom:14px}
.svc h3{font-size:17px;font-weight:600;margin-bottom:8px}
.svc p{font-size:14px;color:var(--muted);margin-bottom:14px}
.svc .price{font-size:13px;font-weight:700;color:var(--accent)}
.team{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.member{text-align:center}
.member .avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));margin:0 auto 12px}
.member h4{font-size:15px;font-weight:600;margin-bottom:4px}
.member span{font-size:13px;color:var(--muted)}
.cta-wrap{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:60px;text-align:center;margin-top:0}
.cta-wrap h2{font-size:clamp(26px,3.5vw,38px);font-weight:600;margin-bottom:12px}
@media(max-width:700px){.services,.team{grid-template-columns:1fr}.cta-wrap{padding:36px 24px}}
"""
    html = f"""<!DOCTYPE html>
<html lang="lt"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Glow Studio — grožio studija Vilniuje</title>
<style>{css}</style>
</head><body>

<header class="site">
  <div class="wrap">
    <div class="logo"><span class="dot"></span> Glow Studio</div>
    <nav>
      <a href="#">Paslaugos</a>
      <a href="#">Komanada</a>
      <a href="#">Kainos</a>
      <a href="#">Kontaktai</a>
    </nav>
    <a class="btn" href="#" style="padding:10px 20px;font-size:14px">Registruotis</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="tag">✦ Grožio studija · Vilnius</div>
    <h1>Grožis, kuris<br>kyla iš vidaus</h1>
    <p>Profesionali veido ir kūno priežiūra Vilniaus Naujamiestyje. Registruokitės internetu — per 2 minutes.</p>
    <a class="btn" href="#" style="padding:14px 30px;font-size:16px;border-radius:999px">Rezervuoti laiką →</a>
    <div class="hero-row">
      <div class="hero-stat"><strong>4.9 ★</strong><span>Google reitingas</span></div>
      <div class="hero-stat"><strong>800+</strong><span>laimingų klientų</span></div>
      <div class="hero-stat"><strong>5 m.</strong><span>patirtis</span></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow" style="text-align:center">Paslaugos</div>
    <h2 style="font-size:clamp(26px,3.5vw,38px);font-weight:600;text-align:center;margin-bottom:8px">Jūsų grožio rutina</h2>
    <p class="muted" style="text-align:center;font-size:16px;max-width:480px;margin:0 auto 0">Kiekviena procedūra — individuali programa jūsų odai ir savijautai.</p>
    <div class="services">
      <div class="svc">
        <div class="emoji">✨</div>
        <h3>Veido procedūros</h3>
        <p>Giluminis valymas, drėkinimas, antisenėjimo programos. Individuali programa kiekvienai klientei.</p>
        <div class="price">nuo 45 €</div>
      </div>
      <div class="svc">
        <div class="emoji">💆</div>
        <h3>Masažai</h3>
        <p>Relaksacinis, sportinis, akmens terapija. 60 arba 90 min. procedūros.</p>
        <div class="price">nuo 55 €</div>
      </div>
      <div class="svc">
        <div class="emoji">💅</div>
        <h3>Nagų priežiūra</h3>
        <p>Manikiūras, pedikiūras, gelinis lakas. Ilgalaikis rezultatas iki 4 savaičių.</p>
        <div class="price">nuo 25 €</div>
      </div>
    </div>
  </div>
</section>

<section style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
  <div class="wrap">
    <div class="eyebrow" style="text-align:center">Komanda</div>
    <h2 style="font-size:clamp(24px,3vw,34px);font-weight:600;text-align:center;margin-bottom:36px">Jūsų meistrai</h2>
    <div class="team">
      <div class="member">
        <div class="avatar"></div>
        <h4>Aistė Petrauskienė</h4>
        <span>Veido terapeutė · 7 m.</span>
      </div>
      <div class="member">
        <div class="avatar" style="background:linear-gradient(135deg,#84cc16,#65a30d)"></div>
        <h4>Rūta Kazlauskaitė</h4>
        <span>Masažo terapeutė · 5 m.</span>
      </div>
      <div class="member">
        <div class="avatar" style="background:linear-gradient(135deg,#a3e635,#84cc16)"></div>
        <h4>Viktorija Jankauskaitė</h4>
        <span>Nagų meistras · 4 m.</span>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta-wrap">
      <div class="eyebrow">Registracija</div>
      <h2>Rezervuokite laiką šiandien</h2>
      <p class="muted" style="font-size:16px;max-width:400px;margin:0 auto 28px">Internetu — greita ir paprasta. Patvirtinsime per 30 min.</p>
      <a class="btn" href="#" style="padding:15px 32px;font-size:16px;border-radius:999px">Registruotis dabar →</a>
      <p class="muted" style="font-size:13px;margin-top:16px">Pylimo g. 4, Vilnius · 9:00–19:00, I–Š</p>
    </div>
  </div>
</section>

<div class="disclaimer">Pavyzdys · Fiktyvus verslas</div>
</body></html>"""
    with open(os.path.join(OUT, "aurora-beauty.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("built aurora-beauty.html")


# ─── SPLIT LEGAL ──────────────────────────────────────────────────────────────
def build_legal():
    t = dict(
        bg="#faf8f3", fg="#1b1a17", muted="#6f6b61",
        surface="#ffffff", border="rgba(0,0,0,.08)",
        accent="#10b981", accent2="#064e3b"
    )
    css = BASE_CSS % t + """
body{font-family:'Georgia','Times New Roman',serif}
nav,header .btn,.eyebrow,.tag,.price,.trust-item{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif}
section{padding:80px 0}
.hero{padding-top:0;min-height:86vh;display:grid;grid-template-columns:1fr 1fr}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 7vw 80px 7vw}
.hero-right{background:linear-gradient(160deg,var(--accent2),#0a0a0a);position:relative;display:flex;align-items:center;justify-content:center}
.hero-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:32px;color:#fff;width:280px}
.hero-card .label{font-family:-apple-system,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:18px}
.hero-card .item{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-family:-apple-system,sans-serif;font-size:14px}
.hero-card .item .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0}
.tag{display:inline-block;background:rgba(16,185,129,.1);color:#059669;font-size:12px;font-weight:600;padding:5px 14px;border-radius:6px;margin-bottom:18px;letter-spacing:.04em}
h1{font-size:clamp(34px,4vw,52px);line-height:1.08;letter-spacing:-.01em;font-weight:400;margin-bottom:18px}
.hero-left p{font-size:17px;color:var(--muted);margin-bottom:28px;max-width:380px;font-family:-apple-system,sans-serif;line-height:1.6}
.services{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-top:40px}
.svc{padding:28px;border-bottom:1px solid var(--border)}
.svc:nth-child(odd){border-right:1px solid var(--border)}
.svc:nth-last-child(-n+2){border-bottom:none}
.svc h3{font-size:17px;font-weight:600;margin-bottom:8px;font-family:-apple-system,sans-serif}
.svc p{font-size:14px;color:var(--muted);font-family:-apple-system,sans-serif}
.svc .price{margin-top:10px;font-size:13px;font-weight:700;color:var(--accent);font-family:-apple-system,sans-serif}
.cta-band{background:var(--accent2);color:#fff;padding:60px 0;text-align:center}
.cta-band h2{font-size:clamp(26px,3vw,38px);font-weight:400;margin-bottom:14px;color:#fff}
.cta-band p{font-size:16px;opacity:.75;max-width:440px;margin:0 auto 28px;font-family:-apple-system,sans-serif}
.trust-row{display:flex;justify-content:center;gap:24px;margin-top:20px;flex-wrap:wrap}
.trust-item{font-size:13px;opacity:.8;display:flex;align-items:center;gap:6px;font-family:-apple-system,sans-serif}
.trust-item::before{content:"✓";color:var(--accent);font-weight:700;opacity:1}
@media(max-width:700px){.hero{grid-template-columns:1fr;min-height:auto}.hero-right{height:260px}.services{grid-template-columns:1fr}.svc:nth-child(odd){border-right:none}}
"""
    html = f"""<!DOCTYPE html>
<html lang="lt"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Lex Baltica — teisės konsultacijos</title>
<style>{css}</style>
</head><body>

<header class="site">
  <div class="wrap">
    <div class="logo" style="font-family:Georgia,serif;font-weight:400;font-size:18px"><span class="dot"></span> Lex Baltica</div>
    <nav style="font-family:-apple-system,sans-serif">
      <a href="#">Paslaugos</a>
      <a href="#">Komanda</a>
      <a href="#">Klientams</a>
      <a href="#">Kontaktai</a>
    </nav>
    <a class="btn" href="#" style="padding:10px 20px;font-size:14px;font-family:-apple-system,sans-serif">Konsultacija</a>
  </div>
</header>

<section class="hero">
  <div class="hero-left">
    <div class="tag">Advokatų kontora · Vilnius</div>
    <h1>Teisė<br>jūsų pusėje</h1>
    <p>Verslo ir darbo teisės konsultacijos. Greiti atsakymai, aiški kaina, patikimi rezultatai.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a class="btn" href="#" style="font-family:-apple-system,sans-serif">Gauti konsultaciją →</a>
      <a class="btn ghost" href="#" style="font-family:-apple-system,sans-serif">Apie mus</a>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-card">
      <div class="label">Mūsų specializacija</div>
      <div class="item"><span class="dot"></span> Verslo teisė ir sutartys</div>
      <div class="item"><span class="dot"></span> Darbo ginčai</div>
      <div class="item"><span class="dot"></span> NT sandoriai</div>
      <div class="item"><span class="dot"></span> Įmonių steigimas</div>
      <div class="item"><span class="dot"></span> Duomenų apsauga (BDAR)</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow" style="font-family:-apple-system,sans-serif">Paslaugos</div>
    <h2 style="font-size:clamp(26px,3.5vw,38px);margin-bottom:8px;font-weight:400">Teikiamos paslaugos</h2>
    <p class="muted" style="font-size:16px;font-family:-apple-system,sans-serif;max-width:500px">Dirbame greitai ir skaidriai. Pirma konsultacija — jau rytoj.</p>
    <div class="services">
      <div class="svc">
        <h3>Verslo teisė</h3>
        <p>Sutarčių rengimas ir peržiūra, komerciniai ginčai, partnerystės susitarimai.</p>
        <div class="price">nuo 60 €/val.</div>
      </div>
      <div class="svc">
        <h3>Darbo ginčai</h3>
        <p>Atleidimas, diskriminacija, darbo sutarčių ginčai. Atstovaujame darbuotojams ir darbdaviams.</p>
        <div class="price">nuo 60 €/val.</div>
      </div>
      <div class="svc">
        <h3>NT sandoriai</h3>
        <p>Pirkimo-pardavimo sutartys, hipotekos, nuoma. Greitai tikriname dokumentus.</p>
        <div class="price">nuo 80 €</div>
      </div>
      <div class="svc">
        <h3>Įmonių steigimas</h3>
        <p>MB, UAB ar kitos formos įsteigimas per 3 d.d. Pilnas dokumentų paketas.</p>
        <div class="price">nuo 150 €</div>
      </div>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap">
    <h2>Rezervuokite konsultaciją</h2>
    <p>Pirmoji konsultacija — 30 min. Atsakysime į pagrindinius klausimus ir įvertinsime situaciją.</p>
    <a class="btn" href="#" style="background:var(--accent);padding:15px 32px;font-size:16px;font-family:-apple-system,sans-serif">Registruotis →</a>
    <div class="trust-row">
      <div class="trust-item">Konfidencialumas</div>
      <div class="trust-item">Aiški kaina iš anksto</div>
      <div class="trust-item">Gedimino pr. 1, Vilnius</div>
    </div>
  </div>
</section>

<div class="disclaimer">Pavyzdys · Fiktyvus verslas</div>
</body></html>"""
    with open(os.path.join(OUT, "split-legal.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("built split-legal.html")


build_auto()
build_beauty()
build_legal()
print("Done — 3 example demos generated.")
