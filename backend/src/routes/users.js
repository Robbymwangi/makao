// routes/users.js
import express from 'express';
import createSupabaseClient from '../utils/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const supabase = createSupabaseClient();

  // Get users from `users` table
const { data: users, error: userErr } = await supabase
  .from('users')
  .select('id, email, full_name, last_sign_in_at');

 if (userErr) {
  console.error("Supabase error:", userErr.message || userErr);
  return res.status(500).json({ error: userErr.message || 'Failed to fetch users' });
}

  // Format and Return users
  const formatted = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.full_name || 'N/A',
    last_sign_in_at: u.last_sign_in_at || 'N/A',
  }));
  res.json(formatted);
});


// Export the router to be used in the main app
export default router;