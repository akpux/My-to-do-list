import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  // Return existing instance if it exists
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  // Create new instance only if it doesn't exist
  supabaseInstance = createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );
  
  return supabaseInstance;
}
