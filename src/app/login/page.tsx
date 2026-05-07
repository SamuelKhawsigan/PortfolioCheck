"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, User, Loader2 } from "lucide-react";

// Reusable style objects to keep JSX clean and readable
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid var(--card-border)",
  borderRadius: "8px",
  padding: "12px 12px 12px 40px",
  color: "white",
  outline: "none",
};

const floatingIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Reset loading so the user can try again
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      // Keep loading=true to prevent UI flicker during navigation
      router.push("/admin");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="glass animate-fade-in"
        style={{ width: "100%", maxWidth: "400px", padding: "40px" }}
      >
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "var(--accent)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Lock color="white" size={24} />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-outfit)" }}>
            Admin Portal
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Authenticate to manage your digital presence.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Username Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="username" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} color="var(--muted)" style={floatingIconStyle} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="password" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="var(--muted)" style={floatingIconStyle} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <p role="alert" style={{ color: "#ef4444", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "600",
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        {/* Back Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.85rem",
            color: "var(--muted)",
          }}
        >
          <Link href="/">← Back to Portfolio</Link>
        </p>
      </div>
    </main>
  );
}
