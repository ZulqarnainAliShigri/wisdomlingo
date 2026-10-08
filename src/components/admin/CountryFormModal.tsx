import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StudyCountry } from "../../types";
import { ArrayTextarea } from "./ArrayTextarea";
import { Field, FormShell, OrderAndVisibility, TextAreaField } from "./FormShell";
import { ImageUploadField } from "./ImageUploadField";

interface CountryFormState {
  name: string;
  flag: string;
  tagline: string;
  description: string;
  benefits: string[];
  requirements: string[];
  tuition: string;
  intake: string;
  image_url: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: CountryFormState = {
  name: "",
  flag: "",
  tagline: "",
  description: "",
  benefits: [],
  requirements: [],
  tuition: "",
  intake: "",
  image_url: "",
  display_order: "",
  is_active: true,
};

interface CountryFormModalProps {
  open: boolean;
  editing: StudyCountry | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
}

export const CountryFormModal: React.FC<CountryFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<CountryFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            name: editing.name,
            flag: editing.flag || "",
            tagline: editing.tagline || "",
            description: editing.description || "",
            benefits: editing.benefits,
            requirements: editing.requirements,
            tuition: editing.tuition || "",
            intake: editing.intake || "",
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

  const set = <K extends keyof CountryFormState>(key: K) => (value: CountryFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Please enter the country name.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      flag: form.flag.trim().toUpperCase() || null,
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      benefits: form.benefits,
      requirements: form.requirements,
      tuition: form.tuition.trim() || null,
      intake: form.intake.trim() || null,
      image_url: form.image_url.trim() || null,
      display_order: form.display_order === "" ? null : Number(form.display_order),
      is_active: form.is_active,
    };

    const ok = await onSubmit(payload, editing?.id);
    if (ok) onClose();
  };

  return (
    <FormShell
      open={open}
      title={editing ? "Edit destination" : "Add study destination"}
      submitLabel={editing ? "Save changes" : "Create destination"}
      saving={saving}
      busy={uploading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field
        id="country-name"
        label="Country name *"
        value={form.name}
        onChange={set("name")}
        placeholder="Germany"
      />
      <Field
        id="country-flag"
        label="Country code"
        value={form.flag}
        onChange={set("flag")}
        placeholder="DE"
      />
      <Field
        id="country-tagline"
        label="Tagline"
        value={form.tagline}
        onChange={set("tagline")}
        placeholder="Tuition-free public universities"
        full
      />

      <TextAreaField
        id="country-description"
        label="Description"
        value={form.description}
        onChange={set("description")}
        placeholder="Why students choose this destination."
      />

      <Field
        id="country-tuition"
        label="Tuition"
        value={form.tuition}
        onChange={set("tuition")}
        placeholder="EUR 0 - 500 / semester"
      />
      <Field
        id="country-intake"
        label="Intakes"
        value={form.intake}
        onChange={set("intake")}
        placeholder="Winter (Oct) & Summer (Apr)"
      />

      <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
        <ArrayTextarea
          id="country-benefits"
          label="Key benefits"
          value={form.benefits}
          onChange={set("benefits")}
          placeholder={"No tuition fee at public universities\n18-month post-study work visa"}
        />
        <ArrayTextarea
          id="country-requirements"
          label="Requirements"
          value={form.requirements}
          onChange={set("requirements")}
          placeholder={"FSc / A-Levels or Bachelor degree\nGerman B1-B2 or IELTS 6.0"}
        />
      </div>

      <div className="sm:col-span-2">
        <ImageUploadField
          label="Destination image"
          value={form.image_url}
          onChange={set("image_url")}
          folder="countries"
          onUploadingChange={setUploading}
        />
      </div>

      <OrderAndVisibility
        idPrefix="country"
        order={form.display_order}
        onOrderChange={set("display_order")}
        active={form.is_active}
        onActiveChange={set("is_active")}
      />
    </FormShell>
  );
};
