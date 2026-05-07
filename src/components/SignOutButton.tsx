"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

/**
 * Sign Out button must be a client component because it calls
 * a browser-side function (signOut). It is extracted here so the
 * rest of the admin layout can remain a Server Component.
 */
export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        color: "#ef4444",
        fontSize: "0.95rem",
        width: "100%",
      }}
    >
      <LogOut size={20} />
      Sign Out
    </button>
  );
}
