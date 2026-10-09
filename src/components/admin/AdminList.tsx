import React, { useState } from "react";
import { ArrowLeft, Image as ImageIcon, LayoutGrid, List, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
  /* Navigation & View */
  onBack?: () => void;
  defaultView?: "cards" | "list";
}

/**
 * Shared admin table & card list: searchable toolbar on one line, back button,
 * Cards/List switcher, with edit / delete / visibility actions on every row.
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
  onBack,
  defaultView = "cards",
}: AdminListProps<T>) {
  const [viewMode, setViewMode] = useState<"cards" | "list">(defaultView);

  const statusBadge = (item: T) => (
    <button
      type="button"
      onClick={() => onToggleActive(item)}
      title="Toggle visibility on the public website"
      className={`badge transition hover:scale-105 active:scale-95 ${
        item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {item.is_active ? "Visible" : "Hidden"}
    </button>
  );

  return (
    <div>
      {/* Unified Toolbar: Back button + Search + Add Button in top line, with View Switcher & Filter */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Primary Controls Row: [Back] + [Search] + (Mobile Add Button) */}
        <div className="flex flex-1 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Back to Dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="relative flex-1 min-w-[120px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input !py-1.5 sm:!py-2 !pl-9 text-xs sm:text-sm"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>

          {filter && <div className="hidden sm:block shrink-0">{filter}</div>}

          {/* On mobile, show Add button beside search in top line */}
          <button
            type="button"
            className="btn-primary !py-1.5 px-3 text-xs font-bold shrink-0 shadow-xs sm:hidden"
            onClick={onAdd}
            title={addLabel}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">{addLabel}</span>
          </button>
        </div>

        {/* Secondary Controls: Filter (mobile) + View Switcher + Add Button (desktop) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {filter && <div className="flex-1 sm:hidden">{filter}</div>}

          {/* View Switcher: Cards vs List */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              aria-pressed={viewMode === "cards"}
              title="Cards view"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "cards"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              title="List view"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Desktop Add Button */}
          <button
            type="button"
            className="btn-primary !py-1.5 sm:!py-2 text-xs sm:text-sm font-bold hidden sm:inline-flex justify-center whitespace-nowrap shadow-xs"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
            <span>{addLabel}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        {loading ? (
          <FullPageLoader label="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : viewMode === "list" ? (
          /* ================= LIST / TABLE VIEW ================= */
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            {/* Desktop Full Table */}
            <div className="hidden lg:block overflow-x-auto">
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
                          <span className="min-w-0">
                            <span className="block font-semibold text-slate-900 truncate max-w-xs">
                              {primary(item)}
                            </span>
                            {secondary && (
                              <span className="block text-xs text-slate-500 truncate max-w-xs">
                                {secondary(item)}
                              </span>
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

            {/* Mobile / Compact List View */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-slate-50/80 transition">
                  {image && (
                    <MediaImage
                      src={image(item)}
                      alt={primary(item)}
                      className="h-12 w-14 sm:h-14 sm:w-16 shrink-0 rounded-xl object-cover border border-slate-200/60"
                      fallbackIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {primary(item)}
                      </h4>
                      {statusBadge(item)}
                    </div>
                    {secondary && (
                      <p className="mt-0.5 truncate text-[11px] sm:text-xs text-slate-500">
                        {secondary(item)}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-500">
                      {columns.map((column) => (
                        <span key={column.header} className="inline-flex items-center gap-1">
                          <span className="text-slate-400">{column.header}:</span>
                          <span className="font-semibold text-slate-700">{column.render(item)}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label={`Edit ${primary(item)}`}
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${primary(item)}`}
                      onClick={() => onDelete(item)}
                      className="rounded-lg border border-rose-200 bg-rose-50/50 p-2 text-rose-600 transition hover:border-accent hover:bg-rose-100 active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ================= CARDS VIEW ================= */
          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition hover:shadow-md flex flex-col justify-between"
              >
                {image && (
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <MediaImage src={image(item)} alt={primary(item)} className="h-full w-full object-cover" />
                    <div className="absolute top-2.5 right-2.5 z-10">
                      {statusBadge(item)}
                    </div>
                  </div>
                )}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
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
                            <dd className="min-w-0 font-medium text-slate-800 text-right truncate">
                              {column.render(item)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-slate-100">
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
        )}
      </div>
    </div>
  );
}
