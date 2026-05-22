const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function uploadFile(
  file: File,
  uploadType: "sponsor_logo" | "event_media",
  eventId: string
) {
  const formData = new FormData();
  formData.append("media", file);
  formData.append("upload_type", uploadType);
  formData.append("event_id", eventId);

  const response = await fetch(
  `${API_BASE}/api/events/${eventId}/media`,
  {
    method: "POST",
    body: formData,
  }
);

  const rawText = await response.text();

  let data: any = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || rawText || "Upload failed");
  }

  console.log("UPLOAD RESPONSE", data);

  return data.url as string;
}
