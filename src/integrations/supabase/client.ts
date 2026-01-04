'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

function createSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase URL and API key are required. Check your environment variables.'
    );
  }

  return createBrowserClient<Database>(url, key);
}

// Lazy singleton - only created when first accessed at runtime
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}
