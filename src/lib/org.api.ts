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

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function parseJson(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load organization");
  }

  return data;
}

export async function getMyOrganization(): Promise<OrgMeResponse> {
  const response = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/v1/org/me", {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return parseJson(response);
}

export async function getOrganizationByUuid(orgUuid: string): Promise<OrgMeResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/org/${orgUuid}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return parseJson(response);
}
// ================================
// EVENT SUBMISSION (ORG PORTAL)
// ================================

export async function createOrgEventDraft(orgUuid: string, payload: any) {
  const response = await fetch(
    "${import.meta.env.VITE_API_BASE_URL}/api/v1/event-submissions/draft",
    {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        org_uuid: orgUuid,
      }),
    }
  );

  return parseJson(response);
}
// ================================
// EVENT MEDIA (ORG PORTAL)
// ================================

export async function uploadSponsorLogo(eventId: string, file: File) {
  const formData = new FormData();
  formData.append("media", file);
  formData.append("upload_type", "sponsor_logo");
  formData.append("event_id", eventId);

  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/events/${eventId}/media`,
    {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to upload sponsor logo.");
  }

  return data;
}
