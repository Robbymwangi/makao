// scripts/seedAdmins.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load env vars from .env

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Hardcoded admins — UPDATE THESE:
const admins = [
  {
    email: 'sysadmin@example.com',
    password: 'Admin123!', // change to something strong
    full_name: 'Admin John',
    role: 'systemAdmin',
  },
  {
    email: 'consultant@example.com',
    password: 'Consult123!',
    full_name: 'Consultant Mary',
    role: 'consultantAdmin',
  },
  {
    email: 'agent@example.com',
    password: 'Agent123!',
    full_name: 'Agent Paul',
    role: 'agentAdmin',
  },
];

async function seedAdmins() {
  for (const admin of admins) {
    console.log(`Creating admin: ${admin.email}`);

    // 1. Create in auth.users
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
      user_metadata: {
        full_name: admin.full_name,
        role: admin.role,
      },
    });

    if (authErr) {
      console.error(`❌ Failed to create auth user: ${authErr.message}`);
      continue;
    }

    const userId = authData.user.id;

    // 2. Insert into `admins` table
    const { error: insertErr } = await supabase.from('admins').insert({
      id: userId,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
    });

    if (insertErr) {
      console.error(`❌ Failed to insert into admins table: ${insertErr.message}`);
    } else {
      console.log(`✅ Successfully created: ${admin.email}`);
    }
  }
}

seedAdmins()
  .then(() => console.log('✅ All admins processed.'))
  .catch((err) => console.error('Unexpected error:', err));
