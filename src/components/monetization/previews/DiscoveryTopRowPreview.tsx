import React from 'react';
import type { SharedPreviewCardProps } from '../PlacementPreview';

const DiscoveryPlaceholderCard: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm opacity-80">
      <div className="h-32 w-full bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-3 w-2/5 rounded bg-slate-200" />
      </div>
    </div>
  );
};

const DiscoveryTopRowPreview: React.FC<SharedPreviewCardProps> = ({
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
            Discovery Top Row Preview
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Premium placement within event discovery results
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
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-3 sm:grid-cols-3 md:w-[70%]">
              <div className="h-11 rounded-xl border border-slate-200 bg-slate-50" />
              <div className="h-11 rounded-xl border border-slate-200 bg-slate-50" />
              <div className="h-11 rounded-xl border border-slate-200 bg-slate-50" />
            </div>

            <div className="h-11 rounded-xl border border-slate-200 bg-slate-50 md:w-[180px]" />
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Promoted Results</h3>
            <p className="text-sm text-slate-600">
              Top-row visibility inside discovery
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border-2 border-purple-500 bg-white shadow-md">
          <div className="relative h-[180px] w-full overflow-hidden">              <img
                src={imageUrl}
                alt={title}
                className="h-40 w-full object-cover"
              />
              <div className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                Promoted
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

          <DiscoveryPlaceholderCard />
          <DiscoveryPlaceholderCard />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <DiscoveryPlaceholderCard />
          <DiscoveryPlaceholderCard />
          <DiscoveryPlaceholderCard />
        </div>
      </div>
    </div>
  );
};

export default DiscoveryTopRowPreview;