import React from 'react';
import type { SharedPreviewCardProps } from '../PlacementPreview';

const MajorEventPreview: React.FC<SharedPreviewCardProps> = ({
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
            Major Event Preview
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Elevated promotional spotlight for headline events
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

      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <div className="relative min-h-[320px]">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-950">
                Major Event
              </div>
            </div>

            <div className="flex flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Judah Global Spotlight
                </p>

                <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-900">
                  {title}
                </h2>

                {description ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                ) : null}

                <div className="mt-5 space-y-2 text-sm text-slate-700">
                  {dateLabel ? <p>{dateLabel}</p> : null}
                  {locationLabel ? <p>{locationLabel}</p> : null}
                  {sponsorName ? <p>Presented by {sponsorName}</p> : null}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-600">
                  Premium feature placement designed for large-scale, high-visibility events.
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Explore Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajorEventPreview;
