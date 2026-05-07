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
} from "lucide-react";

// Each sidebar navigation item
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",   href: "/admin" },
  { icon: FolderKanban,   label: "Projects",    href: "/admin/projects" },
  { icon: FileText,       label: "Blog Posts",  href: "/admin/blog" },
  { icon: UserIcon,       label: "Profile",     href: "/admin/profile" },
  { icon: Award,          label: "Experience",  href: "/admin/experience" },
  { icon: Settings,       label: "Settings",    href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect every admin page — redirect to login if not authenticated
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside
        className="glass"
        style={{
          width: "280px",
          borderRight: "1px solid var(--card-border)",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          position: "sticky",
          top: "0",
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: "1.4rem", fontWeight: "800", fontFamily: "var(--font-outfit)" }}>
          DASHBOARD<span style={{ color: "var(--accent)" }}>.</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                color: "var(--muted)",
                fontSize: "0.95rem",
                transition: "var(--transition)",
              }}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out — uses a client component to call signOut() */}
        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "24px" }}>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
