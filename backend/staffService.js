
import { createClient } from '@supabase/supabase-js';

// Supabase Admin client setup
const SUPABASE_URL = 'https://plkrxatjphebkphmhvze.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsa3J4YXRqcGhlYmtwaG1odnplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMTg5MSwiZXhwIjoyMDY1NTc3ODkxfQ.ExBn9PAJQ7rti82QrzovJ8xWO3EmH_B-eQ7XeUGKeIM'; // Found in Supabase > Project > Settings > API

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Create a staff user (systemAdmin, consultantAdmin, agentAdmin)
 * who will log in using OTP, no password.
 */
export async function createStaffUser({ email, fullName, role }) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true, // Mark email as verified immediately
    user_metadata: {
      full_name: fullName,
      role: role, // systemAdmin | consultantAdmin | agentAdmin
    },
  });

  if (error) {
    console.error("Error creating staff user:", error.message);
    throw error;
  }

  return data.user;
}
