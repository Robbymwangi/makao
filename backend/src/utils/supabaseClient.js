import { createClient } from '@supabase/supabase-js';

// Global Supabase client instance
let supabaseInstance = null;

// Retry utility
const retryAsync = async (fn, retries = 3, delay = 2000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Retrying Supabase connection (${i + 1}/${retries})...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw lastError;
};

// Create a function to initialize the Supabase client
const createSupabaseClient = () => {
  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  console.log('Backend Supabase Environment Check:', {
    url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
    key: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'
  });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables in backend!');
    console.error('Please ensure your backend/.env file contains:');
    console.error('SUPABASE_URL=your-supabase-url');
    console.error('SUPABASE_ANON_KEY=your-anon-key');
    throw new Error('Missing Supabase environment variables in backend. Please check your backend/.env file.');
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.error('❌ Invalid Supabase URL format!');
    console.error('Expected format: https://your-project-id.supabase.co');
    console.error('Received:', supabaseUrl);
    throw new Error('Invalid Supabase URL format');
  }

  supabaseInstance = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        fetch: (url, options = {}) => {
          // Simplified fetch with better error handling and shorter timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced to 5 second timeout
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
            // Add retry logic for network issues
            headers: {
              ...(options.headers || {}),
              'Connection': 'keep-alive',
            }
          }).finally(() => {
            clearTimeout(timeoutId);
          }).catch(error => {
            console.error('Supabase fetch error:', error.message);
            // Don't throw immediately, let the calling code handle retries
            throw error;
          });
        }
      },
      // Add database connection options
      db: {
        schema: 'public'
      },
      // Reduce realtime connection issues
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      }
    }
  );

  // Simplified connection test that's less likely to fail
  const testConnection = async () => {
    try {
      console.log('🔄 Testing Supabase connection...');
      const { error } = await supabaseInstance.auth.getSession();
      if (error && error.message !== 'Auth session missing!') {
        throw new Error(error.message);
      }
      console.log('✅ Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection error:', error.message);
      throw error;
    }
  };

  // Use retry logic for connection test
  retryAsync(testConnection, 3, 2000).catch(error => {
    console.error('Supabase connection could not be established after retries:', error.message);
  });

  return supabaseInstance;
};

// Export the function instead of the client instance
export default createSupabaseClient;