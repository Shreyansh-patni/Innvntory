import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'TBD' || supabaseAnonKey === 'TBD') {
    // Return typed placeholder client for preview/build phase before real credentials
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
