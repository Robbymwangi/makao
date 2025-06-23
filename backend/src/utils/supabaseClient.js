import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend root directory
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
    }
  }
);

// Test the connection
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error.message);
  });

export default supabase;