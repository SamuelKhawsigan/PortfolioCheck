"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90%, 800px)",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{ fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-outfit)" }}
      >
        PORTFOLIO<span style={{ color: "var(--accent)" }}>.</span>
      </Link>

      {/* Nav Links — change based on which page you're on */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {isAdminPage ? (
          // Admin pages: show a simple exit link
          <Link href="/" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            ← Exit Dashboard
          </Link>
        ) : (
          // Public pages: show section links + admin button
          <>
            <Link href="#projects" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              Projects
            </Link>
            <Link href="#experience" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              Experience
            </Link>
            <Link href="#blog" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              Blog
            </Link>
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                fontSize: "0.8rem",
                background: "var(--accent)",
                color: "white",
                borderRadius: "8px",
              }}
            >
              <LayoutDashboard size={14} />
              Admin
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
