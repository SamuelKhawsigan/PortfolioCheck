import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FolderLock, FileText, User as UserIcon, Award, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: "280px", 
        borderRight: "1px solid var(--card-border)", 
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        position: "sticky",
        top: "0",
        height: "100vh"
      }}>
        <div style={{ fontSize: "1.4rem", fontWeight: "800", fontFamily: "var(--font-outfit)" }}>
          DASHBOARD<span style={{ color: "var(--accent)" }}>.</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {[
            { icon: LayoutDashboard, label: "Overview", href: "/admin" },
            { icon: FolderLock, label: "Projects", href: "/admin/projects" },
            { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
            { icon: UserIcon, label: "Profile", href: "/admin/profile" },
            { icon: Award, label: "Experience", href: "/admin/experience" },
            { icon: Settings, label: "Settings", href: "/admin/settings" },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              padding: "12px 16px", 
              borderRadius: "8px",
              color: "var(--muted)",
              fontSize: "0.95rem"
            }}>
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "24px" }}>
          <button style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            padding: "12px 16px", 
            color: "#ef4444",
            fontSize: "0.95rem"
          }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
