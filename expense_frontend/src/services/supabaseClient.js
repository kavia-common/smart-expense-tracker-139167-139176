import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a configured Supabase client using environment variables.
   * Requires:
   * - REACT_APP_SUPABASE_URL
   * - REACT_APP_SUPABASE_KEY
   */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.error('Supabase environment variables are missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
  }

  const client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return client;
}

const supabase = getSupabaseClient();
export default supabase;
