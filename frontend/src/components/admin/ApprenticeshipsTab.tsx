import React, { useMemo, useState } from "react";
import { SEED_APPRENTICESHIPS } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapApprenticeship } from "../../lib/mappers";
import { Apprenticeship } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { ApprenticeshipFormModal } from "./ApprenticeshipFormModal";

export const ApprenticeshipsTab: React.FC = () => {
  const { items, loading, saving, deleting, save, remove, toggleActive } =
    useAdminCollection<Apprenticeship>("apprenticeships", mapApprenticeship, SEED_APPRENTICESHIPS);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Apprenticeship | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Apprenticeship | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) || item.field.toLowerCase().includes(term)
    );
  }, [items, search]);

  return (
    <div>
      <AdminList<Apprenticeship>
        items={filtered}
        loading={loading}
        primary={(item) => item.title}
        secondary={(item) => item.field}
        image={(item) => item.image_url}
        columns={[
          { header: "Field", render: (item) => item.field },
          {
            header: "Salary",
            render: (item) => <span className="font-semibold text-slate-800">{item.salary || "-"}</span>,
          },
          { header: "Duration", render: (item) => item.duration || "-" },
          {
            header: "Lists",
            render: (item) => `${item.requirements.length} requirements, ${item.benefits.length} benefits`,
          },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title or field"
        addLabel="Add apprenticeship"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onEdit={(item) => {
          setEditing(item);
          setModalOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggleActive={toggleActive}
        emptyTitle="No apprenticeships found"
        emptyHint="Add a field to show it on the Apprenticeships page."
      />

      <ApprenticeshipFormModal
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
        title="Delete apprenticeship"
        message={`This will permanently remove "${
          pendingDelete?.title ?? ""
        }" from the Apprenticeships page. This action cannot be undone.`}
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
