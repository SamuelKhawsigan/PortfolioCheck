"use client";

import { useState } from "react";
import type { Project } from "@/generated/prisma/client";
import { Plus, Edit2, Trash2, ExternalLink, Code2, RefreshCw } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import TagInput from "@/components/TagInput";
import { useToast } from "@/components/Toast";

// ─── Types ────────────────────────────────────────────────
interface FormState {
  title: string;
  slug: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  imageUrl: string;
  techStack: string[];
  isPublished: boolean;
}

const EMPTY_FORM: FormState = {
  title: "", slug: "", description: "",
  repoUrl: "", liveUrl: "", imageUrl: "",
  techStack: [], isPublished: false,
};

// Auto-generate a URL-friendly slug from a title
function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Component ────────────────────────────────────────────
export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  // ── Open create modal ──
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  // ── Open edit modal ──
  const openEdit = (p: Project) => {
    setForm({
      title: p.title, slug: p.slug, description: p.description,
      repoUrl: p.repoUrl ?? "", liveUrl: p.liveUrl ?? "",
      imageUrl: p.imageUrl ?? "", techStack: p.techStack, isPublished: p.isPublished,
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  // ── Handle image upload ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, imageUrl: data.fileUrl }));
      showToast("Image uploaded!", "success");
    } catch {
      showToast("Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  // ── Save (create or update) ──
  const handleSave = async () => {
    if (!form.title || !form.slug) {
      showToast("Title and slug are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      if (editingId) {
        setProjects((prev) => prev.map((p) => (p.id === editingId ? data : p)));
        showToast("Project updated!", "success");
      } else {
        setProjects((prev) => [data, ...prev]);
        showToast("Project created!", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message ?? "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("Project deleted.", "success");
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete project.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>Projects</h1>
          <p style={{ color: "var(--muted)" }}>Manage your portfolio projects.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Stack</th>
              <th>Status</th>
              <th>Updated</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
                  No projects yet. Create your first one!
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: "600" }}>{p.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>/{p.slug}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {p.techStack.slice(0, 3).map((t: string) => (
                        <span key={t} className="tag-pill">{t}</span>
                      ))}
                      {p.techStack.length > 3 && (
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>+{p.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.isPublished ? "badge-published" : "badge-draft"}`}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" title="View live">
                          <button className="btn btn-ghost" style={{ padding: "6px 10px" }}><ExternalLink size={14} /></button>
                        </a>
                      )}
                      <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => openEdit(p)} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => setDeleteTarget(p)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Project" : "New Project"}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : "Save Project"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Title + Slug */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: toSlug(e.target.value) }))}
                placeholder="My Awesome Project"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug *</label>
              <input
                className="input"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))}
                placeholder="my-awesome-project"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What does this project do?"
              rows={3}
            />
          </div>

          {/* Tech Stack */}
          <div className="form-group">
            <label className="form-label">Tech Stack</label>
            <TagInput
              value={form.techStack}
              onChange={(tags) => setForm((f) => ({ ...f, techStack: tags }))}
              placeholder="Add a technology and press Enter…"
            />
          </div>

          {/* URLs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Repo URL</label>
              <input className="input" value={form.repoUrl} onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input className="input" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="input" style={{ padding: "8px" }} />
            {uploading && <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Uploading…</p>}
          </div>

          {/* Published */}
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }}
            />
            <span style={{ fontSize: "0.9rem" }}>Publish this project</span>
          </label>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleting}
      />
    </>
  );
}
