import React from "react";
import type { SharedPreviewCardProps } from "../PlacementPreview";

const HomepageHeroPreview: React.FC<SharedPreviewCardProps> = ({
  imageUrl,
  title,
  sponsorName,
  description,
  dateLabel,
  locationLabel,
  state = "approved",
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Homepage Hero Preview
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Premium homepage spotlight placement
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            state === "approved"
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
          }`}
        >
          {state === "approved" ? "Approved Media" : "Preview Only"}
        </span>
      </div>

      <div className="bg-slate-950 p-3">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
        <div className="relative h-[220px] max-h-[220px] w-full overflow-hidden sm:h-[260px] sm:max-h-[260px]">            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-900">
                Judah Global
              </span>
              <span className="rounded-full bg-amber-400/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-950">
                Hero
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
              <div className="max-w-xl">
                <h2 className="text-lg font-semibold leading-tight text-white sm:text-2xl">
                  {title}
                </h2>

                {description ? (
                  <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-5 text-slate-200 sm:text-sm">
                    {description}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-200">
                  {dateLabel ? (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm">
                      {dateLabel}
                    </span>
                  ) : null}

                  {locationLabel ? (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm">
                      {locationLabel}
                    </span>
                  ) : null}

                  {sponsorName ? (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm">
                      Sponsored by {sponsorName}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900 px-4 py-3">
            <div>
              <p className="text-xs font-medium text-white">
                Hero spotlight placement
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Click-through to the event detail page.
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm"
            >
              View Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHeroPreview;
