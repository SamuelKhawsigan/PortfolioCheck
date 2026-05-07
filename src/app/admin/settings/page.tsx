"use client";

import { useState } from "react";
import { Lock, RefreshCw } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (form.newPassword.length < 8) {
      showToast("New password must be at least 8 characters.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password.");
      showToast("Password changed successfully!", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", marginBottom: "6px" }}>Settings</h1>
        <p style={{ color: "var(--muted)" }}>Manage your admin account security.</p>
      </div>

      <div className="glass" style={{ padding: "32px", maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(59,130,246,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={20} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontWeight: "600" }}>Change Password</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Use a strong, unique password.</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="input"
              required
              value={form.currentPassword}
              onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={form.newPassword}
              onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="input"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: "8px" }}>
            {saving ? <><RefreshCw size={14} className="animate-spin" /> Changing…</> : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
