import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";


/** True only when both env vars are present, so the UI can fall back to
 *  bundled seed content instead of crashing on a missing backend. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export const STORAGE_BUCKET = "course-images";
export const ADMIN_EMAIL = "admin@wisdomlingo.com";
