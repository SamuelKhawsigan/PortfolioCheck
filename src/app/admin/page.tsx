import { auth } from "@/lib/auth";
import { FolderLock, FileText, Send, Eye, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
          Welcome back, {session?.user?.name || "Admin"}
        </h1>
        <p style={{ color: "var(--muted)" }}>Here's an overview of your portfolio activity.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "24px",
        marginBottom: "48px"
      }}>
        {[
          { label: "Total Projects", value: "12", icon: FolderLock, color: "#3b82f6" },
          { label: "Blog Views", value: "1,284", icon: Eye, color: "#10b981" },
          { label: "Form Submissions", value: "8", icon: Send, color: "#f59e0b" },
          { label: "Engagement", value: "+12.4%", icon: TrendingUp, color: "#8b5cf6" },
        ].map((stat) => (
          <div key={stat.label} className="glass" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                background: `${stat.color}20`, 
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        <div className="glass" style={{ padding: "32px" }}>
          <h3 style={{ marginBottom: "24px", fontFamily: "var(--font-outfit)" }}>Recent Project Updates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                padding: "16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px"
              }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--card-border)", borderRadius: "4px" }}></div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>CyberSec Dashboard v2.{i}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Updated 2 days ago</div>
                  </div>
                </div>
                <button style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: "600" }}>Edit</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: "32px" }}>
          <h3 style={{ marginBottom: "24px", fontFamily: "var(--font-outfit)" }}>Notifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[1, 2].map(i => (
              <div key={i} style={{ display: "flex", gap: "12px" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  background: "var(--accent)",
                  marginTop: "6px"
                }}></div>
                <div>
                  <div style={{ fontSize: "0.9rem" }}>New contact form submission from <b>Jane Doe</b></div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px" }}>1 hour ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
