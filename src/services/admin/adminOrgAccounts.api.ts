export interface OrgAccount {
  id: number;
  org_uuid: string;
  organization_name: string;
  organization_type: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
  state_region: string | null;
  country: string | null;
  website_url: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  logo_source: string | null;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  verification_status: 'unverified' | 'verified';
  created_by_admin_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateAdminOrgAccountPayload = {
  organization_name: string;
  organization_type?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  website_url?: string | null;
  instagram_url?: string | null;
  status?: 'pending' | 'active' | 'suspended' | 'rejected';
  verification_status?: 'unverified' | 'verified';
  notes?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const ORG_ACCOUNTS_ENDPOINT = `${API_BASE}/admin/org-accounts`;

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminOrgAccounts(params?: {
  status?: string;
  search?: string;
}) {
  const query = new URLSearchParams();

  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);

  const queryString = query.toString();
  const url = queryString
    ? `${ORG_ACCOUNTS_ENDPOINT}?${queryString}`
    : ORG_ACCOUNTS_ENDPOINT;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  const data = await parseJson(res);
  console.log('ORG API RESPONSE:', data);

  return data.data as OrgAccount[];
}

export async function createAdminOrgAccount(
  payload: CreateAdminOrgAccountPayload
) {
  const res = await fetch(ORG_ACCOUNTS_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(res);
  console.log('CREATE ORG API RESPONSE:', data);

  return data.data as OrgAccount;
}

export async function updateAdminOrgAccountStatus(
  orgId: number | string,
  status: string
) {
  const res = await fetch(`${ORG_ACCOUNTS_ENDPOINT}/${orgId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJson(res);
  console.log('ORG STATUS API RESPONSE:', data);

  return data.data as OrgAccount;
}