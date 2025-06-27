// routes/users.js
import express from 'express';
import createSupabaseClient from '../utils/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const supabase = createSupabaseClient();

  // Step 1: Fetch all users
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers();

  if (userErr) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  // Step 2: Fetch all admin emails
  const { data: admins, error: adminErr } = await supabase
    .from('admins')
    .select('email');

  if (adminErr) {
    return res.status(500).json({ error: 'Failed to fetch admin list' });
  }

  const adminEmails = admins.map((admin) => admin.email);

  // Step 3: Filter out admins
  const nonAdmins = users.users.filter(
    (u) => !adminEmails.includes(u.email)
  );

  // Step 4: Return filtered users
  const formatted = nonAdmins.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.full_name || 'N/A',
    last_sign_in_at: u.last_sign_in_at,
  }));

  res.json(formatted);
});

export default router;
// Export the router to be used in the main app