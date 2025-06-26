import { createClient } from '@supabase/supabase-js';

// Supabase Admin client setup
const SUPABASE_URL = 'https://plkrxatjphebkphmhvze.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Create staff user and insert into `admins` table
export async function createStaffUser({ email, fullName, role }) {
  const staffRoles = ['systemAdmin', 'consultantAdmin', 'agentAdmin'];
  if (!staffRoles.includes(role)) {
    throw new Error('Invalid staff role');
  }

  // 1. Create the user in auth.users
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true, // Mark email as verified immediately
    password,
    user_metadata: {
      full_name: fullName,
      role,
    },
  });

  if (createError) {
    console.error("Error creating staff user:", createError.message);
    throw createError;
  }

  const userId = userData.user.id;

  // 2. Insert into the custom `admins` table
  const { error: insertError } = await supabaseAdmin.from('admins').insert({
    id: userId,
    email,
    full_name: fullName,
    role,
  });

  if (insertError) {
    console.error("Error inserting into admins table:", insertError.message);
    throw insertError;
  }

  return userData.user;

}
