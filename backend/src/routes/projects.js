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

export default router;