import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Row } from "../types";

export interface RemoteList<T> {
  items: T[];
  loading: boolean;
  usingFallback: boolean;
  reload: () => Promise<void>;
}

/**
 * Reads a public table. If Supabase is unavailable, or the table is empty,
 * the bundled seed content is shown so the site is never blank.
 */
export function useRemoteList<T>(
  table: string,
  seed: T[],
  map: (row: Row) => T,
  orderColumn: string = "display_order"
): RemoteList<T> {
  const [items, setItems] = useState<T[]>(seed);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [usingFallback, setUsingFallback] = useState<boolean>(!isSupabaseConfigured);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setItems(seed);
      setUsingFallback(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("is_active", true)
      .order(orderColumn, { ascending: true, nullsFirst: false });

    if (error || !data || data.length === 0) {
      setItems(seed);
      setUsingFallback(true);
    } else {
      setItems((data as Row[]).map(map));
      setUsingFallback(false);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, orderColumn]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, usingFallback, reload: load };
}

/* =========================================================================
   9. HOME PAGE
   ========================================================================= */
