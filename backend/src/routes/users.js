// routes/users.js
import express from 'express';
import { createServiceClient } from '../utils/supabaseClient.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const supabase = createServiceClient();

    const { data: users, error: userErr } = await supabase
      .from("users")
      .select("id, full_name, email, last_sign_in_at, agent_id"); // Select agent_id directly

    if (userErr) {
      console.error("Supabase error fetching users:", userErr.message);
      return res.status(500).json({ error: userErr.message });
    }

    // Now fetch agent names using a join
    const { data: usersWithAgentName, error: agentNameErr } = await supabase
      .from("users")
      .select("id, full_name, email, last_sign_in_at, agent:agent_id(name)");

    if (agentNameErr) {
      console.error("Supabase error fetching users with agent names:", agentNameErr.message);
      return res.status(500).json({ error: agentNameErr.message });
    }

    const formatted = usersWithAgentName.map((u) => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      last_sign_in_at: u.last_sign_in_at,
      agent: u.agent?.name || null, // Use agent.name from the join
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Unhandled error in GET /users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Assign an agent to a user
router.post('/assign-agent', async (req, res) => {
  const { user_id, agent_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const supabase = createServiceClient();

    // Update the user's agent_id
    const { data, error } = await supabase
      .from('users')
      .update({ agent_id: agent_id || null })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Also update all projects for this user
    await supabase
      .from('projects')
      .update({ agent_id: agent_id || null })
      .eq('client_id', user_id);

    res.json({ success: true, message: "Agent assignment updated for user and projects", user: data });
  } catch (err) {
    console.error("Unhandled error in /assign-agent:", err.message);
    res.status(500).json({ error: "Failed to assign agent" });
  }
});

// Create a new user (using Supabase Auth Admin API)
router.post('/', async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "Full name, email, and password are required" });
  }

  try {
    const supabase = createServiceClient();

    // Create user in Supabase Auth
    // This handles password hashing, email verification, etc.
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name }, // Store full_name in user_metadata
      email_confirm: true, // Optional: set to false if you don't want email confirmation by default
    });

    if (authError) {
      console.error("Supabase Auth error creating user:", authError.message);
      // Handle specific Supabase auth errors (e.g., duplicate email)
      if (authError.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
        return res.status(409).json({ error: "A user with this email already exists." });
      }
      return res.status(500).json({ error: authError.message });
    }

    // insert into your 'users' profile table for additional profile info
    //    Link this record to the Supabase Auth user via the 'id'
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the ID from the Supabase Auth user
          full_name,
          email,
          // last_sign_in_at will be managed by Supabase Auth
          // agent_id will be null initially
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Supabase Profile Table error creating user:", profileError.message);
      return res.status(500).json({ error: profileError.message });
    }

    // Respond with the created user's data
    res.status(201).json({
      id: authData.user.id,
      full_name: full_name, // Use the full_name from request body
      email: email,       // Use the email from request body
      last_sign_in_at: authData.user.last_sign_in_at || null, // Get from authData
      agent: "", // New users are unassigned by default
    });
  } catch (err) {
    console.error("Unhandled error in POST /users:", err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const supabase = createServiceClient();
    // Send a password reset email
   const { data, error } = await supabase.auth.admin.resetPasswordForEmail(email, {
  redirectTo: "http://localhost:5173/forgot-password", 
});
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// GET /users/:userId/projects
router.get("/:userId/projects", async (req, res) => {
  const { userId } = req.params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      project_name,
      status,
      location,
      estimated_budget,
      project_documents (
        id,
        name,
        source,
        date,
        url,
        status
      )
    `)
    .eq("client_id", userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;