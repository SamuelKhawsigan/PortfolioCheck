import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  User as UserIcon,
  Award,
  Settings,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",      href: "/admin" },
  { icon: FolderKanban,   label: "Projects",       href: "/admin/projects" },
  { icon: FileText,       label: "Blog Posts",     href: "/admin/blog" },
  { icon: Shield,         label: "CTF Writeups",   href: "/admin/ctf" },
  { icon: UserIcon,       label: "Profile",        href: "/admin/profile" },
  { icon: Award,          label: "Experience",     href: "/admin/experience" },
  { icon: Settings,       label: "Settings",       href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className="glass"
        style={{
          width: "260px",
          flexShrink: 0,
          borderRight: "1px solid var(--card-border)",
          padding: "32px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 8px", fontSize: "1.3rem", fontWeight: "800", fontFamily: "var(--font-outfit)" }}>
          DASHBOARD<span style={{ color: "var(--accent)" }}>.</span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                color: "var(--muted)",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "var(--transition)",
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
