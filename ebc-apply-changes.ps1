# EBC website - applies the new design system + pages to your Next.js repo.
#
# HOW TO RUN (PowerShell):
#   1. Open your ebc-platform repo in VS Code
#   2. Make sure you're on the staging branch:  git checkout staging
#   3. Open a terminal (Terminal -> New Terminal) - PowerShell is fine, this
#      script does not need Git Bash
#   4. Move this file into the repo root, then run:  .\ebc-apply-changes.ps1
#      (if Windows blocks it, first run:  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass )
#   5. Review the diff (git diff), then commit and push to staging
#
# SAFE BY DESIGN:
#   - Only ever CREATES new files. Never overwrites an existing file.
#   - If a target file already exists, it's skipped with a warning so you
#     don't lose any real logic (e.g. your existing RegisterForm submit
#     handler, Supabase calls, or Meta Pixel code).
#   - globals.css is APPENDED to, never overwritten.

$ErrorActionPreference = "Stop"
$AppDir = "src\\app"

if (-not (Test-Path $AppDir)) {
    Write-Host "ERROR: no '$AppDir' folder found here. Run this from your repo root (where app/ lives)." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path "$AppDir\components" | Out-Null
New-Item -ItemType Directory -Force -Path "$AppDir\new-home" | Out-Null
New-Item -ItemType Directory -Force -Path "$AppDir\renovation" | Out-Null
New-Item -ItemType Directory -Force -Path "$AppDir\extension" | Out-Null
New-Item -ItemType Directory -Force -Path "$AppDir\register" | Out-Null

function Create-IfMissing {
    param([string]$Path, [string]$Content)
    if (Test-Path $Path) {
        Write-Host "SKIPPED (already exists): $Path" -ForegroundColor Yellow
    } else {
        Set-Content -Path $Path -Value $Content -NoNewline
        Write-Host "CREATED: $Path" -ForegroundColor Green
    }
}

# ---------------------------------------------------------------------------
# 1. Design tokens -> appended to globals.css (created if it doesn't exist)
# ---------------------------------------------------------------------------
$GlobalsPath = "$AppDir\globals.css"
$Tokens = @"

/* ===== EBC design tokens (added by ebc-apply-changes.ps1) ===== */
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --paper: #EDEAE3;
  --paper-2: #E4E0D6;
  --ink: #211F1C;
  --ink-soft: #5A564E;
  --terracotta: #B24A2E;
  --blueprint: #1F3A52;
  --timber: #A9814F;
  --line: #D3CDBF;
  --white: #FBFAF7;
  --ok: #4F7A52;
  --warn: #B08A2E;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  line-height: 1.5;
}

h1, h2, h3, h4, .display {
  font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.01em;
  margin: 0;
}

.wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
@media (max-width: 640px) { .wrap { padding: 0 20px; } }

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 13px 24px; border-radius: 2px; font-weight: 600; font-size: 14.5px;
  cursor: pointer; border: 1px solid transparent; transition: opacity .15s, transform .1s;
}
.btn:active { transform: translateY(1px); }
.btn-primary { background: var(--terracotta); color: var(--white); }
.btn-primary:hover { opacity: .9; }
.btn-ghost { background: transparent; border-color: var(--line); color: var(--ink); }
.btn-ghost:hover { background: var(--paper); }
/* ===== end EBC design tokens ===== */
"@

if (Test-Path $GlobalsPath) {
    $existing = Get-Content $GlobalsPath -Raw
    if ($existing -match "EBC design tokens") {
        Write-Host "SKIPPED (tokens already present): $GlobalsPath" -ForegroundColor Yellow
    } else {
        Add-Content -Path $GlobalsPath -Value $Tokens
        Write-Host "APPENDED tokens to: $GlobalsPath" -ForegroundColor Green
    }
} else {
    Set-Content -Path $GlobalsPath -Value $Tokens
    Write-Host "CREATED: $GlobalsPath" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# 2. Shared nav component
# ---------------------------------------------------------------------------
$SiteNav = @'
import Link from "next/link";

export default function SiteNav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(237,234,227,0.92)", backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 0",
      }}>
        <Link href="/" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)" }}>
          EBC <span style={{ color: "var(--terracotta)" }}>&middot;</span> Easy Building &amp; Construction
        </Link>
        <div style={{ display: "flex", gap: 34, alignItems: "center", fontSize: 14.5, fontWeight: 500 }}>
          <Link href="/new-home" style={{ color: "var(--ink-soft)" }}>New Home</Link>
          <Link href="/renovation" style={{ color: "var(--ink-soft)" }}>Renovation</Link>
          <Link href="/extension" style={{ color: "var(--ink-soft)" }}>Extension</Link>
          <Link href="/register" className="btn btn-primary" style={{ color: "var(--white)" }}>
            Register Your Project
          </Link>
        </div>
      </div>
    </nav>
  );
}
'@
Create-IfMissing "$AppDir\components\SiteNav.jsx" $SiteNav

