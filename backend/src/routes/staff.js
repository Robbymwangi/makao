import express from "express";
const router = express.Router();
import createSupabaseClient from "../utils/supabaseClient.js";

// Get all admins
router.get("/admins", async (req, res) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("admins").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get all agents
router.get("/agents", async (req, res) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("agents").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get all projects
router.get("/projects", async (req, res) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      project_name,
      client_id,
      agent_id,
      progress_pictures,
      created_at,
      agents (
        full_name
      )
    `);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Assign projects to agent (max 3)
router.post("/agents/assign-projects", async (req, res) => {
  const { agent_id, project_ids } = req.body;
  if (!agent_id || !Array.isArray(project_ids) || project_ids.length > 3) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("agents")
    .update({ projects: project_ids })
    .eq("id", agent_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Projects assigned" });
});

// Remove admin
router.post("/admins/delete", async (req, res) => {
  const { admin_id } = req.body;
  if (!admin_id) return res.status(400).json({ error: "Admin ID required" });
  const supabase = createSupabaseClient();
  const { error } = await supabase.from("admins").delete().eq("id", admin_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Admin removed" });
});

export default router;