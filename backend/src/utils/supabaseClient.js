import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

/**
 * Retry helper for async tasks (e.g., connection testing)
 */
const retryAsync = async (fn, retries = 3, delay = 2000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Retry attempt ${i + 1}/${retries} failed:`, err.message);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw lastError;
};

/**
 * Initializes and returns a singleton Supabase client
 */
const createSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('SupabaseClient.js check:', {
  url: SUPABASE_URL ? 'Set' : 'Missing',
  key: SERVICE_ROLE_KEY ? 'Set' : 'Missing',
  shortKey: SERVICE_ROLE_KEY?.slice(0, 5) + '...'  // just to verify what’s loading
});
  // Validate environment variables
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Missing Supabase environment variables in backend!");
    console.error("Expected in .env:\nSUPABASE_URL\nSUPABASE_SERVICE_ROLE_KEY");
    throw new Error("Missing Supabase backend credentials");
  }

  if (!/^https:\/\/.+\.supabase\.co$/.test(SUPABASE_URL)) {
    console.error("Invalid Supabase URL format:", SUPABASE_URL);
    throw new Error("Invalid Supabase URL format");
  }

  // Initialize Supabase client with admin key
  supabaseInstance = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        return fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            ...(options.headers || {}),
            Connection: 'keep-alive',
          },
        })
          .finally(() => clearTimeout(timeoutId))
          .catch(err => {
            console.error("Supabase fetch error:", err.message);
            throw err;
          });
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  });

  // Optional: test connection on startup
retryAsync(async () => {
  const { error } = await supabaseInstance.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) {
    throw new Error("Failed to verify Supabase admin client: " + error.message);
  }
  console.log("Supabase admin client initialized");
}).catch(err => {
  console.error("Supabase connection failed after retries:", err.message);
});

  return supabaseInstance;
};

export default createSupabaseClient;

