import React from "react";
import { arrayToLines, linesToArray } from "../../lib/utils";

interface ArrayTextareaProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  rows?: number;
}

/**
 * Edits a Postgres text[] column as one item per line, which is far easier
 * for a non-technical admin than JSON.
 */
export const ArrayTextarea: React.FC<ArrayTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}) => (
  <div>
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      className="input resize-y"
      value={arrayToLines(value)}
      onChange={(event) => onChange(linesToArray(event.target.value))}
      placeholder={placeholder}
    />
    <p className="mt-1.5 text-xs text-slate-500">One item per line. Empty lines are ignored.</p>
  </div>
);
