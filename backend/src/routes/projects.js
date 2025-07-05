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
      client:client_id(full_name, address),
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

export default router;