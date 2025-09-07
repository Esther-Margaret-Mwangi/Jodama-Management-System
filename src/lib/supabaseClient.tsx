import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!supabaseUrl) {
  throw new Error("Missing REACT_APP_SUPABASE_URL in your environment.");
}

if (!supabaseAnonKey) {
  throw new Error("Missing REACT_APP_SUPABASE_ANON_KEY in your environment.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "jodama-auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "jodama-web",
    },
  },
});

export default supabase;
