/**
 * NovaCare — Confirm Dialog Component
 * Premium confirmation modal for critical/destructive actions.
 */

import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";
import Spinner from "../Spinner";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      titleIcon={AlertTriangle}
      danger={danger}
      maxWidth="max-w-md"
    >
      <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
        {message}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-3.5 rounded-xl font-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${
            danger
              ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/25"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25"
          }`}
        >
          {loading ? <Spinner size="sm" /> : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
