import { useEffect, useMemo, useState } from 'react';
import type {
  AdminMediaReviewItem,
  MediaModerationStatus,
} from '../../types/adminMediaReview';
import {
  approveMediaModeration,
  fetchAdminMediaReviewQueue,
  rejectMediaModeration,
} from '../../services/adminMediaReview.api';

type FilterStatus = MediaModerationStatus | 'all';

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString();
}

function buildLocation(item: AdminMediaReviewItem): string {
  return [item.city, item.stateRegion, item.country].filter(Boolean).join(', ') || '—';
}

function StatusBadge({ status }: { status?: MediaModerationStatus }) {
  const safeStatus = status || 'pending';

  const base =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border';

  const statusClasses =
    safeStatus === 'approved'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : safeStatus === 'rejected'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <span className={`${base} ${statusClasses}`}>
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">No media items found</h3>
      <p className="mt-2 text-sm text-slate-600">
        Try changing the filter or search term.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm text-slate-600">Loading media review queue...</p>
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
    if (!isOpen) {
      setReason('');
    }
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
          placeholder="Example: Image is blurry, contains flyer text overload, or is not appropriate for event discovery."
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
  const [items, setItems] = useState<AdminMediaReviewItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AdminMediaReviewItem | null>(null);
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

      const queue = await fetchAdminMediaReviewQueue({
        status: statusFilter,
        search,
      });

      setItems(queue);

      setSelectedItem((current) => {
        if (!queue.length) return null;
        if (!current) return queue[0];

        const updatedCurrent = queue.find(
          (item) => item.moderationId === current.moderationId,
        );

        return updatedCurrent ?? queue[0];
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to load the media review queue right now.');
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

  async function handleApprove(item: AdminMediaReviewItem) {
    try {
      setIsSubmittingAction(true);
      setActionMessage('');

      await approveMediaModeration(item.moderationId);
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

    try {
      setIsSubmittingAction(true);
      setActionMessage('');

      await rejectMediaModeration(selectedItem.moderationId, reason);
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
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Admin Media Review
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review uploaded event images before they appear live across the platform.
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
                placeholder="Search event title, sponsor, venue..."
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
                const isActive = selectedItem?.moderationId === item.moderationId;

                return (
                  <button
                    key={item.moderationId}
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
                        <img
                          src={item.heroImageUrl}
                          alt={item.eventTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                              {item.eventTitle}
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                              {item.sponsorName || 'No sponsor name'}
                            </p>
                          </div>

                          <StatusBadge status={item.moderationStatus} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <div>
                            <span className="font-medium text-slate-800">Venue:</span>{' '}
                            {item.venueName || '—'}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">Location:</span>{' '}
                            {buildLocation(item)}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">Submitted:</span>{' '}
                            {formatDate(item.submittedAt)}
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">Reviewed:</span>{' '}
                            {formatDate(item.reviewedAt)}
                          </div>
                        </div>

                        {item.moderationReason ? (
                          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                            <span className="font-medium text-slate-900">Reason:</span>{' '}
                            {item.moderationReason}
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
                    <img
                      src={selectedItem.heroImageUrl}
                      alt={selectedItem.eventTitle}
                      className="h-[360px] w-full object-cover"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        {selectedItem.eventTitle}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {selectedItem.eventType || 'Event'}
                      </p>
                    </div>

                    <StatusBadge status={selectedItem.moderationStatus} />
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Sponsor:</span>{' '}
                      {selectedItem.sponsorName || '—'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Sponsor Email:</span>{' '}
                      {selectedItem.sponsorContactEmail || '—'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Venue:</span>{' '}
                      {selectedItem.venueName || '—'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Location:</span>{' '}
                      {buildLocation(selectedItem)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Submitted:</span>{' '}
                      {formatDate(selectedItem.submittedAt)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Reviewed:</span>{' '}
                      {formatDate(selectedItem.reviewedAt)}
                    </div>
                  </div>

                  {selectedItem.moderationReason ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">Moderation note:</span>{' '}
                      {selectedItem.moderationReason}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedItem)}
                      disabled={
                        isSubmittingAction ||
                        selectedItem.moderationStatus === 'approved'
                      }
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingAction ? 'Processing...' : 'Approve media'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={
                        isSubmittingAction ||
                        selectedItem.moderationStatus === 'rejected'
                      }
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
