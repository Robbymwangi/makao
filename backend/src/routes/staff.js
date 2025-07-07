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
  const { data, error } = await supabase.from("projects").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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

// Remove agent
router.post("/agents/delete", async (req, res) => {
  const { agent_id } = req.body;
  if (!agent_id) return res.status(400).json({ error: "Agent ID required" });
  const supabase = createSupabaseClient();
  const { error } = await supabase.from("agents").delete().eq("id", agent_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Agent removed" });
});

export default router;