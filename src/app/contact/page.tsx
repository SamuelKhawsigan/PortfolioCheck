"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Send, RefreshCw, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ senderName: "", senderEmail: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Failed to send message.");
      setSuccess(true);
      setForm({ senderName: "", senderEmail: "", message: "" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "120px 24px 80px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-outfit)", fontWeight: "800", marginBottom: "12px" }}>Get in Touch</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>Have a project in mind or just want to say hello? I&apos;d love to hear from you.</p>
        </div>

        {success ? (
          <div className="glass" style={{ padding: "48px", textAlign: "center" }}>
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: "16px" }} />
            <h2 style={{ fontSize: "1.5rem", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>Message Sent!</h2>
            <p style={{ color: "var(--muted)" }}>Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
            <button className="btn btn-ghost" onClick={() => setSuccess(false)} style={{ marginTop: "24px" }}>
              Send another message
            </button>
          </div>
        ) : (
          <div className="glass" style={{ padding: "40px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  id="name"
                  className="input"
                  value={form.senderName}
                  onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.senderEmail}
                  onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  className="input"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about your project or idea…"
                  required
                  minLength={10}
                />
              </div>

              {error && <p role="alert" style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "4px" }}>
                {loading ? <><RefreshCw size={16} className="animate-spin" /> Sending…</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
