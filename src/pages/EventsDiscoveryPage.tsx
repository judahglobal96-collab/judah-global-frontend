import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import type { EventCardItem } from "../components/events/EventCard";
import { getSupportRegion } from "../utils/region";


type DiscoveryFilters = {
  search: string;
  city: string;
  stateRegion: string;
  country: string;
  category: string;
};

type DiscoveryPromoItem = {
  placement_type?: string;
  placement_date?: string;
  event_id?: string;
  event_code?: string;
  title?: string;
  starts_at_utc?: string;
  ends_at_utc?: string;
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  media_url?: string | null;
  imageUrl?: string | null;
  display_image_url?: string | null;
  is_featured?: boolean;
  sponsor_name?: string | null;
};

type DiscoveryTopRowPromo = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
  badge?: string;
  imageUrl?: string;
};

const DEFAULT_FILTERS: DiscoveryFilters = {
  search: "",
  city: "",
  stateRegion: "",
  country: "",
  category: "",
};

const topRowFallbackImage = "/images/judah-default-fallback.png";

const fallbackDiscoveryTopRow: DiscoveryTopRowPromo[] = [
  {
    id: "discovery-top-row-1",
    title: "Discovery Top Row Placement 1",
    body:
      "Top-row discovery visibility for active campaigns, sponsor media, and event promotions.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Discovery Top Row",
    imageUrl: topRowFallbackImage,
  },
  {
    id: "discovery-top-row-2",
    title: "Discovery Top Row Placement 2",
    body:
      "Designed for premium discovery-page exposure with direct event visibility.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Discovery Top Row",
    imageUrl: topRowFallbackImage,
  },
  {
    id: "discovery-top-row-3",
    title: "Discovery Top Row Placement 3",
    body:
      "Reserved for live paid discovery top-row campaigns and sponsor promotions.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Discovery Top Row",
    imageUrl: topRowFallbackImage,
  },
];

const FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "0.98rem",
  color: "#0f172a",
  background: "#ffffff",
  boxSizing: "border-box",
};

const BUTTON_DARK: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 700,
};

const BUTTON_LIGHT: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: 600,
};

function formatDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cleanCountry(country?: string | null) {
  if (!country) return "";
  const trimmed = country.trim().toLowerCase();
  if (trimmed === "united states" || trimmed === "united states of america") {
    return "USA";
  }
  return country;
}

function resolveMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${import.meta.env.VITE_API_BASE_URL}${normalized}`;
}

function buildPromoBody(promo: DiscoveryPromoItem) {
  const dateLabel = formatDate(promo.starts_at_utc);
  const location = [promo.city, promo.state_region, cleanCountry(promo.country)]
    .filter(Boolean)
    .join(", ");

  const parts = [
    promo.sponsor_name ? `Sponsored by ${promo.sponsor_name}` : "",
    dateLabel,
    location,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(" • ")
    : "Discovery top-row promotional placement for events, campaigns, announcements, or sponsor media.";
}

function getPromoImageUrl(
  promo: DiscoveryTopRowPromo | DiscoveryPromoItem,
  isLive: boolean
): string {
  if (isLive) {
    const livePromo = promo as DiscoveryPromoItem;
    return (
      resolveMediaUrl(livePromo.media_url) ||
      resolveMediaUrl(livePromo.imageUrl) ||
      resolveMediaUrl(livePromo.display_image_url) ||
      topRowFallbackImage
    );
  }

  const staticPromo = promo as DiscoveryTopRowPromo;
  return staticPromo.imageUrl || topRowFallbackImage;
}

function DiscoveryTopRowCard({
  promo,
  isLive = false,
}: {
  promo: DiscoveryTopRowPromo | DiscoveryPromoItem;
  isLive?: boolean;
}) {
  const livePromo = promo as DiscoveryPromoItem;
  const staticPromo = promo as DiscoveryTopRowPromo;

  const title = isLive
    ? livePromo.title || "Discovery Top Row Placement"
    : staticPromo.title;

  const body = isLive ? buildPromoBody(livePromo) : staticPromo.body;

  const ctaTo =
    isLive && livePromo.event_id
      ? `/event/${livePromo.event_id}`
      : staticPromo.ctaTo;

  const ctaLabel = isLive ? "View Event" : staticPromo.ctaLabel;

  const badge = isLive
    ? livePromo.is_featured
      ? "Featured Discovery"
      : "Discovery Top Row"
    : staticPromo.badge;

  const imageUrl = getPromoImageUrl(promo, isLive);

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <div
          style={{
            width: "100%",
            height: 180,
            overflow: "hidden",
            background: "#f1f5f9",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = topRowFallbackImage;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          padding: 22,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {badge ? (
          <div
            style={{
              alignSelf: "flex-start",
              marginBottom: 12,
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              background: "#dbeafe",
              color: "#1d4ed8",
            }}
          >
            {badge}
          </div>
        ) : null}

        <h3 style={{ margin: 0, marginBottom: 10 }}>{title}</h3>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          {body}
        </p>

        <Link
          to={ctaTo}
          style={{
            marginTop: 16,
            color: "#1d4ed8",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  );
}

export default function EventsDiscoveryPage() {
  const [events, setEvents] = useState<EventCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [liveTopRow, setLiveTopRow] = useState<DiscoveryPromoItem[]>([]);
  const [loadingTopRow, setLoadingTopRow] = useState(true);

  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<DiscoveryFilters>(DEFAULT_FILTERS);

  async function loadEvents(
    currentPage: number,
    currentFilters: DiscoveryFilters
  ) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "12");

      const search = currentFilters.search.trim();
      const city = currentFilters.city.trim();
      const stateRegion = currentFilters.stateRegion.trim();
      const supportRegion = getSupportRegion();
      const country = currentFilters.country.trim() || supportRegion;
      const category = currentFilters.category.trim();

      if (search) params.set("q", search);
      if (city) params.set("city", city);
      if (stateRegion) params.set("state_region", stateRegion);

      params.set("country", country);

      if (category) params.set("category", category);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/events?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("DISCOVERY EVENTS RESPONSE:", data);

      const resolvedEvents = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : Array.isArray(data?.events)
        ? data.events
        : [];

      setEvents(resolvedEvents);

      setTotalPages(
        typeof data?.total_pages === "number" && data.total_pages > 0
          ? data.total_pages
          : typeof data?.pagination?.totalPages === "number" &&
            data.pagination.totalPages > 0
          ? data.pagination.totalPages
          : 1
      );
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError("Failed to load events.");
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function loadDiscoveryTopRow() {
    try {
      setLoadingTopRow(true);

  const region = getSupportRegion(); // TEMP for P0.3

  const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/placements/discovery-top-row?region=${encodeURIComponent(region)}`
);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setLiveTopRow(Array.isArray(data?.results) ? data.results : []);
    } catch (err) {
      console.error("Failed to load discovery top row promos:", err);
      setLiveTopRow([]);
    } finally {
      setLoadingTopRow(false);
    }
  }

  useEffect(() => {
    loadEvents(page, appliedFilters);
  }, [page, appliedFilters]);

  useEffect(() => {
    loadDiscoveryTopRow();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  function updateFilter<K extends keyof DiscoveryFilters>(
    key: K,
    value: DiscoveryFilters[K]
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSearchSubmit(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    setAppliedFilters({
      search: filters.search.trim(),
      city: filters.city.trim(),
      stateRegion: filters.stateRegion.trim(),
      country: filters.country.trim(),
      category: filters.category.trim(),
    });
    setPage(1);
  }

  function handleClearSearch() {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ label: string; value: string }> = [];

    if (appliedFilters.search) {
      chips.push({ label: "Search", value: appliedFilters.search });
    }
    if (appliedFilters.city) {
      chips.push({ label: "City", value: appliedFilters.city });
    }
    if (appliedFilters.stateRegion) {
      chips.push({ label: "State/Region", value: appliedFilters.stateRegion });
    }
    if (appliedFilters.country) {
      chips.push({ label: "Country", value: appliedFilters.country });
    }
    if (appliedFilters.category) {
      chips.push({ label: "Category", value: appliedFilters.category });
    }

    return chips;
  }, [appliedFilters]);

  const hasActiveFilters = activeFilterChips.length > 0;

  const summaryText = hasActiveFilters
    ? "Showing filtered results"
    : "Showing all live events";

  const displayTopRow = useMemo(() => {
    const live = liveTopRow.slice(0, 3);

    if (live.length === 3) return live;
    if (live.length === 0) return fallbackDiscoveryTopRow;

    const remaining = fallbackDiscoveryTopRow.slice(0, 3 - live.length);
    return [...live, ...remaining];
  }, [liveTopRow]);

  const headerBlock = (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ marginBottom: 8, fontSize: "2.2rem", color: "#0f172a" }}>
        Discover Events
      </h1>
      <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 760 }}>
        Explore events happening around the world. Use keyword search for broad
        discovery, then narrow results with City, State/Region, Country, and
        Category filters.
      </p>

      <form onSubmit={handleSearchSubmit} style={{ marginTop: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div style={{ gridColumn: "span 12" }}>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search events worldwide..."
              style={FIELD_STYLE}
            />
          </div>

          <div style={{ gridColumn: "span 12 / span 12" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <input
                type="text"
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                placeholder="City"
                style={FIELD_STYLE}
              />

              <input
                type="text"
                value={filters.stateRegion}
                onChange={(e) => updateFilter("stateRegion", e.target.value)}
                placeholder="State / Region"
                style={FIELD_STYLE}
              />

              <input
                type="text"
                value={filters.country}
                onChange={(e) => updateFilter("country", e.target.value)}
                placeholder="Country"
                style={FIELD_STYLE}
              />

              <input
                type="text"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                placeholder="Category"
                style={FIELD_STYLE}
              />
            </div>
          </div>

          <div
            style={{
              gridColumn: "span 12",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button type="submit" style={BUTTON_DARK}>
              Search
            </button>

            <button type="button" onClick={handleClearSearch} style={BUTTON_LIGHT}>
              Clear
            </button>
          </div>
        </div>
      </form>

      {hasActiveFilters ? (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {activeFilterChips.map((chip) => (
            <div
              key={`${chip.label}-${chip.value}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              {chip.label}: "{chip.value}"
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  const topRowSection = (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#2563eb",
          }}
        >
          Sponsored Placement
        </p>

        <h2 style={{ margin: 0, marginBottom: 8 }}>Discovery Top Row</h2>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.7,
            maxWidth: 760,
          }}
        >
          {liveTopRow.length > 0
            ? "Live discovery top-row placements powered by active paid campaign inventory."
            : "Three top-row promotional placements for paid discovery visibility."}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {displayTopRow.map((promo, index) => {
          const isLivePromo =
            typeof (promo as DiscoveryPromoItem).event_id === "string" &&
            Boolean((promo as DiscoveryPromoItem).event_id);

          return (
            <DiscoveryTopRowCard
              key={
                isLivePromo
                  ? (promo as DiscoveryPromoItem).event_id ||
                    `live-discovery-top-row-${index}`
                  : (promo as DiscoveryTopRowPromo).id
              }
              promo={promo}
              isLive={isLivePromo}
            />
          );
        })}
      </div>

      {loadingTopRow ? (
        <p
          style={{
            marginTop: 14,
            marginBottom: 0,
            color: "#64748b",
            fontSize: 14,
          }}
        >
          Loading discovery top-row placements...
        </p>
      ) : null}
    </section>
  );

  if (loading) {
    return (
      <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
        {headerBlock}
        {topRowSection}

        <div
          style={{
            padding: 28,
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          Loading events...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
        {headerBlock}
        {topRowSection}

        <div
          style={{
            padding: 28,
            border: "1px solid #fecaca",
            borderRadius: 20,
            background: "#fff7f7",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
      {headerBlock}
      {topRowSection}

      {events.length === 0 ? (
        <div
          style={{
            padding: 28,
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          {hasActiveFilters
            ? "No events found for the selected search and filters."
            : "No events found."}
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: 18,
              color: "#475569",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            {summaryText}
          </div>

          <div
            style={{
              display: "grid",
              gap: 22,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 360px))",
              justifyContent: "center",
              alignItems: "start",
            }}
          >
            {events.map((event, index) => {
              const key = event.event_id || event.id || String(index);
              return (
                <EventCard
                  key={key}
                  event={event}
                  engagementSource="discovery"
                />
              );
            })}
          </div>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: page === 1 ? "#f8fafc" : "#ffffff",
                color: page === 1 ? "#94a3b8" : "#0f172a",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              Prev
            </button>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                fontWeight: 600,
              }}
            >
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: page === totalPages ? "#f8fafc" : "#ffffff",
                color: page === totalPages ? "#94a3b8" : "#0f172a",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
