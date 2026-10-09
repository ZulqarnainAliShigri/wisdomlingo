import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Article } from "../../types";
import { ArrayTextarea } from "./ArrayTextarea";
import { Field, FormShell, OrderAndVisibility, TextAreaField } from "./FormShell";
import { ImageUploadField } from "./ImageUploadField";

const COMMON_CATEGORIES = [
  "Study Guide",
  "Language",
  "Ausbildung",
  "Visa & Documents",
  "Student Life",
  "Scholarships",
  "Admissions",
];

interface ArticleFormState {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: string;
  image_url: string;
  tags: string[];
  link_url: string;
  display_order: string;
  is_active: boolean;
}

const EMPTY: ArticleFormState = {
  title: "",
  category: "Study Guide",
  excerpt: "",
  content: "",
  author: "Academic Advisory Desk",
  read_time: "5 min read",
  image_url: "",
  tags: [],
  link_url: "",
  display_order: "",
  is_active: true,
};

interface ArticleFormModalProps {
  open: boolean;
  editing: Article | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  open,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ArticleFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            title: editing.title,
            category: editing.category || "Study Guide",
            excerpt: editing.excerpt || "",
            content: editing.content || "",
            author: editing.author || "Academic Advisory Desk",
            read_time: editing.read_time || "5 min read",
            image_url: editing.image_url || "",
            tags: editing.tags || [],
            link_url: editing.link_url || "",
            display_order:
              editing.display_order === null || editing.display_order === undefined
                ? ""
                : String(editing.display_order),
            is_active: editing.is_active,
          }
        : EMPTY
    );
  }, [open, editing]);

  const set = <K extends keyof ArticleFormState>(key: K) => (value: ArticleFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.title.trim().length < 5) {
      toast.error("Please enter a descriptive article title.");
      return;
    }
    if (!form.excerpt.trim()) {
      toast.error("Please provide a short summary / excerpt.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || "Study Guide",
      excerpt: form.excerpt.trim(),
      content: form.content.trim() || null,
      author: form.author.trim() || null,
      read_time: form.read_time.trim() || "5 min read",
      image_url: form.image_url.trim() || null,
      tags: form.tags,
      link_url: form.link_url.trim() || null,
      display_order: form.display_order === "" ? null : Number(form.display_order),
      is_active: form.is_active,
    };

    const ok = await onSubmit(payload, editing?.id);
    if (ok) onClose();
  };

  return (
    <FormShell
      open={open}
      title={editing ? "Edit Article" : "Write New Article"}
      submitLabel={editing ? "Save changes" : "Publish Article"}
      saving={saving}
      busy={uploading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field
        id="art-title"
        label="Article Title *"
        value={form.title}
        onChange={set("title")}
        placeholder="Top 5 Public Universities in Germany for Engineering in 2026"
        full
      />

      <div>
        <label className="label" htmlFor="art-category">
          Category *
        </label>
        <input
          id="art-category"
          list="article-category-list"
          className="input"
          value={form.category}
          onChange={(e) => set("category")(e.target.value)}
          placeholder="Study Guide"
        />
        <datalist id="article-category-list">
          {COMMON_CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <Field
        id="art-readtime"
        label="Read Time"
        value={form.read_time}
        onChange={set("read_time")}
        placeholder="5 min read"
      />

      <Field
        id="art-author"
        label="Author / Desk"
        value={form.author}
        onChange={set("author")}
        placeholder="Academic Advisory Desk"
      />

      <Field
        id="art-link"
        label="Page Link / CTA (e.g. /study-abroad)"
        value={form.link_url}
        onChange={set("link_url")}
        placeholder="/study-abroad or /courses"
      />

      <div className="sm:col-span-2">
        <ImageUploadField
          label="Featured Article Cover Image"
          value={form.image_url}
          onChange={set("image_url")}
          onUploadingChange={setUploading}
        />
      </div>

      <TextAreaField
        id="art-excerpt"
        label="Summary / Excerpt *"
        value={form.excerpt}
        onChange={set("excerpt")}
        placeholder="A concise summary of the article shown on the home page and blog cards..."
      />

      <div className="sm:col-span-2">
        <label className="label" htmlFor="art-content">
          Full Article Content (Optional Details)
        </label>
        <textarea
          id="art-content"
          className="input min-h-[140px] resize-y"
          value={form.content}
          onChange={(e) => set("content")(e.target.value)}
          placeholder="Write the full content or key guidelines for this article..."
        />
      </div>

      <div className="sm:col-span-2">
        <ArrayTextarea
          id="art-tags"
          label="Tags / Topics (one per line)"
          value={form.tags}
          onChange={set("tags")}
          placeholder={"Tuition-Free\nTU9 Universities\nWinter 2026"}
        />
      </div>

      <OrderAndVisibility
        idPrefix="art"
        order={form.display_order}
        onOrderChange={set("display_order")}
        active={form.is_active}
        onActiveChange={set("is_active")}
      />
    </FormShell>
  );
};
