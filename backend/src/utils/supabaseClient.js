import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

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

const supabase = createClient(
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
        // Add timeout and better error handling for fetch requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        }).catch(error => {
          console.error('Supabase fetch error:', error.message);
          throw error;
        });
      }
    }
  }
);

// Test the connection with a simple health check
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Simple connection test that doesn't require authentication
    const { error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      console.error('Error details:', error);
      return false;
    } else {
      console.log('✅ Supabase connection test successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    // Don't throw here, just log the error to prevent server startup failure
    return false;
  }
};

// Run connection test but don't block server startup
testConnection().catch(error => {
  console.error('Connection test failed:', error.message);
});

export default supabase;