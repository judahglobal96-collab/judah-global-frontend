import { useEffect, useMemo, useState } from 'react';
import type { CampaignMediaItem } from '../../services/adminMediaReview.api';
import {
  approveCampaignMedia,
  fetchCampaignMediaQueue,
  rejectCampaignMedia,
} from '../../services/adminMediaReview.api';

type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

type FlexibleCampaignMediaItem = CampaignMediaItem & {
  media_url?: string | null;
  media_id?: string | null;
  campaign_media_id?: string | null;
  image_url?: string | null;
  file_url?: string | null;
  asset_url?: string | null;
  public_url?: string | null;
  campaign_media_url?: string | null;
  storage_url?: string | null;
  url?: string | null;
  event_image_url?: string | null;
  flyer_url?: string | null;
  event_media_url?: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString();
}

function toAbsoluteMediaUrl(url?: string | null): string {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${normalized}`;
}
function getCampaignMediaUrl(item?: FlexibleCampaignMediaItem | null): string {
  if (!item) return '';

  const isMajorEventPlacement =
    item.placement_type === 'major_events' ||
    item.placement_type === 'major_event' ||
    item.placement_type === 'major-events';

  if (isMajorEventPlacement) {
    return toAbsoluteMediaUrl(
      item.campaign_media_url ||
        item.media_url ||
        item.file_url ||
        item.asset_url ||
        item.public_url ||
        item.storage_url ||
        item.url ||
        ''
    );
  }

  return toAbsoluteMediaUrl(
    item.media_url ||
      item.campaign_media_url ||
      item.image_url ||
      item.file_url ||
      item.asset_url ||
      item.public_url ||
      item.storage_url ||
      item.url ||
      ''
  );
}

function getSafeMediaKind(item?: FlexibleCampaignMediaItem | null): 'image' | 'video' {
  const rawType = String(item?.media_type || '').toLowerCase();
  const url = getCampaignMediaUrl(item).toLowerCase();

  if (
    rawType.includes('video') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.mov') ||
    url.endsWith('.m4v')
  ) {
    return 'video';
  }

  return 'image';
}

function getReviewMediaId(item: FlexibleCampaignMediaItem | null): string {
  return item?.campaign_media_id || item?.media_id || item?.id || '';
}

function StatusBadge({ status }: { status?: string | null }) {
  const safeStatus = status || 'pending';

  const statusClasses =
    safeStatus === 'approved'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : safeStatus === 'rejected'
        ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}
    >
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function MediaPreview({
  item,
  className,
  alt,
}: {
  item: FlexibleCampaignMediaItem;
  className: string;
  alt: string;
}) {
  const mediaUrl = getCampaignMediaUrl(item);
  const mediaKind = getSafeMediaKind(item);

  if (!mediaUrl) {
    return (
      <div className="flex h-full min-h-[180px] w-full items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-500">
        No campaign media URL returned.
      </div>
    );
  }

  if (mediaKind === 'video') {
    return <video src={mediaUrl} controls className={className} />;
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      className={className}
      onLoad={() => console.log('CAMPAIGN MEDIA IMAGE LOADED:', mediaUrl)}
      onError={() => console.error('CAMPAIGN MEDIA IMAGE FAILED:', mediaUrl, item)}
    />
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm text-slate-600">
        Loading campaign media review queue...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        No campaign media items found
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Try changing the filter or search term.
      </p>
    </div>
  );
}

function RejectModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">Reject media</h2>

        <p className="mt-2 text-sm text-slate-600">
          Add a short reason so the moderation decision is documented clearly.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          placeholder="Example: Image is blurry, inappropriate, or not approved for campaign promotion."
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        />

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSubmit(reason.trim())}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? 'Rejecting...' : 'Reject media'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMediaReviewPage() {
  const [items, setItems] = useState<FlexibleCampaignMediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FlexibleCampaignMediaItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  async function loadQueue() {
    try {
      setLoading(true);
      setErrorMessage('');

      const queue = (await fetchCampaignMediaQueue({
        status: statusFilter,
        search,
      })) as FlexibleCampaignMediaItem[];

      console.log('ADMIN MEDIA REVIEW RAW QUEUE:', queue);
      console.log(
        'ADMIN MEDIA REVIEW MEDIA FIELDS:',
        queue.map((item) => ({
          id: item.id,
          media_id: item.media_id,
          campaign_id: item.campaign_id,
          placement_type: item.placement_type,
          media_type: item.media_type,
          campaign_media_url: item.campaign_media_url,
          media_url: item.media_url,
          file_url: item.file_url,
          asset_url: item.asset_url,
          public_url: item.public_url,
          storage_url: item.storage_url,
          url: item.url,
          image_url: item.image_url,
          event_image_url: item.event_image_url,
          flyer_url: item.flyer_url,
          event_media_url: item.event_media_url,
          resolved_campaign_url: getCampaignMediaUrl(item),
          review_id_being_sent: getReviewMediaId(item),
        }))
      );

    const reviewItems = queue.filter((item) =>
      ['campaign_media', 'image', 'flyer', 'sponsor_logo'].includes(
        String(item.media_type || '').toLowerCase()
      )
    );

    const queueWithMedia = reviewItems.filter((item) =>
      Boolean(getCampaignMediaUrl(item))
    );
      setItems(queueWithMedia);

      setSelectedItem((current) => {
        if (!queueWithMedia.length) return null;
        if (!current) return queueWithMedia[0];

        const updatedCurrent = queueWithMedia.find((item) => item.id === current.id);
        return updatedCurrent ?? queueWithMedia[0];
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to load the campaign media review queue right now.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredCountLabel = useMemo(() => {
    return `${items.length} item${items.length === 1 ? '' : 's'}`;
  }, [items.length]);

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadQueue();
  }

  async function handleApprove(item: FlexibleCampaignMediaItem) {
    const mediaId = getReviewMediaId(item);

    if (!mediaId) {
      setActionMessage('Unable to approve media: missing media ID.');
      return;
    }

    try {
      setIsSubmittingAction(true);
      setActionMessage('');

      await approveCampaignMedia(mediaId);

      setActionMessage('Media approved successfully.');
      await loadQueue();
    } catch (error) {
      console.error(error);
      setActionMessage('Unable to approve media right now.');
    } finally {
      setIsSubmittingAction(false);
    }
  }

  async function handleReject(reason: string) {
    if (!selectedItem) return;

    const mediaId = getReviewMediaId(selectedItem);

    if (!mediaId) {
      setActionMessage('Unable to reject media: missing media ID.');
      return;
    }

    try {
      setIsSubmittingAction(true);
      setActionMessage('');

      await rejectCampaignMedia(mediaId, reason);

      setIsRejectModalOpen(false);
      setActionMessage('Media rejected successfully.');
      await loadQueue();
    } catch (error) {
      console.error(error);
      setActionMessage('Unable to reject media right now.');
    } finally {
      setIsSubmittingAction(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Admin Media Review
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review uploaded campaign media before paid promotional placements appear live.
              </p>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaign, sponsor, placement..."
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>{filteredCountLabel}</span>

            {actionMessage ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {actionMessage}
              </span>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : !items.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              {items.map((item) => {
                const isActive = selectedItem?.id === item.id;
                const mediaUrl = getCampaignMediaUrl(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:shadow-md ${
                      isActive
                        ? 'border-slate-900 ring-2 ring-slate-900/10'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                      <div className="h-56 bg-slate-100 md:h-full">
                        <MediaPreview
                          item={item}
                          alt={item.campaign_title || 'Campaign media pending review'}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                              {item.campaign_title || 'Campaign media'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                              {item.sponsor_name || 'No sponsor name'}
                            </p>
                          </div>

                          <StatusBadge status={item.status} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <div>
                            <span className="font-medium text-slate-800">Placement:</span>{' '}
                            {item.placement_type || '—'}
                          </div>

                          <div>
                            <span className="font-medium text-slate-800">Media Type:</span>{' '}
                            {item.media_type || 'campaign_media'}
                          </div>

                          <div>
                            <span className="font-medium text-slate-800">Submitted:</span>{' '}
                            {formatDate(item.submitted_at)}
                          </div>

                          <div>
                            <span className="font-medium text-slate-800">Reviewed:</span>{' '}
                            {formatDate(item.reviewed_at)}
                          </div>
                        </div>

                        <div className="mt-4 break-all rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Resolved campaign media URL:
                          </span>{' '}
                          {mediaUrl || 'No campaign media URL returned by API'}
                        </div>

                        {item.rejection_reason ? (
                          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                            <span className="font-medium text-slate-900">Reason:</span>{' '}
                            {item.rejection_reason}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="sticky top-6 h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {selectedItem ? (
                <>
                  <div className="overflow-hidden rounded-2xl bg-slate-100">
                    <MediaPreview
                      item={selectedItem}
                      alt={selectedItem.campaign_title || 'Selected campaign media'}
                      className="h-[360px] w-full object-contain"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        {selectedItem.campaign_title || 'Campaign media'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {selectedItem.placement_type || 'Campaign placement'}
                      </p>
                    </div>

                    <StatusBadge status={selectedItem.status} />
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Sponsor:</span>{' '}
                      {selectedItem.sponsor_name || '—'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Campaign ID:</span>{' '}
                      {selectedItem.campaign_id || '—'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Placement:</span>{' '}
                      {selectedItem.placement_type || '—'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Media Type:</span>{' '}
                      {selectedItem.media_type || 'campaign_media'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Submitted:</span>{' '}
                      {formatDate(selectedItem.submitted_at)}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Reviewed:</span>{' '}
                      {formatDate(selectedItem.reviewed_at)}
                    </div>

                    <div className="break-all">
                      <span className="font-semibold text-slate-900">
                        Resolved Campaign Media URL:
                      </span>{' '}
                      {getCampaignMediaUrl(selectedItem) ||
                        'No campaign media URL returned by API'}
                    </div>
                  </div>

                  {selectedItem.rejection_reason ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        Moderation note:
                      </span>{' '}
                      {selectedItem.rejection_reason}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedItem)}
                      disabled={isSubmittingAction || selectedItem.status === 'approved'}
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingAction ? 'Processing...' : 'Approve media'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={isSubmittingAction || selectedItem.status === 'rejected'}
                      className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reject media
                    </button>

                    <button
                      type="button"
                      onClick={() => void loadQueue()}
                      disabled={isSubmittingAction}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  Select a media item to review.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleReject}
        isSubmitting={isSubmittingAction}
      />
    </div>
  );
}