// routes/users.js
import express from 'express';
import createSupabaseClient from '../utils/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const supabase = createSupabaseClient();

    // Adjust the select fields to match your table schema
    const { data: users, error: userErr } = await supabase
      .from("users")
      .select("id, full_name, email, last_sign_in_at, agent:agent_id(name)");

    if (userErr) {
      console.error("Supabase error:", userErr.message);
      return res.status(500).json({ error: userErr.message });
    }

    const formatted = users.map((u) => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      last_sign_in_at: u.last_sign_in_at,
      agent: u.agent?.name || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Assign an agent to a user
router.post('/assign-agent', async (req, res) => {
  const { user_id, agent_id } = req.body;

  if (!user_id || !agent_id) {
    return res.status(400).json({ error: "user_id and agent_id are required" });
  }

  try {
    const supabase = createSupabaseClient();

    // Update the user's agent_id
    const { data, error } = await supabase
      .from('users')
      .update({ agent_id })
      .eq('id', user_id)
      .single();

    if (error) {
      console.error("Error assigning agent:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: "Agent assigned successfully", user: data });
  } catch (err) {
    console.error("Unhandled error in /assign-agent:", err.message);
    res.status(500).json({ error: "Failed to assign agent" });
  }
});


export default router;