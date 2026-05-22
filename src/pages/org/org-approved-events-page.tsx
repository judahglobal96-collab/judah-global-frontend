import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

type ApprovedEventCard = {
  id: string;
  title: string;
  eventType: string;
  dateLabel: string;
  locationLabel: string;
  status: "Approved";
  featured?: boolean;
  isMajorEvent?: boolean;
  majorEventExpiresAt?: string | null;
  ends_at_utc: string | null;
};

type ApprovedEventApiRow = {
  id: string;
  event_code?: string | null;
  title?: string | null;
  description?: string | null;
  event_type?: string | null;
  submitter_email?: string | null;
  status?: string | null;
  payment_status?: string | null;
  payment_amount_cents?: number | null;
  payment_currency?: string | null;
  featured?: boolean | null;
  is_featured?: boolean | null;
  is_major_event?: boolean | null;
  major_event_expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  start_date?: string | null;
  ends_at_utc: string | null;
};

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

function formatEventDate(dateValue?: string | null) {
  if (!dateValue) return "Date pending";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Date pending";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(params: {
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
}) {
  const parts = [params.city, params.state_region, params.country].filter(
    Boolean
  );

  return parts.length ? parts.join(", ") : "Location pending";
}

function getDaysRemaining(value?: string | null) {
  if (!value) return null;

  const expiresAt = new Date(value).getTime();
  if (Number.isNaN(expiresAt)) return null;

  const now = Date.now();
  return Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));
}

function mapApprovedEvent(row: ApprovedEventApiRow): ApprovedEventCard {
  return {
    id: row.id,
    title: row.title || "Untitled Event",
    eventType: row.event_type || "Event",
    ends_at_utc: row.ends_at_utc,
    dateLabel: formatEventDate(row.start_date),
    locationLabel: formatLocation({
      city: row.city,
      state_region: row.state_region,
      country: row.country,
    }),
    status: "Approved",
    featured: Boolean(row.featured || row.is_featured),
    isMajorEvent: Boolean(row.is_major_event),
    majorEventExpiresAt: row.major_event_expires_at || null,
  };
}

