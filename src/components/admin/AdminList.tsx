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
  searchPlaceholder = "Search...",
  addLabel,
  onAdd,
  filter,
  emptyTitle,
  emptyHint,
  onBack,
  defaultView = "list",
}: AdminListProps<T>) {
  const [viewMode, setViewMode] = useState<"cards" | "list">(defaultView);

  const statusBadge = (item: T) => (
    <button
      type="button"
      onClick={() => onToggleActive(item)}
      title="Toggle visibility on website"
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition hover:scale-105 active:scale-95 ${item.is_active
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
      />
      {item.is_active ? "Visible" : "Hidden"}
    </button>
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Unified Toolbar: Back button + Search + Add Button on same line, with View Switcher & Filter */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Primary Row: [Back] + [Search] + [Mobile Add] */}
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

          <div className="relative flex-1 min-w-[130px]">
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

          {/* On mobile: Add button on the same line */}
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

        {/* Secondary Row: Mobile Filter + View Switcher + Desktop Add Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {filter && <div className="flex-1 sm:hidden">{filter}</div>}

          {/* View Switcher: List vs Cards */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              title="List view"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${viewMode === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              aria-pressed={viewMode === "cards"}
              title="Cards view"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${viewMode === "cards"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
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

      <div>
        {loading ? (
          <FullPageLoader label="Loading items..." />
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : viewMode === "list" ? (
          /* ================= SLIM & SIMPLE LIST VIEW ================= */
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
            {/* Desktop / Tablet Thin Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-2.5">Title</th>
                    {columns.map((column) => (
                      <th key={column.header} className="px-3 py-2.5">
                        {column.header}
                      </th>
                    ))}
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-2 sm:py-2.5">
                        <div className="flex items-center gap-2.5">
                          {image && (
                            <MediaImage
                              src={image(item)}
                              alt={primary(item)}
                              className="h-8 w-11 shrink-0 rounded-md object-cover border border-slate-200/80 shadow-2xs"
                              fallbackIcon={<ImageIcon className="h-3.5 w-3.5 text-slate-400" />}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs text-xs sm:text-sm">
                              {primary(item)}
                            </p>
                          </div>
                        </div>
                      </td>
                      {columns.map((column) => (
                        <td key={column.header} className="px-3 py-2 sm:py-2.5 text-slate-600 font-medium whitespace-nowrap">
                          {column.render(item)}
                        </td>
                      ))}
                      <td className="px-3 py-2 sm:py-2.5 whitespace-nowrap">{statusBadge(item)}</td>
                      <td className="px-4 py-2 sm:py-2.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Edit ${primary(item)}`}
                            onClick={() => onEdit(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${primary(item)}`}
                            onClick={() => onDelete(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50/50 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 active:scale-95"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Thin Single-Row Items */}
            <div className="divide-y divide-slate-100 sm:hidden">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2.5 px-3 py-2.5 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {image && (
                      <MediaImage
                        src={image(item)}
                        alt={primary(item)}
                        className="h-9 w-9 shrink-0 rounded-lg object-cover border border-slate-200/80"
                        fallbackIcon={<ImageIcon className="h-3.5 w-3.5 text-slate-400" />}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 leading-snug">
                        {primary(item)}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                        {columns.slice(0, 2).map((col) => (
                          <span key={col.header} className="truncate">
                            {col.render(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {statusBadge(item)}
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 active:scale-95"
                      title="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 active:scale-95"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
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
