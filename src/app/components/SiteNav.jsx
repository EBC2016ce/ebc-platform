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