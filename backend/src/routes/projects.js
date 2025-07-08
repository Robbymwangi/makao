import express from "express";
import { createServiceClient } from "../utils/supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      project_name,
      status,
      submitted_at,
      location,
      estimated_budget,
      estimated_timeline,
      client:client_id(full_name, address), -- JOIN users table!
      project_documents (
        id,
        name,
        source,
        date,
        url
      )
    `)
    .order("submitted_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Update project progress_status
router.patch("/:id/progress-status", async (req, res) => {
  const { id } = req.params;
  const { progress_status } = req.body;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ progress_status })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// When updating status, also update progress_status if needed
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const supabase = createServiceClient();
  let updateObj = { status };
  if (status === "approved") updateObj.progress_status = "in_progress";
  const { data, error } = await supabase
    .from("projects")
    .update(updateObj)
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;