// backend/utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';



// For user-facing auth (sign in, sign up, etc.)
export const createAnonClient = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error('Missing Supabase anon credentials');
  }
  return createClient(SUPABASE_URL, ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: { schema: 'public' },
    realtime: { params: { eventsPerSecond: 2 } },
  });
};

// For privileged backend operations (admin, RLS bypass)
export const createServiceClient = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase service role credentials');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    global: {
      headers: {
        apiKey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: { schema: 'public' },
    realtime: { params: { eventsPerSecond: 2 } },
  });
};
