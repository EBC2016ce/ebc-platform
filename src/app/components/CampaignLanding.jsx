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