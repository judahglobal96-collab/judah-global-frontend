const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/campaign-media`;

export type CampaignMediaStatus = 'pending' | 'approved' | 'rejected';

export type CampaignMediaItem = {
  id: string;
  campaign_id?: string | null;
  media_url: string;
  media_type?: 'image' | 'video' | string | null;
  status?: CampaignMediaStatus | string | null;
  placement_type?: string | null;
  sponsor_name?: string | null;
  campaign_title?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
};

export interface FetchCampaignMediaQueueParams {
  status?: CampaignMediaStatus | 'all';
  search?: string;
}

function buildMediaUrl(value?: string | null): string {
  if (!value) return '/images/judah-default-fallback.png';

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${import.meta.env.VITE_API_BASE_URL}${value}`;
}

function normalizeCampaignMediaItem(item: any): CampaignMediaItem {
  return {
    id: item.id ?? item.media_id ?? item.campaign_media_id,
    campaign_id: item.campaign_id ?? null,
    media_url: buildMediaUrl(item.media_url ?? item.url),
    media_type: item.media_type ?? item.type ?? 'image',
    status: item.status ?? item.moderation_status ?? 'pending',
    placement_type: item.placement_type ?? item.placement_name ?? null,
    sponsor_name: item.sponsor_name ?? item.organization_name ?? null,
    campaign_title: item.campaign_title ?? item.title ?? 'Campaign media',
    submitted_at: item.submitted_at ?? item.created_at ?? null,
    reviewed_at: item.reviewed_at ?? item.updated_at ?? null,
    rejection_reason: item.rejection_reason ?? item.moderation_reason ?? null,
  };
}

export async function fetchCampaignMediaQueue(
  params: FetchCampaignMediaQueueParams = {},
): Promise<CampaignMediaItem[]> {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status);
  }

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();

  const response = await fetch(`${API_BASE}/pending${query ? `?${query}` : ''}`);

  if (!response.ok) {
    throw new Error('Failed to load campaign media review queue.');
  }

  const data = await response.json();

  const rawMedia = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.media)
      ? data.media
      : Array.isArray(data)
        ? data
        : [];

  return rawMedia.map(normalizeCampaignMediaItem);
}

export async function approveCampaignMedia(mediaId: string): Promise<void> {
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      replacementMediaId: mediaId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to approve campaign media.");
  }
}
export async function rejectCampaignMedia(
  mediaId: string,
  reason: string,
): Promise<void> {
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      replacementMediaId: mediaId,
      rejectionReason: reason,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to reject campaign media.");
  }
}