# ---------------------------------------------------------------------------
# 3. Homepage
# ---------------------------------------------------------------------------
$HomePage = @'
import Link from "next/link";
import Image from "next/image";
import SiteNav from "./components/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <section style={{ position: "relative", height: "82vh", minHeight: 560, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/after-1.jpg" alt="Completed renovation" fill style={{ objectFit: "cover" }} />
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, rgba(23,21,18,0.55) 0%, rgba(23,21,18,0.05) 45%, transparent 60%)",
        }} />
        <div className="wrap" style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 64,
        }}>
          <h1 style={{ color: "var(--white)", fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.05, maxWidth: 680 }}>
            Built properly, from first conversation to final handover.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 17, maxWidth: 480, marginTop: 16 }}>
            New homes, renovations, and extensions across Melbourne - real projects, real craftsmanship, no pressure along the way.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <Link href="/register" className="btn btn-primary">Register Your Project</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0 90px" }}>
        <div className="wrap">
          <div style={{ maxWidth: 560, marginBottom: 52 }}>
            <div style={{ fontSize: 13.5, color: "var(--terracotta)", fontWeight: 600, marginBottom: 10 }}>
              What are you planning?
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, lineHeight: 1.15 }}>
              Every project starts the same way - tell us what you are building.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 20 }}>
            <PathCard href="/new-home" tag="NEW HOME" title="Building from the ground up"
              desc="Knockdown rebuilds, custom homes, and land & house packages." />
            <PathCard href="/renovation" tag="RENOVATION" title="Kitchens, bathrooms & more"
              desc="From a single room refresh to a full home renovation." />
            <PathCard href="/extension" tag="EXTENSION" title="More room to grow into"
              desc="Second storeys, alfresco additions, and home extensions." />
          </div>
        </div>
      </section>
    </>
  );
}

