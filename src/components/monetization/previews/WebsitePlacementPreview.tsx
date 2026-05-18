import React from 'react';
import type { SharedPreviewCardProps } from '../PlacementPreview';

const WebsitePlacementPreview: React.FC<SharedPreviewCardProps> = ({
  imageUrl,
  title,
  sponsorName,
  description,
  dateLabel,
  locationLabel,
  state = 'approved',
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Website Placement Preview
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Flexible promotional render for future website inventory
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Website Promotion Module
                </h3>
                <p className="text-sm text-slate-600">
                  Example render for future website placement inventory
                </p>
              </div>

              <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                Website
              </span>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="min-h-[280px]">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-6">
              <h4 className="text-2xl font-semibold leading-tight text-slate-900">
                {title}
              </h4>

              {description ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              ) : null}

              <div className="mt-5 space-y-2 text-sm text-slate-700">
                {dateLabel ? <p>{dateLabel}</p> : null}
                {locationLabel ? <p>{locationLabel}</p> : null}
                {sponsorName ? <p>Sponsored by {sponsorName}</p> : null}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePlacementPreview;