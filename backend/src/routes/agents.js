import express from 'express';
import createSupabaseClient from '../utils/supabaseClient.js';

const router = express.Router();

// Assign or unassign an agent to a user
router.post('/', async (req, res) => {
  const supabase = createSupabaseClient();
  const { user_id, agent_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const { error } = await supabase
    .from('users')
    .update({ agent: agent_id || null }) // null means unassigned
    .eq('id', user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
});

// Fetch all agents
router.get('/', async (req, res) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('agents').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

export default router;