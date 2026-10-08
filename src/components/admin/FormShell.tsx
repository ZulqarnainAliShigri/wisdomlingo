import React from "react";
import { Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Loader";

interface FormShellProps {
  open: boolean;
  title: string;
  submitLabel: string;
  saving: boolean;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  children: React.ReactNode;
}

/** Modal + two-column field grid + footer buttons, shared by every admin form. */
export const FormShell: React.FC<FormShellProps> = ({
  open,
  title,
  submitLabel,
  saving,
  busy,
  onClose,
  onSubmit,
  children,
}) => (
  <Modal open={open} title={title} onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving || busy}>
          {saving ? <Spinner /> : <Check className="h-4 w-4" />}
          {submitLabel}
        </button>
      </div>
    </form>
  </Modal>
);

/** Labelled single-line input used by the admin forms. */
export const Field: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}> = ({ id, label, value, onChange, placeholder, type = "text", full }) => (
  <div className={full ? "sm:col-span-2" : undefined}>
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </div>
);

/** Labelled textarea used for descriptions. */
export const TextAreaField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ id, label, value, onChange, placeholder }) => (
  <div className="sm:col-span-2">
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      className="input min-h-[110px] resize-y"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </div>
);

/** Display-order number input plus the public visibility checkbox. */
export const OrderAndVisibility: React.FC<{
  idPrefix: string;
  order: string;
  onOrderChange: (value: string) => void;
  active: boolean;
  onActiveChange: (value: boolean) => void;
}> = ({ idPrefix, order, onOrderChange, active, onActiveChange }) => (
  <>
    <div>
      <label className="label" htmlFor={`${idPrefix}-order`}>
        Display order
      </label>
      <input
        id={`${idPrefix}-order`}
        type="number"
        className="input"
        value={order}
        onChange={(event) => onOrderChange(event.target.value)}
        placeholder="1"
      />
    </div>
    <div className="flex items-end">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          checked={active}
          onChange={(event) => onActiveChange(event.target.checked)}
        />
        <span className="text-sm font-semibold text-slate-700">Visible on the public site</span>
      </label>
    </div>
  </>
);
