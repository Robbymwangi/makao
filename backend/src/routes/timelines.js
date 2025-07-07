import express from "express";
import { createServiceClient } from "../utils/supabaseClient.js";

const router = express.Router();

// Get all timelines for a project
router.get("/project/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("timelines")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new timeline
router.post("/", async (req, res) => {
  const { project_id, agent_id, title, date, contractor, description } = req.body;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("timelines")
    .insert([{ project_id, agent_id, title, date, contractor, description }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;