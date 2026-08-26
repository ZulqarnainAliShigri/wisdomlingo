import React, { useMemo, useState } from "react";
import { CATEGORY_TABS } from "../../data/content";
import { SEED_COURSES } from "../../data/seed";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import { mapCourse } from "../../lib/mappers";
import { Course, CourseCategory } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AdminList } from "./AdminList";
import { CourseFormModal } from "./CourseFormModal";

export const CoursesTab: React.FC = () => {
  const { items, loading, saving, deleting, save, remove, toggleActive } =
    useAdminCollection<Course>("courses", mapCourse, SEED_COURSES);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CourseCategory>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((course) => {
      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
      const matchesTerm =
        !term ||
        course.title.toLowerCase().includes(term) ||
        (course.level || "").toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [items, search, categoryFilter]);

  return (
    <div>
      <AdminList<Course>
        items={filtered}
        loading={loading}
        primary={(course) => course.title}
        image={(course) => course.image_url}
        columns={[
          { header: "Category", render: (course) => <span className="capitalize">{course.category}</span> },
          { header: "Level", render: (course) => course.level || "-" },
          { header: "Duration", render: (course) => course.duration || "-" },
          {
            header: "Fee",
            render: (course) => <span className="font-semibold text-slate-800">{course.fee || "-"}</span>,
          },
        ]}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title or level"
        addLabel="Add course"
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onEdit={(course) => {
          setEditing(course);
          setModalOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggleActive={toggleActive}
        emptyTitle="No courses found"
        emptyHint="Add your first course, or clear the filters above."
        filter={
          <select
            className="input sm:w-48"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as "all" | CourseCategory)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORY_TABS.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        }
      />

      <CourseFormModal
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
        title="Delete course"
        message={`This will permanently remove "${
          pendingDelete?.title ?? ""
        }" and its uploaded image. This action cannot be undone.`}
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
