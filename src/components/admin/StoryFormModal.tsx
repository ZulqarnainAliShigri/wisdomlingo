import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Story } from "../../types";
import { Field, FormShell, OrderAndVisibility, TextAreaField } from "./FormShell";
import { ImageUploadField } from "./ImageUploadField";

interface StoryFormState {
  name: string;
  role: string;
  institution: string;
  destination_country: string;
  flag: string;
  intake: string;
  status_badge: string;
  highlight: string;
  metric: string;
  quote: string;
  rating: string;
  avatar_url: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: StoryFormState = {
  name: "",
  role: "",
  institution: "",
  destination_country: "Germany",
  flag: "🇩🇪",
  intake: "",
  status_badge: "Visa Approved & Enrolled",
  highlight: "",
  metric: "",
  quote: "",
  rating: "5",
  avatar_url: "",
  display_order: "",
  is_active: true,
};

interface StoryFormModalProps {
  open: boolean;
  editing: Story | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
}

export const StoryFormModal: React.FC<StoryFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<StoryFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            name: editing.name,
            role: editing.role,
            institution: editing.institution,
            destination_country: editing.destination_country,
            flag: editing.flag || "🇩🇪",
            intake: editing.intake || "",
            status_badge: editing.status_badge || "Visa Approved",
            highlight: editing.highlight || "",
            metric: editing.metric || "",
            quote: editing.quote || "",
            rating: String(editing.rating || 5),
            avatar_url: editing.avatar_url || "",
            display_order:
              editing.display_order === null || editing.display_order === undefined
                ? ""
                : String(editing.display_order),
            is_active: editing.is_active,
          }
        : EMPTY
    );
  }, [open, editing]);

  const set = <K extends keyof StoryFormState>(key: K) => (value: StoryFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Please enter the student's name.");
      return;
    }
    if (!form.quote.trim()) {
      toast.error("Please provide the testimonial story / quote.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || "Student",
      institution: form.institution.trim() || "European University",
      destination_country: form.destination_country.trim() || "Germany",
      flag: form.flag.trim() || "🇩🇪",
      intake: form.intake.trim() || null,
      status_badge: form.status_badge.trim() || "Visa Approved",
      highlight: form.highlight.trim() || "Verified Alumnus",
      metric: form.metric.trim() || null,
      quote: form.quote.trim(),
      rating: Number(form.rating) || 5,
      avatar_url: form.avatar_url.trim() || null,
      display_order: form.display_order === "" ? null : Number(form.display_order),
      is_active: form.is_active,
    };

    const ok = await onSubmit(payload, editing?.id);
    if (ok) onClose();
  };

  return (
    <FormShell
      open={open}
      title={editing ? "Edit Success Story" : "Add Success Story"}
      submitLabel={editing ? "Save changes" : "Create Story"}
      saving={saving}
      busy={uploading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field
        id="story-name"
        label="Student Name *"
        value={form.name}
        onChange={set("name")}
        placeholder="Sarah Jenkins"
      />

      <Field
        id="story-role"
        label="Program / Degree *"
        value={form.role}
        onChange={set("role")}
        placeholder="MSc Automotive Engineering"
      />

      <Field
        id="story-institution"
        label="University / Employer *"
        value={form.institution}
        onChange={set("institution")}
        placeholder="TU Munich, Germany"
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="story-country"
          label="Country *"
          value={form.destination_country}
          onChange={set("destination_country")}
          placeholder="Germany"
        />
        <Field
          id="story-flag"
          label="Flag Emoji"
          value={form.flag}
          onChange={set("flag")}
          placeholder="🇩🇪"
        />
      </div>

      <Field
        id="story-intake"
        label="Intake / Year"
        value={form.intake}
        onChange={set("intake")}
        placeholder="Winter 2026 Intake"
      />

      <Field
        id="story-status"
        label="Status Badge"
        value={form.status_badge}
        onChange={set("status_badge")}
        placeholder="Visa Approved & Enrolled"
      />

      <Field
        id="story-highlight"
        label="Key Highlight"
        value={form.highlight}
        onChange={set("highlight")}
        placeholder="B2 Passed in 4 Months"
      />

      <Field
        id="story-metric"
        label="Achievement Metric"
        value={form.metric}
        onChange={set("metric")}
        placeholder="Tuition-Free Public University"
      />

      <div className="sm:col-span-2">
        <label className="label" htmlFor="story-rating">
          Rating (1 to 5 Stars)
        </label>
        <select
          id="story-rating"
          className="input"
          value={form.rating}
          onChange={(e) => set("rating")(e.target.value)}
        >
          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
          <option value="3">⭐⭐⭐ (3 Stars)</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <ImageUploadField
          label="Student Photo"
          value={form.avatar_url}
          onChange={set("avatar_url")}
          onUploadingChange={setUploading}
        />
      </div>

      <TextAreaField
        id="story-quote"
        label="Story / Testimonial Quote *"
        value={form.quote}
        onChange={set("quote")}
        placeholder="Share what the student achieved, their visa process experience, and how WisdomLingo helped them..."
      />

      <OrderAndVisibility
        idPrefix="story"
        order={form.display_order}
        onOrderChange={set("display_order")}
        active={form.is_active}
        onActiveChange={set("is_active")}
      />
    </FormShell>
  );
};
