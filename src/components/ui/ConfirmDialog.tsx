import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { Spinner } from "./Loader";

export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, confirmLabel = "Delete", busy, onConfirm, onCancel }) => (
  <Modal open={open} title={title} onClose={onCancel} width="max-w-md">
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
    </div>
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" className="btn-ghost" onClick={onCancel} disabled={busy}>
        Cancel
      </button>
      <button type="button" className="btn-accent" onClick={onConfirm} disabled={busy}>
        {busy ? <Spinner /> : <Trash2 className="h-4 w-4" />}
        {confirmLabel}
      </button>
    </div>
  </Modal>
);
