"use client";

import { useState, useEffect, useRef } from "react";
import type { BlogPost } from "@/generated/prisma/client";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import TagInput from "@/components/TagInput";
import { useToast } from "@/components/Toast";

// SimpleMDE is loaded dynamically to avoid SSR issues (it uses browser APIs)
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

// ─── Types ────────────────────────────────────────────────
interface FormState {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  isPublished: boolean;
}

const EMPTY_FORM: FormState = {
  title: "", slug: "", content: "", tags: [], isPublished: false,
};

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Component ────────────────────────────────────────────
export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title, slug: post.slug, content: post.content,
      tags: post.tags, isPublished: !!post.publishedAt,
    });
    setEditingId(post.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { showToast("Title and slug are required.", "error"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishedAt: form.isPublished ? new Date().toISOString() : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (editingId) {
        setPosts((prev) => prev.map((p) => (p.id === editingId ? data : p)));
        showToast("Post updated!", "success");
      } else {
        setPosts((prev) => [data, ...prev]);
        showToast("Post created!", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message ?? "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("Post deleted.", "success");
      setDeleteTarget(null);
    } catch { showToast("Failed to delete.", "error"); }
    finally { setDeleting(false); }
  };

  // MDE options — stable reference to avoid re-renders
  const mdeOptions = useRef({
    spellChecker: false,
    placeholder: "Write your blog post in Markdown…",
    toolbar: ["bold","italic","heading","|","quote","code","unordered-list","ordered-list","|","link","image","|","preview","side-by-side","fullscreen","|","guide"] as any,
  }).current;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>Blog Posts</h1>
          <p style={{ color: "var(--muted)" }}>Write and manage your blog articles.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Post</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>No posts yet.</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div style={{ fontWeight: "600" }}>{post.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>/{post.slug}</div>
                </td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {post.tags.slice(0, 3).map((t: string) => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </td>
                <td>
                  <span className={`badge ${post.publishedAt ? "badge-published" : "badge-draft"}`}>
                    {post.publishedAt ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => openEdit(post)}><Edit2 size={14} /></button>
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => setDeleteTarget(post)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Post" : "New Blog Post"}
        maxWidth="860px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : "Save Post"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: toSlug(e.target.value) }))} placeholder="My Blog Post" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug *</label>
              <input className="input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))} placeholder="my-blog-post" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} placeholder="Add a tag and press Enter…" />
          </div>

          <div className="form-group">
            <label className="form-label">Content (Markdown)</label>
            <SimpleMDE
              value={form.content}
              onChange={(val) => setForm((f) => ({ ...f, content: val }))}
              options={mdeOptions}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }} />
            <span style={{ fontSize: "0.9rem" }}>Publish this post</span>
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleting}
      />
    </>
  );
}