export default function OrgApprovedEventsPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = orgUuid ? `/org/${orgUuid}` : "/org";
  const search = location.search || "";
  const isAdminPreview = search.includes("adminPreview=1");
  const orgSubscriptionActive = true;

  const [approvedEvents, setApprovedEvents] = useState<ApprovedEventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [renewingEventId, setRenewingEventId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadApprovedEvents() {
      if (!orgUuid) {
        if (isMounted) {
          setApprovedEvents([]);
          setLoading(false);
          setLoadError("Organization UUID is missing.");
        }

        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const token = localStorage.getItem("auth_token");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/org/${orgUuid}/approved-events`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to load approved events"
          );
        }

        const rows: ApprovedEventApiRow[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        if (!isMounted) return;

        setApprovedEvents(rows.map(mapApprovedEvent));
      } catch (err: any) {
        if (!isMounted) return;

        setLoadError(err?.message || "Failed to load approved events");
        setApprovedEvents([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadApprovedEvents();

    return () => {
      isMounted = false;
    };
  }, [orgUuid]);

  const approvedCountLabel = useMemo(() => {
    if (loading) return "Loading approved events...";
    if (approvedEvents.length === 1) return "1 approved event";
    return `${approvedEvents.length} approved events`;
  }, [approvedEvents.length, loading]);

  function handlePromoteEvent(event: ApprovedEventCard) {
    navigate("/campaign-builder", {
      state: {
        eventId: event.id,
        orgUuid: orgUuid || null,
        source: "org-submit-event-monetization",
        includeEventFee: true,
        orgSubscriptionActive,
        waiveEventPayment: false,
      },
    });
  }

  async function handleExtendMajorEvent(event: ApprovedEventCard) {
    try {
      setRenewingEventId(event.id);

      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/payments/promotions/major-event-renewal/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            event_id: event.id,
            org_uuid: orgUuid || null,
            duration_days: 21,
            source: "org-approved-events",
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to start renewal checkout."
        );
      }

      if (!data?.checkout_url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = data.checkout_url;
    } catch (err: any) {
      console.error("Extend Major Event error:", err);
      alert(err?.message || "Something went wrong starting checkout.");
    } finally {
      setRenewingEventId(null);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#f5f1e8",
      }}
    >
      {isAdminPreview && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/org-accounts")}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Admin Portal
          </button>
        </div>
      )}

      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            fontSize: "0.76rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#c8a96b",
            marginBottom: "10px",
          }}
        >
          Organization Portal
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            lineHeight: 1.1,
            color: "#fffaf0",
          }}
        >
          Approved Events
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: "760px",
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.7,
            fontSize: "0.98rem",
          }}
        >
          Review and edit approved events, promote published listings, or extend
          Major Event placement. Media changes are not allowed but will be
          available for a later release.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              background: "rgba(200,169,107,0.14)",
              color: "#f3d89b",
              border: "1px solid rgba(200,169,107,0.24)",
            }}
          >
            Org Subscription: {orgSubscriptionActive ? "Active" : "Inactive"}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              background: "rgba(255,255,255,0.06)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {approvedCountLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to={basePath}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Back to Overview
          </Link>

          <Link
            to={`${basePath}/submit-event`}
            style={{
              textDecoration: "none",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
              color: "#fffaf0",
              border: "1px solid rgba(200,169,107,0.34)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            }}
          >
            Submit New Event
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "22px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "0.76rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#c8a96b",
              marginBottom: "10px",
            }}
          >
            Published Event Library
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Approved events for this organization
          </h3>

          {loading ? (
            <EmptyPanel text="Loading approved events..." />
          ) : loadError ? (
            <EmptyPanel title="Unable to load approved events" text={loadError} />
          ) : approvedEvents.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div
                style={{ fontWeight: 700, color: "#fffaf0", marginBottom: "8px" }}
              >
                No approved events yet
              </div>

              <p
                style={{
                  margin: 0,
                  color: "rgba(245, 241, 232, 0.78)",
                  lineHeight: 1.7,
                }}
              >
                Once your organization submits an event and it is approved by
                Judah Global admin review, it will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {approvedEvents.map((event) => {
                const isExpired = Boolean(
                event.ends_at_utc && new Date(event.ends_at_utc) <= new Date()
              );
                const daysRemaining = getDaysRemaining(
                  event.majorEventExpiresAt
                );

                return (
                  <div
                    key={event.id}
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: event.isMajorEvent
                        ? "1.5px solid rgba(200,169,107,0.38)"
                        : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "18px",
                      padding: "18px 20px",
                      boxShadow: event.isMajorEvent
                        ? "0 12px 28px rgba(200,169,107,0.08)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            color: "#fffaf0",
                            fontSize: "1.02rem",
                            marginBottom: "6px",
                          }}
                        >
                          {event.title}
                        </div>

                        <div
                          style={{
                            color: "rgba(245, 241, 232, 0.78)",
                            lineHeight: 1.6,
                            fontSize: "0.95rem",
                          }}
                        >
                          {event.eventType} · {event.dateLabel} ·{" "}
                          {event.locationLabel}
                        </div>

                        {event.isMajorEvent && (
                          <div
                            style={{
                              marginTop: "8px",
                              color: "#f3d89b",
                              fontSize: "0.86rem",
                              fontWeight: 800,
                            }}
                          >
                            Major Event placement
                            {daysRemaining !== null
                              ? ` · ${daysRemaining} day${
                                  daysRemaining === 1 ? "" : "s"
                                } remaining`
                              : ""}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            background: "rgba(34,197,94,0.14)",
                            color: "#bbf7d0",
                            border: "1px solid rgba(34,197,94,0.24)",
                          }}
                        >
                          {event.status}
                        </span>

                        {event.featured && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              background: "rgba(200,169,107,0.14)",
                              color: "#f3d89b",
                              border: "1px solid rgba(200,169,107,0.24)",
                            }}
                          >
                            Featured
                          </span>
                        )}

                        {event.isMajorEvent && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "0.76rem",
                              fontWeight: 800,
                              background:
                                "linear-gradient(135deg, rgba(243,223,155,0.28), rgba(231,200,95,0.16))",
                              color: "#f3d89b",
                              border: "1px solid rgba(200,169,107,0.32)",
                            }}
                          >
                            Major Event
                          </span>
                        )}

                      {!isAdminPreview && (
                        isExpired ? (
                          <button
                            type="button"
                            disabled
                            title="Event has ended. Use Promote Event to reactivate."
                            style={{
                              ...buttonSecondaryDark,
                              opacity: 0.45,
                              cursor: "not-allowed",
                            }}
                          >
                            Event Ended
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/org/${orgUuid}/events/${event.id}/edit-metadata`)
                            }
                            style={buttonSecondaryDark}
                          >
                            Edit Metadata
                          </button>
                        )
                      )}
                        <button
                          type="button"
                          onClick={() => navigate(`/event/${event.id}`)}
                          style={buttonSecondaryDark}
                        >
                          View Public Page
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePromoteEvent(event)}
                          style={buttonGold}
                        >
                          Promote Event
                        </button>

                        {event.isMajorEvent && (
                          <button
                            type="button"
                            onClick={() => handleExtendMajorEvent(event)}
                            disabled={renewingEventId === event.id}
                            style={{
                              ...buttonGold,
                              opacity: renewingEventId === event.id ? 0.75 : 1,
                              cursor:
                                renewingEventId === event.id
                                  ? "wait"
                                  : "pointer",
                            }}
                          >
                            {renewingEventId === event.id
                              ? "Opening Checkout..."
                              : "Extend Major Event"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <SideCard
            eyebrow="Renewal Rule"
            title="Major Events renew in 21-day terms"
            text="Use Extend Major Event to route the owner through payment again. After payment succeeds, the active placement should be extended by another 21 days."
          />

          <SideCard
            eyebrow="Editing Rule"
            title="Owners can edit information only"
            text="Approved or rejected events return to pending review after event info changes. Media, flyers, logos, and promo creatives are not editable in this release."
          />

          <SideCard
            eyebrow="Current Status"
            title="Approved Events page is wired"
            text="This page connects approved events to promotion flow, Major Event renewal, and owner-only event info editing."
          />
        </div>
      </section>
    </div>
  );
}

function EmptyPanel({ title, text }: { title?: string; text: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        padding: "22px",
        color: "rgba(245, 241, 232, 0.82)",
      }}
    >
      {title && (
        <div style={{ fontWeight: 700, color: "#fffaf0", marginBottom: "8px" }}>
          {title}
        </div>
      )}

      <p style={{ margin: 0, lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function SideCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "22px",
        padding: "24px",
      }}
    >
      <div
        style={{
          fontSize: "0.76rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#c8a96b",
          marginBottom: "10px",
        }}
      >
        {eyebrow}
      </div>

      <h3 style={{ margin: "0 0 10px", color: "#fffaf0", fontSize: "1.2rem" }}>
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "rgba(245, 241, 232, 0.82)",
          lineHeight: 1.65,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const buttonSecondaryDark: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  color: "#fffaf0",
  borderRadius: "999px",
  padding: "8px 14px",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.14)",
  cursor: "pointer",
};

const buttonGold: React.CSSProperties = {
  background: "#c8a96b",
  color: "#111318",
  borderRadius: "999px",
  padding: "8px 14px",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
};
