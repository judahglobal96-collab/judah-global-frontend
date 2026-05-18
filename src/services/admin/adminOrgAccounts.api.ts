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

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
}

export async function fetchAdminOrgAccounts(params?: { status?: string; search?: string }) {
  const query = new URLSearchParams();
  const token = localStorage.getItem('auth_token');

  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/org-accounts?${query.toString()}`, {
    credentials: 'include',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  const data = await parseJson(res);
  console.log('ORG API RESPONSE:', data);
  return data.data as OrgAccount[];
}

export async function updateAdminOrgAccountStatus(orgId: number | string, status: string) {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(`${API_BASE}/org-accounts/${orgId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJson(res);
  console.log('ORG API RESPONSE:', data);
  return data.data as OrgAccount;
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

export async function createAdminOrgAccount(payload: CreateAdminOrgAccountPayload) {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(`${API_BASE}/org-accounts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(res);
  console.log('CREATE ORG API RESPONSE:', data);
  return data.data as OrgAccount;
}
