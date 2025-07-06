import supabase from "@/utils/supabaseClient";

const SUPABASE_EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/project-approval";

// Upload a single file to Supabase Storage and return metadata
export async function uploadDocument(file, userId) {
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("project-documents")
    .upload(filePath, file);

  if (error) throw error;

  const { publicUrl } = supabase.storage
    .from("project-documents")
    .getPublicUrl(filePath);

  return {
    name: file.name,
    url: publicUrl,
    uploaded_at: new Date().toISOString(),
    type: file.type,
    size: file.size,
  };
}

// Upload multiple files to Supabase Storage and return their metadata
export async function uploadDocuments(files, userId) {
  if (!files || files.length === 0) {
    return [];
  }
  console.log("Starting file uploads for user:", userId);
  console.log("Number of files to upload:", files.length);

  const uploaded = [];
  for (const file of files) {
    try {
      console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);
      const timestamp = Date.now();
      const filePath = `${userId}/${timestamp}_${file.name}`;
      console.log("Upload path:", filePath);

      const { data, error } = await supabase.storage
        .from("project-approval-pictures")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      console.log("Upload successful:", data);

      const { data: urlData } = supabase.storage
        .from("project-approval-pictures")
        .getPublicUrl(filePath);
      console.log("Public URL:", urlData.publicUrl);

      uploaded.push({
        name: file.name,
        url: urlData.publicUrl,
        type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error uploading file:", file.name, err);
      throw err;
    }
  }
  console.log("All files uploaded successfully:", uploaded);
  return uploaded;
}

export async function getProjectStatus(jwt) {
  const res = await fetch(`${SUPABASE_EDGE_URL}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch project status: ${errorBody.error || res.statusText}`);
  }
  return res.json();
}

// Accepts: jwt, projectData (including documents array)
export async function submitProjectApproval(jwt, projectData) {
  const res = await fetch(`${SUPABASE_EDGE_URL}/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(`Failed to submit project: ${errorBody.error || res.statusText}`);
  }
  return res.json();
}
