import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FolderKanban, FileText, MessageSquare, TrendingUp, Eye, Shield } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  // Fetch real counts from the database
  const [projectCount, blogCount, ctfCount, unreadCount, recentProjects, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.ctfWriteup.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.project.findMany({ take: 3, orderBy: { updatedAt: "desc" } }),
      prisma.contactMessage.findMany({ take: 3, orderBy: { receivedAt: "desc" }, where: { isRead: false } }),
    ]);

  const stats = [
    { label: "Projects",         value: projectCount,  icon: FolderKanban, color: "#3b82f6", href: "/admin/projects" },
    { label: "Blog Posts",       value: blogCount,     icon: FileText,     color: "#10b981", href: "/admin/blog" },
    { label: "CTF Writeups",     value: ctfCount,      icon: Shield,       color: "#8b5cf6", href: "/admin/ctf" },
    { label: "Unread Messages",  value: unreadCount,   icon: MessageSquare,color: "#f59e0b", href: "#" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
          Welcome back, {session?.user?.name ?? "Admin"} 👋
        </h1>
        <p style={{ color: "var(--muted)" }}>Here&apos;s an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="glass" style={{ padding: "24px", transition: "var(--transition)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: `${stat.color}20`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <TrendingUp size={16} color="var(--muted)" />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "24px" }}>
        {/* Recent Projects */}
        <div className="glass" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-outfit)" }}>Recent Projects</h3>
            <Link href="/admin/projects" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>View all →</Link>
          </div>

          {recentProjects.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No projects yet. <Link href="/admin/projects" style={{ color: "var(--accent)" }}>Create one →</Link></p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentProjects.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{p.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>/{p.slug}</div>
                  </div>
                  <span className={`badge ${p.isPublished ? "badge-published" : "badge-draft"}`}>
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="glass" style={{ padding: "28px" }}>
          <h3 style={{ fontFamily: "var(--font-outfit)", marginBottom: "20px" }}>
            Unread Messages {unreadCount > 0 && <span style={{ fontSize: "0.75rem", background: "var(--accent)", color: "white", padding: "2px 8px", borderRadius: "12px", marginLeft: "8px" }}>{unreadCount}</span>}
          </h3>

          {recentMessages.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No new messages.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {recentMessages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", marginTop: "6px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{msg.senderName}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                      {msg.message.length > 60 ? msg.message.slice(0, 60) + "…" : msg.message}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                      {new Date(msg.receivedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
