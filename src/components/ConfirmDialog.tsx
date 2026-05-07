"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

/**
 * A simple "Are you sure?" confirmation dialog.
 * Used before destructive actions like deleting a record.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Delete",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="440px"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <AlertTriangle size={24} color="var(--warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{message}</p>
      </div>
    </Modal>
  );
}
