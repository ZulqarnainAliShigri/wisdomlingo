import React from "react";
import { Image as ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminEntity } from "../../hooks/useAdminCollection";
import { EmptyState } from "../ui/EmptyState";
import { FullPageLoader } from "../ui/Loader";
import { MediaImage } from "../ui/MediaImage";

export interface AdminColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface AdminListProps<T> {
  items: T[];
  loading: boolean;
  columns: AdminColumn<T>[];
  /** Primary label shown in the first table cell and on mobile cards. */
  primary: (item: T) => string;
  secondary?: (item: T) => string;
  image?: (item: T) => string | null;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onToggleActive: (item: T) => void;
  /* Toolbar */
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  addLabel: string;
  onAdd: () => void;
  filter?: React.ReactNode;
  emptyTitle: string;
  emptyHint?: string;
}

/**
 * Shared admin table: searchable toolbar, a desktop table and mobile cards,
 * with edit / delete / visibility actions on every row.
 */
export function AdminList<T extends AdminEntity>({
  items,
  loading,
  columns,
  primary,
  secondary,
  image,
  onEdit,
  onDelete,
  onToggleActive,
  search,
  onSearchChange,
  searchPlaceholder = "Search",
  addLabel,
  onAdd,
  filter,
  emptyTitle,
  emptyHint,
}: AdminListProps<T>) {
  const statusBadge = (item: T) => (
    <button
      type="button"
      onClick={() => onToggleActive(item)}
      title="Toggle visibility on the public website"
      className={`badge ${
        item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {item.is_active ? "Visible" : "Hidden"}
    </button>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>
          {filter}
        </div>

        <button type="button" className="btn-primary" onClick={onAdd}>
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <FullPageLoader label="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 lg:block">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    {columns.map((column) => (
                      <th key={column.header} className="px-5 py-3 font-semibold">
                        {column.header}
                      </th>
                    ))}
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {image && (
                            <MediaImage
                              src={image(item)}
                              alt={primary(item)}
                              className="h-11 w-16 shrink-0 rounded-lg"
                              fallbackIcon={<ImageIcon className="h-4 w-4" />}
                            />
                          )}
                          <span>
                            <span className="block font-semibold text-slate-900">
                              {primary(item)}
                            </span>
                            {secondary && (
                              <span className="block text-xs text-slate-500">{secondary(item)}</span>
                            )}
                          </span>
                        </div>
                      </td>
                      {columns.map((column) => (
                        <td key={column.header} className="px-5 py-3 text-slate-600">
                          {column.render(item)}
                        </td>
                      ))}
                      <td className="px-5 py-3">{statusBadge(item)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Edit ${primary(item)}`}
                            onClick={() => onEdit(item)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-primary hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${primary(item)}`}
                            onClick={() => onDelete(item)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-accent hover:text-accent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="card overflow-hidden">
                  {image && (
                    <MediaImage src={image(item)} alt={primary(item)} className="h-32 w-full" />
                  )}
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">{statusBadge(item)}</div>
                    <h3 className="mt-2 font-bold text-slate-900">{primary(item)}</h3>
                    {secondary && <p className="mt-1 text-xs text-slate-500">{secondary(item)}</p>}
                    <dl className="mt-3 space-y-1 text-xs text-slate-600">
                      {columns.map((column) => (
                        <div key={column.header} className="flex gap-2">
                          <dt className="font-semibold text-slate-500">{column.header}:</dt>
                          <dd className="min-w-0 flex-1 truncate">{column.render(item)}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="btn-ghost flex-1 !py-2"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn !py-2 border border-accent text-accent hover:bg-accent-50"
                        onClick={() => onDelete(item)}
                        aria-label={`Delete ${primary(item)}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
