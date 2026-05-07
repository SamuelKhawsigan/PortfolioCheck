import prisma from "@/lib/prisma";
import { FolderLock, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>Manage Projects</h1>
          <p style={{ color: "var(--muted)" }}>Create, edit, and curate your portfolio entries.</p>
        </div>
        <button className="glass" style={{ 
          background: "var(--accent)", 
          color: "white", 
          padding: "10px 20px", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          fontWeight: "600"
        }}>
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--card-border)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", color: "var(--muted)", fontWeight: "500", fontSize: "0.9rem" }}>Project Name</th>
              <th style={{ padding: "16px 24px", color: "var(--muted)", fontWeight: "500", fontSize: "0.9rem" }}>Tech Stack</th>
              <th style={{ padding: "16px 24px", color: "var(--muted)", fontWeight: "500", fontSize: "0.9rem" }}>Status</th>
              <th style={{ padding: "16px 24px", color: "var(--muted)", fontWeight: "500", fontSize: "0.9rem" }}>Date</th>
              <th style={{ padding: "16px 24px", color: "var(--muted)", fontWeight: "500", fontSize: "0.9rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
                  No projects found. Create your first project to showcase your work!
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: "600" }}>{project.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{project.slug}</div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {project.techStack.map(tech => (
                        <span key={tech} style={{ 
                          fontSize: "0.7rem", 
                          background: "var(--card-border)", 
                          padding: "2px 6px", 
                          borderRadius: "4px" 
                        }}>{tech}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      color: project.isPublished ? "#10b981" : "#f59e0b",
                      background: project.isPublished ? "#10b98115" : "#f59e0b15",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontWeight: "600"
                    }}>
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "var(--muted)", fontSize: "0.85rem" }}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button title="Edit" style={{ color: "var(--muted)" }}><Edit2 size={16} /></button>
                      <button title="Delete" style={{ color: "#ef4444" }}><Trash2 size={16} /></button>
                      <button title="View Live" style={{ color: "var(--accent)" }}><ExternalLink size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
