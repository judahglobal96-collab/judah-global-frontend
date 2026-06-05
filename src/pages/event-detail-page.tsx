import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type EventMediaItem = {
  media_url?: string;
  image_url?: string;
  file_url?: string;
  url?: string;
  media_type?: string;
  status?: string;
  is_primary?: boolean;
};

type EventDetail = {
  event_id?: string;
  event_code?: string;
  title?: string;
  short_description?: string;
  description?: string;
  city?: string;
  state_region?: string;
  country?: string;
  venue_name?: string;
  address_line_1?: string;
  location_city?: string;
  location_state?: string;
  timezone?: string;
  starts_at_utc?: string;
  ends_at_utc?: string;
  sponsor_name?: string;
  contact_email?: string;
  status?: string;
  is_featured?: boolean;
  is_virtual?: boolean;

  hero_image_url?: string;
  campaign_media_url?: string;
  image_url?: string;
  media_url?: string;
  official_flyer_url?: string;

  campaign_media?: EventMediaItem | EventMediaItem[];
  event_media?: EventMediaItem | EventMediaItem[];

  sponsor_logo_url?: string;
  logo_url?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getEventUrl = (eventId: string) =>
  `${API_BASE_URL}/api/v1/events/${eventId}`;

const DEFAULT_FALLBACK_IMAGE = "/images/judah-default-fallback.png";
const FEATURED_FALLBACK_IMAGE = "/images/judah-featured-fallback.png";

function formatDate(dateString?: string) {
  if (!dateString) return "TBD";

  return new Date(dateString).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toAbsoluteMediaUrl(url?: string) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${normalized}`;
}

function cleanCountry(country?: string) {
  if (!country) return "";

  const trimmed = country.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "uni") return "";
  if (lower === "united states") return "USA";
  if (lower === "united states of america") return "USA";

  return trimmed;
}

function buildCommaLine(parts: Array<string | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

function getMediaUrlFromItem(item?: EventMediaItem) {
  if (!item) return "";

  return (
    item.media_url ||
    item.image_url ||
    item.file_url ||
    item.url ||
    ""
  );
}

function normalizeMediaItems(
  media?: EventMediaItem | EventMediaItem[]
): EventMediaItem[] {
  if (!media) return [];
  return Array.isArray(media) ? media : [media];
}

function findApprovedMediaUrl(media?: EventMediaItem | EventMediaItem[]) {
  const items = normalizeMediaItems(media);

  const approvedPrimary = items.find(
    (item) =>
      item.status === "approved" &&
      item.is_primary &&
      getMediaUrlFromItem(item)
  );

  if (approvedPrimary) return getMediaUrlFromItem(approvedPrimary);

  const approvedImage = items.find(
    (item) =>
      item.status === "approved" &&
      (!item.media_type || item.media_type.includes("image")) &&
      getMediaUrlFromItem(item)
  );

  if (approvedImage) return getMediaUrlFromItem(approvedImage);

  const anyApproved = items.find(
    (item) => item.status === "approved" && getMediaUrlFromItem(item)
  );

  if (anyApproved) return getMediaUrlFromItem(anyApproved);

  const anyMedia = items.find((item) => getMediaUrlFromItem(item));

  return anyMedia ? getMediaUrlFromItem(anyMedia) : "";
}

function DetailInfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        background: "#ffffff",
      }}
    >
      <strong style={{ display: "block", marginBottom: 8, color: "#0f172a" }}>
        {label}
      </strong>
      {children}
    </div>
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) {
        setError("Missing event ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(getEventUrl(eventId));
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load event");
        }

        console.log("EVENT DETAIL RESPONSE:", data);
        console.log("campaign_media:", data.campaign_media);
        console.log("event_media:", data.event_media);
        console.log("campaign_media_url:", data.campaign_media_url);
        console.log("official_flyer_url:", data.official_flyer_url);

        setEvent(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load event";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!isImageModalOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsImageModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isImageModalOpen]);

  const fallbackImage = useMemo(() => {
    return event?.is_featured ? FEATURED_FALLBACK_IMAGE : DEFAULT_FALLBACK_IMAGE;
  }, [event]);

  const campaignMediaImage = useMemo(() => {
    if (!event) return "";

    return toAbsoluteMediaUrl(
      event.campaign_media_url ||
        findApprovedMediaUrl(event.campaign_media) ||
        findApprovedMediaUrl(event.event_media)
    );
  }, [event]);

  const officialFlyerImage = useMemo(() => {
    if (!event) return "";

    return toAbsoluteMediaUrl(
      event.official_flyer_url ||
        findApprovedMediaUrl(event.event_media) ||
        findApprovedMediaUrl(event.campaign_media)
    );
  }, [event]);

  const heroImage = useMemo(() => {
    if (!event) return "";

return (
  toAbsoluteMediaUrl(event.hero_image_url) ||
  toAbsoluteMediaUrl(event.image_url) ||
  toAbsoluteMediaUrl(event.media_url) ||
  campaignMediaImage
);
  }, [event, campaignMediaImage]);

    const displayImage =
      heroImage ||
      campaignMediaImage ||
      fallbackImage;

  const shouldShowOfficialFlyer = Boolean(officialFlyerImage);

  const locationLine = useMemo(() => {
    if (!event) return "Location TBD";

    const line = buildCommaLine([
      event.city,
      event.state_region,
      cleanCountry(event.country),
    ]);

    return line || "Location TBD";
  }, [event]);

  const venueAddress = useMemo(() => {
    if (!event) return "N/A";

    const line = buildCommaLine([
      event.address_line_1,
      event.location_city || event.city,
      event.location_state || event.state_region,
      cleanCountry(event.country),
    ]);

    return line || "N/A";
  }, [event]);

  function openImageModal(src: string, alt: string) {
    setModalImageSrc(src);
    setModalImageAlt(alt);
    setIsImageModalOpen(true);
  }

  if (loading) {
    return (
      <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
        <Link
          to="/events"
          style={{
            color: "#334155",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back
        </Link>
        <p style={{ marginTop: 16, color: "#475569" }}>Loading event...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
        <Link
          to="/events"
          style={{
            color: "#334155",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back
        </Link>
        <h1 style={{ marginTop: 16, color: "#0f172a" }}>Event not found</h1>
        <p style={{ color: "#475569" }}>
          {error || "This event is unavailable."}
        </p>
      </main>
    );
  }

  return (
    <>
      <main
        className="event-detail-page"
        style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}
      >
        <div className="event-detail-shell">
          <Link
            to="/events"
            className="event-back-link"
            style={{
              display: "inline-flex",
              marginBottom: 18,
              color: "#334155",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back
          </Link>

          <article
            className="event-detail-card"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              background: "#ffffff",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
              overflow: "hidden",
            }}
          >
            <div
              className="event-detail-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
                gap: 0,
              }}
            >
              <div
                className="event-detail-main"
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
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
                      }}
                    >
                      Featured
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
                </div>

                {event.event_code && (
                  <div
                    style={{
                      marginBottom: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    <span style={{ color: "#667085", fontWeight: 600 }}>
                      Event Code
                    </span>
                    <span>{event.event_code}</span>
                  </div>
                )}

                <h1
                  className="event-title"
                  style={{
                    margin: 0,
                    fontSize: "2.2rem",
                    lineHeight: 1.08,
                    color: "#0f172a",
                  }}
                >
                  {event.title || "Untitled Event"}
                </h1>

                <p
                  className="event-location"
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {locationLine}
                </p>

                <div
                  className="event-dates"
                  style={{
                    display: "grid",
                    gap: 10,
                    padding: 18,
                    borderRadius: 18,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#334155",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#0f172a" }}>Starts:</strong>{" "}
                    {formatDate(event.starts_at_utc)}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#0f172a" }}>Ends:</strong>{" "}
                    {formatDate(event.ends_at_utc)}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#0f172a" }}>Timezone:</strong>{" "}
                    {event.timezone || "N/A"}
                  </p>
                </div>

                <p
                  className="event-description"
                  style={{
                    margin: 0,
                    color: "#334155",
                    lineHeight: 1.75,
                    fontSize: "1rem",
                  }}
                >
                  {event.description ||
                    event.short_description ||
                    "No description available yet."}
                </p>
              </div>

              <div
                className="event-detail-media"
                style={{
                  borderLeft: "1px solid #e5e7eb",
                  background: "#f8fafc",
                  minHeight: 320,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    openImageModal(displayImage, event.title || "Expanded event image")
                  }
                  className="event-image-frame"
                  aria-label="Expand event image"
                  style={{
                    height: "100%",
                    minHeight: 320,
                    width: "100%",
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "zoom-in",
                  }}
                >
                  <img
                    src={displayImage}
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
                        "linear-gradient(to top, rgba(15,23,42,0.18), rgba(15,23,42,0.04), rgba(15,23,42,0))",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      right: 14,
                      bottom: 14,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(15, 23, 42, 0.72)",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.2,
                    }}
                  >
                    Click to expand
                  </div>
                </button>
              </div>
            </div>
          </article>

          <div
            className="event-meta-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 18,
              marginTop: 24,
            }}
          >
            <DetailInfoCard label="Venue Name">
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                {event.venue_name || "N/A"}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Venue Address">
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                {venueAddress}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Sponsor">
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                {event.sponsor_name || "N/A"}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Contact Email">
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                {event.contact_email || "N/A"}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Virtual Event">
              <span
                style={{
                  display: "inline-flex",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: event.is_virtual ? "#e8eefc" : "#eef2f7",
                  color: event.is_virtual ? "#23408e" : "#475569",
                }}
              >
                {event.is_virtual ? "Yes" : "No"}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Featured Event">
              <span
                style={{
                  display: "inline-flex",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: event.is_featured ? "#f5e7c6" : "#eef2f7",
                  color: event.is_featured ? "#7a5a10" : "#475569",
                }}
              >
                {event.is_featured ? "Yes" : "No"}
              </span>
            </DetailInfoCard>

            <DetailInfoCard label="Country">
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                {cleanCountry(event.country) || "N/A"}
              </span>
            </DetailInfoCard>
          </div>

          {shouldShowOfficialFlyer && (
            <section
              style={{
                marginTop: 24,
                border: "1px solid #e5e7eb",
                borderRadius: 24,
                background: "#ffffff",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#667085",
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  Official Event Flyer
                </div>

                <h3
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "1.4rem",
                  }}
                >
                  Full promotional flyer
                </h3>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    color: "#475569",
                    lineHeight: 1.7,
                    maxWidth: 760,
                  }}
                >
                  View the official full-page flyer for this event.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() =>
                    openImageModal(
                      officialFlyerImage,
                      `${event.title || "Event"} official flyer`
                    )
                  }
                  style={{
                    width: "min(100%, 420px)",
                    border: "1px solid #e5e7eb",
                    borderRadius: 22,
                    background: "#f8fafc",
                    padding: 16,
                    cursor: "zoom-in",
                    textAlign: "left",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      marginBottom: 14,
                    }}
                  >
                    <img
                      src={officialFlyerImage}
                      alt={`${event.title || "Event"} official flyer`}
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
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        color: "#334155",
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      Open the full flyer
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: "#0f172a",
                        color: "#ffffff",
                      }}
                    >
                      Open Flyer
                    </span>
                  </div>
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {isImageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded event image"
          onClick={() => setIsImageModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.84)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(96vw, 900px)",
              maxHeight: "92vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "8px 4px 16px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Close expanded image"
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(15, 23, 42, 0.88)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <img
              src={modalImageSrc || displayImage}
              alt={modalImageAlt || event.title || "Expanded event image"}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "calc(92vh - 80px)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                margin: "0 auto",
                borderRadius: 16,
                background: "#ffffff",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
              }}
            />

            <div
              style={{
                color: "#e2e8f0",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              Click outside the image or press Esc to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}