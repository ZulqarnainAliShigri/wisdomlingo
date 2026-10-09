import { useEffect } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

/**
 * SupabaseKeepAlive Component
 * 
 * Periodically pings the Supabase database every 5 minutes (300,000 ms)
 * to keep the database connection warm and prevent idle timeouts.
 */
export const SupabaseKeepAlive: React.FC = () => {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const pingDatabase = async () => {
      try {
        // Lightweight query fetching 1 row
        await supabase.from("company_settings").select("id").limit(1);
      } catch (err) {
        // Silently catch network or idle errors
      }
    };

    // Run ping immediately on mount
    pingDatabase();

    // Schedule query every 5 minutes (300,000 ms)
    const interval = setInterval(pingDatabase, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};
