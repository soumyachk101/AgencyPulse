import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
 throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
}

/**
 * Client-side Supabase client (uses anon key).
 * Use this when acting on behalf of a logged-in user.
 */
export const supabase: SupabaseClient = createClient(
 supabaseUrl,
 supabaseAnonKey,
 {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 }
);

/**
 * Admin Supabase client (uses service role key).
 * Use this for privileged operations like bypassing RLS.
 */
export const supabaseAdmin: SupabaseClient | null =
 supabaseServiceRoleKey
 ? createClient(supabaseUrl, supabaseServiceRoleKey, {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 })
 : null;
