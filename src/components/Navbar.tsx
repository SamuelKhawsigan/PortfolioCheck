"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, FolderLock, FileText, Send } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="glass" style={{
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
    }}>
      <Link href="/" style={{ fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-outfit)" }}>
        PORTFOLIO<span style={{ color: "var(--accent)" }}>.</span>
      </Link>

      <div style={{ display: "flex", gap: "24px" }}>
        {!isAdmin ? (
          <>
            <Link href="#projects" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Projects</Link>
            <Link href="#experience" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Experience</Link>
            <Link href="#blog" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Blog</Link>
            <Link href="/admin" className="glass" style={{ 
              padding: "6px 16px", 
              fontSize: "0.8rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              background: "var(--accent)",
              color: "white",
              border: "none"
            }}>
              <LayoutDashboard size={14} /> Admin
            </Link>
          </>
        ) : (
          <Link href="/" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Exit Dashboard</Link>
        )}
      </div>
    </nav>
  );
}
