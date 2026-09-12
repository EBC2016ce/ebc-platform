import Link from "next/link";
import Image from "next/image";

export default function SiteNav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(237,234,227,0.92)", backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} style={{ height: 44, width: "auto" }} />
          <span style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 17, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>
              Easy Building &amp; Construction Pty Ltd
            </span>
            <span style={{ display: "block", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", color: "var(--ink-soft)" }}>
              REGISTERED BUILDING PRACTITIONERS
            </span>
          </span>
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