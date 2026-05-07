"use client";

import { useState } from "react";
import type { Profile } from "@/generated/prisma/client";
import { Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function ProfileEditor({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
    email: profile?.email ?? "",
    githubUrl: profile?.githubUrl ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    resumeUrl: profile?.resumeUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.email) {
      showToast("Name and email are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const url = profile ? `/api/admin/profile/${profile.id}` : "/api/admin/profile";
      const method = profile ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      showToast("Profile saved!", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>Profile</h1>
        <p style={{ color: "var(--muted)" }}>Update your public-facing information.</p>
      </div>

      <div className="glass" style={{ padding: "32px", maxWidth: "700px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="input" value={form.name} onChange={f("name")} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="input" type="email" value={form.email} onChange={f("email")} placeholder="john@example.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="input" rows={4} value={form.bio} onChange={f("bio")} placeholder="Tell the world about yourself…" />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input className="input" value={form.githubUrl} onChange={f("githubUrl")} placeholder="https://github.com/username" />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input className="input" value={form.linkedinUrl} onChange={f("linkedinUrl")} placeholder="https://linkedin.com/in/username" />
          </div>

          <div className="form-group">
            <label className="form-label">Resume URL</label>
            <input className="input" value={form.resumeUrl} onChange={f("resumeUrl")} placeholder="Link to your resume PDF" />
          </div>

          <div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Profile</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
