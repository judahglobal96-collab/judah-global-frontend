import { Link } from "react-router-dom";
import { useMemo } from "react";

export type EventCardItem = {
  event_id?: string;
  id?: string;
  title?: string;
  short_description?: string;
  description?: string;
  city?: string;
  state_region?: string;
  country?: string;
  venue_name?: string;
  address_line_1?: string;
  timezone?: string;
  starts_at_utc?: string;
  ends_at_utc?: string;
  sponsor_name?: string;
  status?: string;
  is_featured?: boolean;
  is_major_event?: boolean;
  is_virtual?: boolean;
  logo_url?: string | null;
  hero_image_url?: string | null;
  media_url?: string | null;
  sponsor_logo_url?: string | null;
};

type EventCardProps = {
  event?: EventCardItem;
  engagementSource?: string;

  // legacy props support
  title?: string;
  short_description?: string;
  description?: string;
  city?: string;
  state_region?: string;
  country?: string;
  venue_name?: string;
  address_line_1?: string;
  timezone?: string;
  starts_at_utc?: string;
  ends_at_utc?: string;
  date?: string;
  sponsor_name?: string;
  status?: string;
  is_featured?: boolean;
  is_major_event?: boolean;
  is_virtual?: boolean;
  logo_url?: string | null;
  hero_image_url?: string | null;
  media_url?: string | null;
  sponsor_logo_url?: string | null;
  event_id?: string;
  id?: string;
};

function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${import.meta.env.VITE_API_BASE_URL}${normalized}`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "TBD";

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function cleanCountry(country?: string) {
  if (!country) return "";
  const trimmed = country.trim();

  if (trimmed.toLowerCase() === "uni") return "";
  if (trimmed.toLowerCase() === "united states of america") return "USA";
  if (trimmed.toLowerCase() === "united states") return "USA";

  return trimmed;
}

function buildLocationLine(event: EventCardItem) {
  const country = cleanCountry(event.country);

  const parts = [
    event.venue_name?.trim(),
    event.city?.trim(),
    event.state_region?.trim(),
    country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Location TBD";
}

function buildSummary(event: EventCardItem) {
  const source = event.short_description || event.description || "";
  const trimmed = source.trim();

  if (!trimmed) {
    return "View event details, schedule, location, and sponsor information.";
  }

  if (trimmed.length <= 140) return trimmed;

  return `${trimmed.slice(0, 137).trim()}...`;
}

function normalizeEventFromProps(props: EventCardProps): EventCardItem {
  if (props.event) {
    return props.event;
  }

  return {
    event_id: props.event_id,
    id: props.id,
    title: props.title,
    short_description: props.short_description,
    description: props.description,
    city: props.city,
    state_region: props.state_region,
    country: props.country,
    venue_name: props.venue_name,
    address_line_1: props.address_line_1,
    timezone: props.timezone,
    starts_at_utc: props.starts_at_utc || props.date,
    ends_at_utc: props.ends_at_utc,
    sponsor_name: props.sponsor_name,
    status: props.status,
    is_featured: props.is_featured,
    is_major_event: props.is_major_event,
    is_virtual: props.is_virtual,
    logo_url: props.logo_url,
    hero_image_url: props.hero_image_url,
    media_url: props.media_url,
    sponsor_logo_url: props.sponsor_logo_url,
  };
}

async function trackEventClick(eventId: string, source: string) {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/event-engagement/click`, 
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        eventId,
        actionType: "click",
        source,
      }),
    });
  } catch (error) {
    console.error("Event click tracking failed:", error);
  }
}

export default function EventCard(props: EventCardProps) {
  const event = normalizeEventFromProps(props);
  console.log("EVENT CARD DATA", event);

  const engagementSource = props.engagementSource || "discovery";

  const eventId = event.event_id || event.id;
  const href = eventId ? `/events/${eventId}` : "#";

  const heroImage = useMemo(() => {
    return (
      resolveMediaUrl(event.hero_image_url) ||
      resolveMediaUrl(event.media_url)
    );
  }, [event.hero_image_url, event.media_url]);

  const fallbackImage = event.is_featured
    ? "/images/judah-featured-fallback.png"
    : "/images/judah-default-fallback.png";

  const locationLine = buildLocationLine(event);
  const summary = buildSummary(event);

  const hasMajorEventTreatment = Boolean(event.is_major_event);

  const cardInner = (
    <article
      style={{
        border: hasMajorEventTreatment
          ? "2px solid #d4af37"
          : "1px solid #e5e7eb",
        borderRadius: 20,
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: hasMajorEventTreatment
          ? "0 0 0 2px rgba(212,175,55,0.18), 0 10px 24px rgba(15, 23, 42, 0.08)"
          : "0 10px 24px rgba(15, 23, 42, 0.06)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 160ms ease, box-shadow 160ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 220,
          overflow: "hidden",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        }}
      >
        <img
          src={heroImage || fallbackImage}
          alt={event.title || "Event image"}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15,23,42,0.42), rgba(15,23,42,0.08), rgba(15,23,42,0))",
          }}
        />

        {hasMajorEventTreatment && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid rgba(212,175,55,0.9)",
              boxShadow: "inset 0 0 18px rgba(212,175,55,0.22)",
              borderRadius: 20,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            zIndex: 20,
          }}
        >
          {event.is_featured && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#f5e7c6",
                color: "#7a5a10",
                backdropFilter: "blur(6px)",
              }}
            >
              Featured
            </span>
          )}

          {event.is_major_event && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                padding: "6px 12px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #f3df9b, #e7c85f)",
                color: "#6b4d00",
                border: "1px solid rgba(122,90,16,0.22)",
                boxShadow: "0 2px 8px rgba(212,175,55,0.22)",
              }}
            >
              Major Event
            </span>
          )}

          {event.is_virtual && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#e8eefc",
                color: "#23408e",
              }}
            >
              Virtual
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {event.status && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#eef2f7",
                color: "#334155",
                textTransform: "capitalize",
              }}
            >
              {event.status}
            </span>
          )}

          {event.timezone && (
            <span
              style={{
                fontSize: 12,
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              {event.timezone}
            </span>
          )}
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              lineHeight: 1.2,
              color: "#0f172a",
            }}
          >
            {event.title || "Untitled Event"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
            color: "#334155",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <div>
            <strong style={{ color: "#0f172a" }}>Starts:</strong>{" "}
            {formatDate(event.starts_at_utc)}
          </div>

          <div>
            <strong style={{ color: "#0f172a" }}>Ends:</strong>{" "}
            {formatDate(event.ends_at_utc)}
          </div>

          <div>
            <strong style={{ color: "#0f172a" }}>Location:</strong>{" "}
            {locationLine}
          </div>

          <div>
            <strong style={{ color: "#0f172a" }}>Sponsor:</strong>{" "}
            {event.sponsor_name || "Sponsor TBD"}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.65,
            fontSize: 14,
          }}
        >
          {summary}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f1f5f9",
          }}
        >
            <span
            style={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Explore event details →
            </span>


            <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
            
            }}
          >
            View Details →
            </span>
        </div>
      </div>
    </article>
  );

  if (!eventId) {
    return <div style={{ opacity: 0.7 }}>{cardInner}</div>;
  }

  return (
    <Link
      to={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
      onClick={() => {
        void trackEventClick(eventId, engagementSource);
      }}
    >
        {cardInner}
    </Link>
  );
}
