import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://plkrxatjphebkphmhvze.supabase.co';
// const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsa3J4YXRqcGhlYmtwaG1odnplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMTg5MSwiZXhwIjoyMDY1NTc3ODkxfQ.ExBn9PAJQ7rti82QrzovJ8xWO3EmH_B-eQ7XeUGKeIM'; 

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);