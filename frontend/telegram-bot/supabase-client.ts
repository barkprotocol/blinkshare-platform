import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with BlinkShare URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
