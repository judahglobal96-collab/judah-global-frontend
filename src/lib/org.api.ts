export type OrgRecord = {
  id: string;
  org_uuid: string;
  organization_name: string;
  status: string;
  verification_status: string;
  owner_user_id: string | null;
  created_at: string | null;
  account_type: string;
};

export type OrgMeResponse = {
  success: boolean;
  organization: OrgRecord;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(response: Response) {
  const text = await response.text();

  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("API returned non-JSON response. Check API endpoint.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load organization");
  }

  return data;
}

export async function getMyOrganization(): Promise<OrgMeResponse> {
  const response = await fetch(`${API_BASE}/api/v1/org/me`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return parseJson(response);
}

export async function getOrganizationByUuid(
  orgUuid: string
): Promise<OrgMeResponse> {
  const response = await fetch(`${API_BASE}/api/v1/org/${orgUuid}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return parseJson(response);
}

export async function createOrgEventDraft(orgUuid: string, payload: any) {
  const response = await fetch(`${API_BASE}/api/v1/event-submissions/draft`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      ...payload,
      org_uuid: orgUuid,
    }),
  });

  return parseJson(response);
}

export async function uploadSponsorLogo(eventId: string, file: File) {
  const formData = new FormData();
  formData.append("media", file);
  formData.append("upload_type", "sponsor_logo");
  formData.append("event_id", eventId);

  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE}/api/events/${eventId}/media`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: formData,
  });

  return parseJson(response);
}