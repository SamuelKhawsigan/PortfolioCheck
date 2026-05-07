"use client";

import { useState, useRef } from "react";
import type { CtfWriteup } from "@/generated/prisma/client";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

interface FormState {
  title: string;
  slug: string;
  competition: string;
  category: string;
  content: string;
  isPublished: boolean;
}

const EMPTY_FORM: FormState = {
  title: "", slug: "", competition: "", category: "", content: "", isPublished: false,
};

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = ["Web", "Pwn", "Reverse", "Crypto", "Forensics", "OSINT", "Misc"];

export default function CtfManager({ initialWriteups }: { initialWriteups: CtfWriteup[] }) {
  const [writeups, setWriteups] = useState<CtfWriteup[]>(initialWriteups);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CtfWriteup | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };

  const openEdit = (w: CtfWriteup) => {
    setForm({ title: w.title, slug: w.slug, competition: w.competition, category: w.category, content: w.content, isPublished: !!w.publishedAt });
    setEditingId(w.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { showToast("Title and slug are required.", "error"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/ctf-writeups/${editingId}` : "/api/admin/ctf-writeups";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishedAt: form.isPublished ? new Date().toISOString() : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (editingId) {
        setWriteups((prev) => prev.map((w) => (w.id === editingId ? data : w)));
        showToast("Writeup updated!", "success");
      } else {
        setWriteups((prev) => [data, ...prev]);
        showToast("Writeup created!", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message ?? "Something went wrong.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/ctf-writeups/${deleteTarget.id}`, { method: "DELETE" });
      setWriteups((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      showToast("Writeup deleted.", "success");
      setDeleteTarget(null);
    } catch { showToast("Failed to delete.", "error"); }
    finally { setDeleting(false); }
  };

  const mdeOptions = useRef({ spellChecker: false, placeholder: "Write your CTF writeup in Markdown…" }).current;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>CTF Writeups</h1>
          <p style={{ color: "var(--muted)" }}>Document your Capture The Flag challenge solutions.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Writeup</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Competition</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {writeups.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>No writeups yet.</td></tr>
            ) : writeups.map((w) => (
              <tr key={w.id}>
                <td>
                  <div style={{ fontWeight: "600" }}>{w.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>/{w.slug}</div>
                </td>
                <td style={{ color: "var(--muted)" }}>{w.competition}</td>
                <td><span className="tag-pill">{w.category}</span></td>
                <td>
                  <span className={`badge ${w.publishedAt ? "badge-published" : "badge-draft"}`}>
                    {w.publishedAt ? "Published" : "Draft"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => openEdit(w)}><Edit2 size={14} /></button>
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => setDeleteTarget(w)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Writeup" : "New CTF Writeup"}
        maxWidth="860px"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : "Save Writeup"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: toSlug(e.target.value) }))} placeholder="SQL Injection - HackTheBox" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug *</label>
              <input className="input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Competition</label>
              <input className="input" value={form.competition} onChange={(e) => setForm((f) => ({ ...f, competition: e.target.value }))} placeholder="HackTheBox, PicoCTF…" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Writeup Content (Markdown)</label>
            <SimpleMDE value={form.content} onChange={(val) => setForm((f) => ({ ...f, content: val }))} options={mdeOptions} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }} />
            <span style={{ fontSize: "0.9rem" }}>Publish this writeup</span>
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
