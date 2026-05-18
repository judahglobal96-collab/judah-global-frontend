import type {
  AdminMediaReviewItem,
  MediaModerationStatus,
} from '../types/adminMediaReview';

const API_BASE = '${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/media-review';

export interface FetchAdminMediaReviewParams {
  status?: MediaModerationStatus | 'all';
  search?: string;
}

export async function fetchAdminMediaReviewQueue(
  params: FetchAdminMediaReviewParams = {},
): Promise<AdminMediaReviewItem[]> {
  const status =
    params.status && params.status !== 'all' ? params.status : 'pending';

  const url =
    status === 'approved'
      ? `${API_BASE}/approved`
      : status === 'rejected'
      ? `${API_BASE}/rejected`
      : `${API_BASE}/pending`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load media review queue.');
  }

  const data = await response.json();
  const rawMedia = Array.isArray(data?.media) ? data.media : [];

  return rawMedia.map((item: any) => ({
    moderationId: item.media_id,
    eventId: item.event_id,
    moderationStatus: item.moderation_status ?? 'pending',
    moderationReason: item.moderation_reason ?? '',
    heroImageUrl: item.media_url
      ? `${import.meta.env.VITE_API_BASE_URL}${item.media_url}`
      : '/images/judah-default-fallback.png',

    eventTitle: item.title ?? 'Untitled Event',
    eventType: item.event_type ?? item.event_status ?? '',
    sponsorName: item.sponsor_name ?? '',
    sponsorContactEmail: item.contact_email ?? '',

    venueName: item.venue_name ?? '',
    city: item.city ?? '',
    stateRegion: item.state_region ?? '',
    country: item.country ?? '',

    submittedAt: item.created_at ?? '',
    reviewedAt: item.updated_at ?? '',
  }));
}

export async function approveMediaModeration(
  moderationId: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/${moderationId}/approve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to approve media.');
  }
}

export async function rejectMediaModeration(
  moderationId: string,
  reason: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/${moderationId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to reject media.');
  }
}
