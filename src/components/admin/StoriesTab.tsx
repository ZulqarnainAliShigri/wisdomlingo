import React, { useMemo, useState } from "react";
import { SEED_STORIES } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapStory } from "../../lib/mappers";
import { Story } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { StoryFormModal } from "./StoryFormModal";

export const StoriesTab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { items, loading, saving, deleting, save, remove, toggleActive } =
    useAdminCollection<Story>("success_stories", mapStory, SEED_STORIES);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Story | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (story) =>
        story.name.toLowerCase().includes(term) ||
        story.institution.toLowerCase().includes(term) ||
        story.destination_country.toLowerCase().includes(term) ||
        story.role.toLowerCase().includes(term)
    );
  }, [items, search]);

  return (
    <div>
      <AdminList<Story>
        items={filtered}
        loading={loading}
        primary={(story) => `${story.flag || "🎓"} ${story.name}`}
        secondary={(story) => `${story.role} • ${story.institution}`}
        image={(story) => story.avatar_url}
        columns={[
          {
            header: "Country",
            render: (story) => (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                <span>{story.flag || "🎓"}</span>
                <span>{story.destination_country}</span>
              </span>
            ),
          },
          {
            header: "Status",
            render: (story) => (
              <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                {story.status_badge || "Visa Approved"}
              </span>
            ),
          },
          {
            header: "Highlight",
            render: (story) => (
              <span className="text-slate-600 truncate max-w-[180px] block">
                {story.highlight || "-"}
              </span>
            ),
          },
          {
            header: "Rating",
            render: (story) => (
              <span className="text-amber-500 font-semibold tracking-wider">
                {"★".repeat(story.rating || 5)}
              </span>
            ),
          },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search stories by student, university or country"
        addLabel="Add story"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onEdit={(story) => {
          setEditing(story);
          setModalOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggleActive={toggleActive}
        onBack={onBack}
        emptyTitle="No success stories found"
        emptyHint="Add real alumni and student success stories to showcase on the homepage."
      />

      <StoryFormModal
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
        title="Delete success story"
        message={`This will permanently remove the story for "${
          pendingDelete?.name ?? ""
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
