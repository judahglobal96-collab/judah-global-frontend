export type MediaModerationStatus = 'pending' | 'approved' | 'rejected';

export interface AdminMediaReviewItem {
  moderationId: string;
  eventId: string;
  eventTitle: string;
  eventType?: string | null;
  sponsorName?: string | null;
  sponsorContactEmail?: string | null;
  venueName?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  country?: string | null;
  heroImageUrl: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  moderationStatus: MediaModerationStatus;
  moderationReason?: string | null;
}
