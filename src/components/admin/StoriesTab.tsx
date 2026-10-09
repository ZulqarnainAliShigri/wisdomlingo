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
          { header: "Country", render: (story) => `${story.destination_country}` },
          { header: "Badge", render: (story) => story.status_badge || "Approved" },
          { header: "Highlight", render: (story) => story.highlight || "-" },
          { header: "Rating", render: (story) => "★".repeat(story.rating || 5) },
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
