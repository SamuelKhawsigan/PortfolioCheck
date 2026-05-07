"use client";

import { useState } from "react";
import type { Experience } from "@/generated/prisma/client";
import { Plus, Edit2, Trash2, RefreshCw, Briefcase } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";

interface FormState {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  isLeadership: boolean;
}

const EMPTY_FORM: FormState = {
  role: "", company: "", startDate: "", endDate: "", description: "", isLeadership: false,
};

export default function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const toDateInput = (d: Date | null) => d ? new Date(d).toISOString().slice(0, 7) : "";

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };

  const openEdit = (e: Experience) => {
    setForm({
      role: e.role, company: e.company,
      startDate: toDateInput(e.startDate),
      endDate: toDateInput(e.endDate),
      description: e.description,
      isLeadership: e.isLeadership,
    });
    setEditingId(e.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.role || !form.company || !form.startDate) {
      showToast("Role, company and start date are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/experience/${editingId}` : "/api/admin/experience";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (editingId) {
        setExperiences((prev) => prev.map((e) => (e.id === editingId ? data : e)));
        showToast("Experience updated!", "success");
      } else {
        setExperiences((prev) => [data, ...prev]);
        showToast("Experience added!", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/experience/${deleteTarget.id}`, { method: "DELETE" });
      setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast("Experience deleted.", "success");
      setDeleteTarget(null);
    } catch { showToast("Delete failed.", "error"); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>Experience</h1>
          <p style={{ color: "var(--muted)" }}>Manage your work history and roles.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Experience</button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {experiences.length === 0 ? (
          <div className="glass" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            No experience entries yet. Add your first one!
          </div>
        ) : experiences.map((exp) => (
          <div key={exp.id} className="glass" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(59,130,246,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Briefcase size={20} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "1.05rem" }}>{exp.role}</div>
                <div style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: "4px" }}>{exp.company}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "8px" }}>
                  {new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} —{" "}
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Present"}
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "600px" }}>{exp.description}</p>
                {exp.isLeadership && (
                  <span className="badge badge-published" style={{ marginTop: "8px" }}>Leadership</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => openEdit(exp)}><Edit2 size={14} /></button>
              <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => setDeleteTarget(exp)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Experience" : "Add Experience"}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : "Save"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Role / Title *</label>
              <input className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Senior Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="input" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Corp" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input type="month" className="input" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date (leave blank for current)</label>
              <input type="month" className="input" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What did you do in this role?" />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isLeadership} onChange={(e) => setForm((f) => ({ ...f, isLeadership: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }} />
            <span style={{ fontSize: "0.9rem" }}>Leadership role</span>
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.role} at ${deleteTarget?.company}"? This cannot be undone.`}
        loading={deleting}
      />
    </>
  );
}
