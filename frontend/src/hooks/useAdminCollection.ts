import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteImageByUrl } from "../lib/storage";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";
import { Row } from "../types";

/** Minimum shape every table managed by the dashboard shares. */
export interface AdminEntity {
  id: string;
  is_active: boolean;
  image_url?: string | null;
}

export interface AdminCollection<T> {
  items: T[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  reload: () => Promise<void>;
  /** Insert when `id` is omitted, update otherwise. Resolves true on success. */
  save: (payload: Record<string, unknown>, id?: string) => Promise<boolean>;
  remove: (item: T) => Promise<boolean>;
  toggleActive: (item: T) => Promise<void>;
}

const READ_ONLY_MESSAGE =
  "Supabase is not connected, so changes cannot be saved. Add your project URL and anon key to .env.local.";

/**
 * One CRUD implementation shared by every admin tab: courses,
 * study destinations and apprenticeships all behave identically.
 */
export function useAdminCollection<T extends AdminEntity>(
  table: string,
  map: (row: Row) => T,
  demoItems: T[] = []
): AdminCollection<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setItems(demoItems);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(errorMessage(error, `Could not load ${table}.`));
      setItems([]);
    } else {
      setItems((data as Row[]).map(map));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async (payload: Record<string, unknown>, id?: string): Promise<boolean> => {
      if (!isSupabaseConfigured) {
        toast.error(READ_ONLY_MESSAGE);
        return false;
      }
      setSaving(true);
      try {
        if (id) {
          const { error } = await supabase.from(table).update(payload).eq("id", id);
          if (error) throw error;
          toast.success("Changes saved.");
        } else {
          const { error } = await supabase.from(table).insert([payload]);
          if (error) throw error;
          toast.success("Created successfully.");
        }
        await reload();
        return true;
      } catch (error) {
        toast.error(errorMessage(error, "Could not save your changes."));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [table, reload]
  );

  const remove = useCallback(
    async (item: T): Promise<boolean> => {
      if (!isSupabaseConfigured) {
        toast.error(READ_ONLY_MESSAGE);
        return false;
      }
      setDeleting(true);
      try {
        const { error } = await supabase.from(table).delete().eq("id", item.id);
        if (error) throw error;
        await deleteImageByUrl(item.image_url ?? null);
        toast.success("Deleted.");
        await reload();
        return true;
      } catch (error) {
        toast.error(errorMessage(error, "Could not delete this item."));
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [table, reload]
  );

  const toggleActive = useCallback(
    async (item: T) => {
      if (!isSupabaseConfigured) {
        toast.error(READ_ONLY_MESSAGE);
        return;
      }
      const { error } = await supabase
        .from(table)
        .update({ is_active: !item.is_active })
        .eq("id", item.id);
      if (error) {
        toast.error(errorMessage(error, "Could not update visibility."));
        return;
      }
      toast.success(item.is_active ? "Hidden from the website." : "Now visible on the website.");
      reload();
    },
    [table, reload]
  );

  return { items, loading, saving, deleting, reload, save, remove, toggleActive };
}
