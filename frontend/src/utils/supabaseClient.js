import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from "@/store/useAuthStore";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Environment Check:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
  urlValue: supabaseUrl,
  keyValue: supabaseAnonKey ? 'Present' : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// In your logout handler (wherever you handle logout)
const handleLogout = async () => {
  await supabase.auth.signOut();
  useAuthStore.getState().logout(); // or clearAuth(), depending on your store
};

export default supabase;