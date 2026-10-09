import React, { useMemo, useState } from "react";
import { SEED_ARTICLES } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapArticle } from "../../lib/mappers";
import { Article } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { ArticleFormModal } from "./ArticleFormModal";

export const ArticlesTab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { items, loading, saving, deleting, save, remove, toggleActive } =
    useAdminCollection<Article>("articles", mapArticle, SEED_ARTICLES);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (art) =>
        art.title.toLowerCase().includes(term) ||
        art.category.toLowerCase().includes(term) ||
        (art.author || "").toLowerCase().includes(term) ||
        (art.excerpt || "").toLowerCase().includes(term)
    );
  }, [items, search]);

  return (
    <div>
      <AdminList<Article>
        items={filtered}
        loading={loading}
        primary={(art) => art.title}
        secondary={(art) => `${art.category} • ${art.author || "WisdomLingo"} • ${art.read_time || "5 min"}`}
        image={(art) => art.image_url}
        columns={[
          {
            header: "Category",
            render: (art) => (
              <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
                {art.category}
              </span>
            ),
          },
          { header: "Read Time", render: (art) => <span className="text-slate-600">{art.read_time || "5 min"}</span> },
          {
            header: "Tags",
            render: (art) => (
              <span className="text-slate-600 truncate max-w-[160px] block">
                {art.tags.length ? art.tags.slice(0, 2).join(", ") : "-"}
              </span>
            ),
          },
          { header: "Author", render: (art) => <span className="text-slate-700 font-medium">{art.author || "WisdomLingo"}</span> },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search articles by title, category, or topic"
        addLabel="Add article"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onEdit={(art) => {
          setEditing(art);
          setModalOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggleActive={toggleActive}
        onBack={onBack}
        emptyTitle="No articles found"
        emptyHint="Write and publish educational guides, visa intel, and news articles."
      />

      <ArticleFormModal
        open={modalOpen}
        editing={editing}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={save}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete article"
        message={`This will permanently remove "${
          pendingDelete?.title ?? ""
        }". This action cannot be undone.`}
        busy={deleting}
        onConfirm={async () => {
          if (!pendingDelete) return;
          const ok = await remove(pendingDelete);
          if (ok) setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
