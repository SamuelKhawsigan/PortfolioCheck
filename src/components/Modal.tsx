"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

/**
 * Reusable glassmorphism modal.
 * Closes when clicking the backdrop or pressing Escape.
 */
export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "680px" }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box" style={{ maxWidth }}>
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-outfit)" }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ color: "var(--muted)", padding: "4px", borderRadius: "6px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
