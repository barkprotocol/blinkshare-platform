import { createClient } from '@supabase/supabase-js';

// Set up the Supabase client using the environment variables
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
