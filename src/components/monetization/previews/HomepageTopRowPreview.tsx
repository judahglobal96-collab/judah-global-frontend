import React from 'react';
import type { SharedPreviewCardProps } from '../PlacementPreview';

const PlaceholderCard: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm opacity-70">
      <div className="h-36 w-full bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-200" />
      </div>
    </div>
  );
};

const HomepageTopRowPreview: React.FC<SharedPreviewCardProps> = ({
  imageUrl,
  title,
  sponsorName,
  dateLabel,
  locationLabel,
  state = 'approved',
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Homepage Top Row Preview
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Featured row near the top of the homepage
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            state === 'approved'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
              : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
          }`}
        >
          {state === 'approved' ? 'Approved Media' : 'Preview Only'}
        </span>
      </div>

      <div className="bg-slate-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Featured Events</h3>
            <p className="text-sm text-slate-600">Top row promotional placement</p>
          </div>

          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            Browse Events
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border-2 border-indigo-500 bg-white shadow-md">
          <div className="relative h-[180px] w-full overflow-hidden">              <img
                src={imageUrl}
                alt={title}
                className="h-44 w-full object-cover"
              />
              <div className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                Your Placement
              </div>
            </div>

            <div className="space-y-3 p-4">
              <h4 className="line-clamp-2 text-base font-semibold text-slate-900">
                {title}
              </h4>

              <div className="space-y-1 text-sm text-slate-600">
                {dateLabel ? <p>{dateLabel}</p> : null}
                {locationLabel ? <p>{locationLabel}</p> : null}
              </div>

              {sponsorName ? (
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Sponsored by {sponsorName}
                </p>
              ) : null}
            </div>
          </div>

          <PlaceholderCard />
          <PlaceholderCard />
        </div>
      </div>
    </div>
  );
};

export default HomepageTopRowPreview;