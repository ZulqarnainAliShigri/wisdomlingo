import React, { useMemo, useState } from "react";
import { SEED_COUNTRIES } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapCountry } from "../../lib/mappers";
import { StudyCountry } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { CountryFormModal } from "./CountryFormModal";

export const CountriesTab: React.FC = () => {
  const { items, loading, saving, deleting, save, remove, toggleActive } =
    useAdminCollection<StudyCountry>("study_countries", mapCountry, SEED_COUNTRIES);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudyCountry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StudyCountry | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        (country.tagline || "").toLowerCase().includes(term)
    );
  }, [items, search]);

  return (
    <div>
      <AdminList<StudyCountry>
        items={filtered}
        loading={loading}
        primary={(country) => country.name}
        secondary={(country) => country.tagline || ""}
        image={(country) => country.image_url}
        columns={[
          { header: "Code", render: (country) => country.flag || "-" },
          { header: "Tuition", render: (country) => country.tuition || "-" },
          { header: "Intakes", render: (country) => country.intake || "-" },
          {
            header: "Lists",
            render: (country) => `${country.benefits.length} benefits, ${country.requirements.length} requirements`,
          },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search destinations"
        addLabel="Add destination"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onEdit={(country) => {
          setEditing(country);
          setModalOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggleActive={toggleActive}
        emptyTitle="No destinations found"
        emptyHint="Add a study destination to show it on the Study Abroad page."
      />

      <CountryFormModal
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
        title="Delete destination"
        message={`This will permanently remove "${
          pendingDelete?.name ?? ""
        }" from the Study Abroad page. This action cannot be undone.`}
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
