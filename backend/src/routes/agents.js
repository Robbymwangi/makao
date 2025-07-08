import express from "express";
import { createServiceClient } from "../utils/supabaseClient.js";

const router = express.Router();

// Assign or unassign an agent to a user
router.post("/", async (req, res) => {
  const supabase = createServiceClient();
  const { user_id, agent_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  // Note: The correct column is 'agent_id',
  const { error } = await supabase
    .from("users")
    .update({ agent_id: agent_id || null }) // null means unassigned
    .eq("id", user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
});

// Fetch all agents
router.get("/", async (req, res) => {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("agents").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

// GET /agents/:agentId/clients
router.get("/:agentId/clients", async (req, res) => {
  const { agentId } = req.params;
  const supabase = createServiceClient();

  // Fetch users (clients) and their projects, including progress_status
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      address,
      projects (
        id,
        project_name,
        location,
        status,
        progress_status
      )
    `)
    .eq("agent_id", agentId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

export default router;