function PathCard({ href, tag, title, desc }) {
  return (
    <Link href={href} style={{
      position: "relative", borderRadius: 2, overflow: "hidden", height: 420,
      display: "flex", alignItems: "flex-end", background: "var(--blueprint)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(0deg, rgba(0,0,0,.65) 0%, transparent 55%)",
      }} />
      <div style={{ position: "relative", zIndex: 2, padding: 26, color: "var(--white)" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", display: "block", marginBottom: 6 }}>
          {tag}
        </span>
        <h3 style={{ fontSize: 23, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.75)", maxWidth: 260, marginBottom: 14 }}>{desc}</p>
        <span style={{ fontSize: 13.5, fontWeight: 600, borderBottom: "1.5px solid rgba(255,255,255,.5)" }}>
          Start your design &rarr;
        </span>
      </div>
    </Link>
  );
}
'@
Create-IfMissing "$AppDir\page.js" $HomePage

# ---------------------------------------------------------------------------
# 4. Shared campaign landing template
# ---------------------------------------------------------------------------
$CampaignLanding = @'
import Link from "next/link";
import SiteNav from "./SiteNav";

export default function CampaignLanding({ tag, headline, sub, registerType, features, listTitle, listItems }) {
  return (
    <>
      <SiteNav />
      <section className="wrap" style={{ padding: "90px 0 70px" }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--terracotta)", display: "block", marginBottom: 16 }}>
          {tag}
        </span>
        <h1 style={{ fontSize: "clamp(32px,4.6vw,50px)", fontWeight: 700, lineHeight: 1.08, maxWidth: 640 }}>
          {headline}
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 480, marginTop: 18, lineHeight: 1.6 }}>
          {sub}
        </p>
        <div style={{ marginTop: 32 }}>
          <Link href={`/register?type=${registerType}`} className="btn btn-primary">
            Get My Free Consultation
          </Link>
        </div>
      </section>

      <div style={{ background: "var(--white)", padding: "64px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{ padding: "0 28px", borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="wrap" style={{ padding: "90px 0" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>{listTitle}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {listItems.map((item) => (
            <div key={item} style={{ fontSize: 14.5, display: "flex", gap: 10 }}>
              <span style={{ color: "var(--terracotta)", fontWeight: 700 }}>&mdash;</span> {item}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--blueprint)", color: "var(--white)", padding: "80px 0", textAlign: "center" }}>
        <div className="wrap">
          <h2 style={{ fontSize: 30, marginBottom: 14 }}>Ready to talk through your project?</h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 15, marginBottom: 30 }}>
            Takes about a minute. We will follow up personally once you submit.
          </p>
          <Link href={`/register?type=${registerType}`} className="btn btn-primary">
            Get My Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
'@
Create-IfMissing "$AppDir\components\CampaignLanding.jsx" $CampaignLanding

# ---------------------------------------------------------------------------
# 5. Three campaign landing pages
# ---------------------------------------------------------------------------
$NewHomePage = @'
import CampaignLanding from "../components/CampaignLanding";

export const metadata = { title: "Building a New Home - EBC" };

export default function NewHomePage() {
  return (
    <CampaignLanding
      tag="NEW HOME"
      headline="Building your new home, from land to move-in."
      sub="Whether you already own the block or are still land-hunting, tell us about your project and get expert guidance from Easy Building & Construction - no obligation, just a real conversation."
      registerType="new-home"
      features={[
        { title: "Experienced", desc: "Trusted new home builders across Eastern Melbourne." },
        { title: "Clear process", desc: "From first chat to handover, you will always know what is next." },
        { title: "No pressure", desc: "Register your details and we will reach out. That is it." },
      ]}
      listTitle="Built around how you actually live."
      listItems={[
        "Custom home building & architecturally designed homes",
        "Knockdown & rebuild specialists",
        "Land + house package guidance",
        "In-house finance consultation",
      ]}
    />
  );
}
'@
Create-IfMissing "$AppDir\new-home\page.js" $NewHomePage

$RenovationPage = @'
import CampaignLanding from "../components/CampaignLanding";

export const metadata = { title: "Renovating? - EBC" };

export default function RenovationPage() {
  return (
    <CampaignLanding
      tag="RENOVATION"
      headline="Thinking about renovating?"
      sub="Kitchen, bathroom, or a full home renovation - tell us about your project and get expert guidance from Easy Building & Construction. No obligation, just a real conversation."
      registerType="renovation"
      features={[
        { title: "Experienced", desc: "Trusted renovation specialists across Victoria." },
        { title: "Clear process", desc: "From first chat to finished renovation, you will know what is happening." },
        { title: "No pressure", desc: "Register your details and we will reach out. That is it." },
      ]}
      listTitle="Whatever room needs work, we have done it before."
      listItems={[
        "Kitchen renovations",
        "Bathroom & ensuite renovations",
        "Laundry renovations",
        "Full home renovations",
      ]}
    />
  );
}
'@
Create-IfMissing "$AppDir\renovation\page.js" $RenovationPage

$ExtensionPage = @'
import CampaignLanding from "../components/CampaignLanding";

export const metadata = { title: "Extending Your Home? - EBC" };

export default function ExtensionPage() {
  return (
    <CampaignLanding
      tag="EXTENSION"
      headline="Extending your home?"
      sub="More bedrooms, a second storey, or extra living space - tell us about your project and get expert guidance from Easy Building & Construction. No obligation, just a real conversation."
      registerType="extension"
      features={[
        { title: "Experienced", desc: "Trusted extension specialists across Victoria." },
        { title: "Clear process", desc: "From first chat to finished extension, you will know what is happening." },
        { title: "No pressure", desc: "Register your details and we will reach out. That is it." },
      ]}
      listTitle="More space, without starting over."
      listItems={[
        "Second-storey additions",
        "Rear & side extensions",
        "Alfresco & outdoor living additions",
        "Site assessment & permit management",
      ]}
    />
  );
}
'@
Create-IfMissing "$AppDir\extension\page.js" $ExtensionPage

# ---------------------------------------------------------------------------
# 6. Register page wrapper (reads ?type= param) - new route, safe to create
# ---------------------------------------------------------------------------
$RegisterPage = @'
import RegisterForm from "./RegisterForm";
import SiteNav from "../components/SiteNav";

const TYPE_MAP = {
  "new-home": "New Building",
  "renovation": "Renovation",
  "extension": "Extension",
};

export default function RegisterPage({ searchParams }) {
  const preselectedType = TYPE_MAP[searchParams?.type] || "";
  return (
    <>
      <SiteNav />
      <RegisterForm defaultProjectType={preselectedType} />
    </>
  );
}
'@
Create-IfMissing "$AppDir\register\page.js" $RegisterPage

Write-Host ""
Write-Host "Done." -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT - check these manually:" -ForegroundColor Cyan
Write-Host "  1. If app/register/RegisterForm.jsx already exists, it was NOT touched."
Write-Host "     Open it and add the 'defaultProjectType' prop + the type-note banner"
Write-Host "     shown in ebc-nextjs-implementation.md, section 5 - do not overwrite"
Write-Host "     your real submit/Supabase/Meta Pixel logic."
Write-Host "  2. Confirm app/globals.css imports correctly in app/layout.js."
Write-Host "  3. Run 'npm run dev' locally and click through / -> /new-home ->"
Write-Host "     /register to confirm the type param pre-fills correctly."
Write-Host "  4. git add -A ; git commit -m 'New design system + landing pages' ; git push"
