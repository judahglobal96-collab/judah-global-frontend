import React from 'react';
import type { PlacementType, PromoPreviewState } from './PlacementPreview';

interface PromoPreviewEmptyStateProps {
  placementType: PlacementType;
  state?: PromoPreviewState;
  className?: string;
}

const placementLabelMap: Record<PlacementType, string> = {
  homepage_hero: 'Homepage Hero',
  homepage_top_row: 'Homepage Top Row',
  discovery_top_row: 'Discovery Top Row',
  major_event: 'Major Event',
  website: 'Website Placement',
  official_flyer: "Official Flyer",
};

const stateCopy = {
  no_media: {
    title: 'Promo creative not uploaded yet',
    message:
      'This placement preview will appear after promo media is uploaded.',
    badge: 'No Media',
  },
  pending: {
    title: 'Promo creative pending approval',
    message:
      'Your uploaded promo media is under admin review. Production rendering will begin only after approval.',
    badge: 'Pending Review',
  },
  approved: {
    title: 'Promo creative ready',
    message:
      'Approved promo media is available for this placement preview.',
    badge: 'Approved',
  },
  rejected: {
    title: 'Promo creative rejected',
    message:
      'This placement requires a new promo media upload before it can preview or render in production.',
    badge: 'Rejected',
  },
} satisfies Record<
  PromoPreviewState,
  { title: string; message: string; badge: string }
>;

const PromoPreviewEmptyState: React.FC<PromoPreviewEmptyStateProps> = ({
  placementType,
  state = 'no_media',
  className = '',
}) => {
  const placementLabel = placementLabelMap[placementType] ?? 'Placement';
  const copy = stateCopy[state];

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {placementLabel} Preview
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {copy.title}
          </h3>
        </div>

        <span
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
          aria-label={`Preview status: ${copy.badge}`}
        >
          {copy.badge}
        </span>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="M21 16l-5.2-5.2a1 1 0 0 0-1.4 0L8 17" />
            </svg>
          </div>

          <p className="max-w-md text-sm font-medium text-slate-800">
            {copy.message}
          </p>

          <p className="mt-3 max-w-lg text-xs leading-6 text-slate-500">
            The preview becomes visible only after promo media is uploaded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoPreviewEmptyState;