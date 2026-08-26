import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FIELD_ICONS } from "../../data/content";
import { Apprenticeship } from "../../types";
import { ArrayTextarea } from "./ArrayTextarea";
import { Field, FormShell, OrderAndVisibility, TextAreaField } from "./FormShell";
import { ImageUploadField } from "./ImageUploadField";

interface ApprenticeshipFormState {
  title: string;
  field: string;
  salary: string;
  duration: string;
  description: string;
  requirements: string[];
  benefits: string[];
  image_url: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: ApprenticeshipFormState = {
  title: "",
  field: "IT",
  salary: "",
  duration: "",
  description: "",
  requirements: [],
  benefits: [],
  image_url: "",
  display_order: "",
  is_active: true,
};

interface ApprenticeshipFormModalProps {
  open: boolean;
  editing: Apprenticeship | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
}

export const ApprenticeshipFormModal: React.FC<ApprenticeshipFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ApprenticeshipFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            title: editing.title,
            field: editing.field || "IT",
            salary: editing.salary || "",
            duration: editing.duration || "",
            description: editing.description || "",
            requirements: editing.requirements,
            benefits: editing.benefits,
            image_url: editing.image_url || "",
            display_order:
              editing.display_order === null || editing.display_order === undefined
                ? ""
                : String(editing.display_order),
            is_active: editing.is_active,
          }
        : EMPTY
    );
  }, [open, editing]);

  const set = <K extends keyof ApprenticeshipFormState>(key: K) => (
    value: ApprenticeshipFormState[K]
  ) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.title.trim().length < 3) {
      toast.error("Please enter the apprenticeship title.");
      return;
    }
    if (!form.field.trim()) {
      toast.error("Please enter the field.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      field: form.field.trim(),
      salary: form.salary.trim() || null,
      duration: form.duration.trim() || null,
      description: form.description.trim() || null,
      requirements: form.requirements,
      benefits: form.benefits,
      image_url: form.image_url.trim() || null,
      display_order: form.display_order === "" ? null : Number(form.display_order),
      is_active: form.is_active,
    };

    const ok = await onSubmit(payload, editing?.id);
    if (ok) onClose();
  };

  const knownFields = Object.keys(FIELD_ICONS);

  return (
    <FormShell
      open={open}
      title={editing ? "Edit apprenticeship" : "Add apprenticeship"}
      submitLabel={editing ? "Save changes" : "Create apprenticeship"}
      saving={saving}
      busy={uploading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field
        id="app-title"
        label="Title *"
        value={form.title}
        onChange={set("title")}
        placeholder="Nursing (Pflegefachmann/-frau)"
        full
      />

      <div>
        <label className="label" htmlFor="app-field">
          Field *
        </label>
        <input
          id="app-field"
          list="apprenticeship-fields"
          className="input"
          value={form.field}
          onChange={(event) => set("field")(event.target.value)}
          placeholder="Nursing"
        />
        <datalist id="apprenticeship-fields">
          {knownFields.map((field) => (
            <option key={field} value={field} />
          ))}
        </datalist>
        <p className="mt-1.5 text-xs text-slate-500">
          {knownFields.join(", ")} have matching icons. Any other value uses the default icon.
        </p>
      </div>

      <Field
        id="app-salary"
        label="Salary"
        value={form.salary}
        onChange={set("salary")}
        placeholder="EUR 1,200 - 1,500 / month"
      />
      <Field
        id="app-duration"
        label="Duration"
        value={form.duration}
        onChange={set("duration")}
        placeholder="3 years"
      />

      <TextAreaField
        id="app-description"
        label="Description"
        value={form.description}
        onChange={set("description")}
        placeholder="What the training involves and where it leads."
      />

      <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
        <ArrayTextarea
          id="app-requirements"
          label="Requirements"
          value={form.requirements}
          onChange={set("requirements")}
          placeholder={"German B1 minimum\nFSc Pre-Medical or nursing diploma"}
        />
        <ArrayTextarea
          id="app-benefits"
          label="Benefits"
          value={form.benefits}
          onChange={set("benefits")}
          placeholder={"Paid from day one\nPermanent job offer on completion"}
        />
      </div>

      <div className="sm:col-span-2">
        <ImageUploadField
          label="Apprenticeship image"
          value={form.image_url}
          onChange={set("image_url")}
          folder="apprenticeships"
          onUploadingChange={setUploading}
        />
      </div>

      <OrderAndVisibility
        idPrefix="app"
        order={form.display_order}
        onOrderChange={set("display_order")}
        active={form.is_active}
        onActiveChange={set("is_active")}
      />
    </FormShell>
  );
};
