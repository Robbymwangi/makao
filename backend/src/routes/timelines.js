import express from "express";
import { createServiceClient } from "../utils/supabaseClient.js";

const router = express.Router();

// Get all timelines for a project
router.get("/project/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("project_timelines") 
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new timeline
router.post("/", async (req, res) => {
  const { project_id, agent_id, title, date, contractor, description, estimated_cost } = req.body; // add estimated_cost
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("project_timelines")
    .insert([{
      project_id,
      agent_id,
      title,
      date,
      contractor,
      description,
      estimated_cost, 
      status: "pending"
    }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Mark timeline as complete (update actual_expenditure and completed_at)
router.patch("/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { actual_expenditure, completed_at } = req.body;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("project_timelines")
    .update({
      status: "completed",
      actual_expenditure,
      completed_at
    })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;