import React, { useMemo, useState } from "react";
import { SEED_APPRENTICESHIPS } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapApprenticeship } from "../../lib/mappers";
import { Apprenticeship } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { ApprenticeshipFormModal } from "./ApprenticeshipFormModal";

export const ApprenticeshipsTab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
          {
            header: "Field",
            render: (item) => (
              <span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary">
                {item.field}
              </span>
            ),
          },
          {
            header: "Salary / Stipend",
            render: (item) => <span className="font-bold text-slate-900">{item.salary || "-"}</span>,
          },
          { header: "Duration", render: (item) => <span className="text-slate-600">{item.duration || "-"}</span> },
          {
            header: "Details",
            render: (item) => (
              <span className="text-slate-600 text-xs">
                {item.requirements.length} reqs • {item.benefits.length} perks
              </span>
            ),
          },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title or field"
        addLabel="Add Ausbildung"
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
        onBack={onBack}
        emptyTitle="No Ausbildung programs found"
        emptyHint="Add a field to show it on the Ausbildung page."
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
        title="Delete Ausbildung"
        message={`This will permanently remove "${
          pendingDelete?.title ?? ""
        }" from the Ausbildung page. This action cannot be undone.`}
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
