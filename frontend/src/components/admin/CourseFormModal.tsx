import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CATEGORY_TABS } from "../../data/content";
import { Course, CourseCategory } from "../../types";
import { Field, FormShell, OrderAndVisibility, TextAreaField } from "./FormShell";
import { ImageUploadField } from "./ImageUploadField";

interface CourseFormState {
  title: string;
  category: CourseCategory;
  level: string;
  duration: string;
  fee: string;
  description: string;
  image_url: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: CourseFormState = {
  title: "",
  category: "german",
  level: "",
  duration: "",
  fee: "",
  description: "",
  image_url: "",
  display_order: "",
  is_active: true,
};

interface CourseFormModalProps {
  open: boolean;
  editing: Course | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<CourseFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            title: editing.title,
            category: editing.category,
            level: editing.level || "",
            duration: editing.duration || "",
            fee: editing.fee || "",
            description: editing.description || "",
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

  const set = <K extends keyof CourseFormState>(key: K) => (value: CourseFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.title.trim().length < 3) {
      toast.error("Please enter a course title.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      level: form.level.trim() || null,
      duration: form.duration.trim() || null,
      fee: form.fee.trim() || null,
      description: form.description.trim() || null,
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
      title={editing ? "Edit course" : "Add new course"}
      submitLabel={editing ? "Save changes" : "Create course"}
      saving={saving}
      busy={uploading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field
        id="course-title"
        label="Course title *"
        value={form.title}
        onChange={set("title")}
        placeholder="German B1 - Intermediate"
        full
      />

      <div>
        <label className="label" htmlFor="course-category">
          Category *
        </label>
        <select
          id="course-category"
          className="input"
          value={form.category}
          onChange={(event) => set("category")(event.target.value as CourseCategory)}
        >
          {CATEGORY_TABS.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <Field id="course-level" label="Level" value={form.level} onChange={set("level")} placeholder="B1" />
      <Field
        id="course-duration"
        label="Duration"
        value={form.duration}
        onChange={set("duration")}
        placeholder="10 weeks"
      />
      <Field
        id="course-fee"
        label="Fee"
        value={form.fee}
        onChange={set("fee")}
        placeholder="PKR 22,000"
      />

      <TextAreaField
        id="course-description"
        label="Description"
        value={form.description}
        onChange={set("description")}
        placeholder="What the course covers, who it is for and which exam it prepares."
      />

      <div className="sm:col-span-2">
        <ImageUploadField
          label="Course image"
          value={form.image_url}
          onChange={set("image_url")}
          folder="courses"
          onUploadingChange={setUploading}
        />
      </div>

      <OrderAndVisibility
        idPrefix="course"
        order={form.display_order}
        onOrderChange={set("display_order")}
        active={form.is_active}
        onActiveChange={set("is_active")}
      />
    </FormShell>
  );
};
