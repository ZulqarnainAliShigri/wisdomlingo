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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10 text-xs sm:text-sm"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>
          {filter}
        </div>

        <button type="button" className="btn-primary w-full sm:w-auto justify-center" onClick={onAdd}>
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>

      <div className="mt-5 sm:mt-6">
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
            <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition hover:shadow-md">
                  {image && (
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                      <MediaImage src={image(item)} alt={primary(item)} className="h-full w-full object-cover" />
                      <div className="absolute top-2.5 right-2.5 z-10">
                        {statusBadge(item)}
                      </div>
                    </div>
                  )}
                  <div className="p-3.5 sm:p-4">
                    {!image && (
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entry</span>
                        {statusBadge(item)}
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{primary(item)}</h3>
                    {secondary && <p className="mt-0.5 text-xs text-slate-500">{secondary(item)}</p>}
                    
                    <div className="mt-3 rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
                      <dl className="space-y-1 text-xs text-slate-600">
                        {columns.map((column) => (
                          <div key={column.header} className="flex items-center justify-between gap-2 py-0.5">
                            <dt className="font-semibold text-slate-400 text-[11px]">{column.header}:</dt>
                            <dd className="min-w-0 font-medium text-slate-800 text-right truncate">{column.render(item)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2">
                      <button
                        type="button"
                        className="btn-primary flex-1 !py-2 text-xs font-bold justify-center"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn !py-2 px-3 border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                        onClick={() => onDelete(item)}
                        aria-label={`Delete ${primary(item)}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
