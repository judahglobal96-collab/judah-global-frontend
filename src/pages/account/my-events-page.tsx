import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type MyEventRow = {
  id: string;
  event_code?: string | null;
  title?: string | null;
  event_type?: string | null;
  status?: string | null;
  featured?: boolean | null;
  is_featured?: boolean | null;
  is_major_event?: boolean | null;
  major_event_expires_at?: string | null;
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  start_date?: string | null;
  ends_at_utc: | null;
};

const API_BASE_URL = "${import.meta.env.VITE_API_BASE_URL}";

function formatDate(value?: string | null) {
  if (!value) return "Date pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date pending";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(event: MyEventRow) {
  return (
    [event.city, event.state_region, event.country].filter(Boolean).join(", ") ||
    "Location pending"
  );
}

function getDaysRemaining(value?: string | null) {
  if (!value) return null;

  const expiresAt = new Date(value).getTime();
  if (Number.isNaN(expiresAt)) return null;

  const now = Date.now();
  return Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));
}

export default function MyEventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<MyEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renewingEventId, setRenewingEventId] = useState<string | null>(null);

  async function loadMyEvents() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE_URL}/api/v1/account/my-events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load your events");
      }

      setEvents(Array.isArray(data?.data) ? data.data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load your events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleExtendMajorEvent(eventId: string) {
    try {
      setRenewingEventId(eventId);

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
            event_id: eventId,
            duration_days: 21,
            source: "public-my-events",
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

  useEffect(() => {
    loadMyEvents();
  }, []);

  const countLabel = useMemo(() => {
    if (loading) return "Loading events...";
    if (events.length === 1) return "1 event";
    return `${events.length} events`;
  }, [events.length, loading]);

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px" }}>
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          background: "#ffffff",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
          padding: 28,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#7a5a10",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Account
        </div>

        <h1 style={{ margin: 0, color: "#0f172a", fontSize: "2rem" }}>
          My Events
        </h1>

        <p style={{ color: "#475569", lineHeight: 1.7, maxWidth: 780 }}>
          Manage the events you submitted. You can edit event metadata, promote
          events, or extend active Major Event placement.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "#eef2f7",
              color: "#334155",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {countLabel}
          </div>

          <button
            type="button"
            onClick={() => navigate("/media-placement-guide")}
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              background: "#ffffff",
              color: "#101828",
              border: "1px solid #d0d5dd",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Media Placement Guide
          </button>
        </div>
      </section>

      {loading ? (
        <Panel>Loading your events...</Panel>
      ) : error ? (
        <Panel>{error}</Panel>
      ) : events.length === 0 ? (
        <Panel>You have not submitted any events yet.</Panel>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {events.map((event) => {
            const isExpired = Boolean(
              event.ends_at_utc && new Date(event.ends_at_utc) <= new Date()
            );
            const status = event.status || "draft";
            const isMajorEvent = Boolean(event.is_major_event);
            const isFeatured = Boolean(event.featured || event.is_featured);
            const daysRemaining = getDaysRemaining(
              event.major_event_expires_at
            );

            return (
              <article
                key={event.id}
                style={{
                  border: isMajorEvent
                    ? "1.5px solid rgba(200,169,107,0.65)"
                    : "1px solid #e5e7eb",
                  borderRadius: 20,
                  background: "#ffffff",
                  padding: 20,
                  boxShadow: isMajorEvent
                    ? "0 10px 24px rgba(200,169,107,0.14)"
                    : "0 10px 24px rgba(15, 23, 42, 0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        color: "#0f172a",
                        fontSize: "1.15rem",
                      }}
                    >
                      {event.title || "Untitled Event"}
                    </h2>

                    <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
                      {event.event_type || "Event"} ·{" "}
                      {formatDate(event.start_date)} · {formatLocation(event)}
                    </p>

                    {isMajorEvent && (
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#7a5a10",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        Major Event
                        {daysRemaining !== null
                          ? ` · ${daysRemaining} day${
                              daysRemaining === 1 ? "" : "s"
                            } remaining`
                          : ""}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: 999,
                        background:
                          status === "approved" ? "#dcfce7" : "#eef2f7",
                        color: status === "approved" ? "#166534" : "#334155",
                        fontWeight: 800,
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </span>

                    {isFeatured && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: "#f5e7c6",
                          color: "#7a5a10",
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        Featured
                      </span>
                    )}

                    {isMajorEvent && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderRadius: 999,
                          background:
                            "linear-gradient(135deg, #f3df9b, #e7c85f)",
                          color: "#6b4d00",
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                      >
                        Major Event
                      </span>
                    )}

                      <button
                        type="button"
                        disabled={isExpired}
                        title={isExpired ? "Event has ended. Use Promote Event to reactivate." : ""}
                        onClick={() => {
                          if (isExpired) return;
                          navigate(`/account/events/${event.id}/edit-metadata`);
                        }}
                        style={{
                          ...buttonSecondary,
                          opacity: isExpired ? 0.45 : 1,
                          cursor: isExpired ? "not-allowed" : "pointer",
                        }}
                      >
                        {isExpired ? "Event Ended" : "Edit Metadata"}
                      </button>
                    {status === "approved" && (
                      <button
                        type="button"
                        onClick={() => navigate(`/event/${event.id}`)}
                        style={buttonSecondary}
                      >
                        View Public Page
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/campaign-builder", {
                          state: {
                            eventId: event.id,
                            source: "public-my-events",
                            includeEventFee: false,
                          },
                        })
                      }
                      style={buttonGold}
                    >
                      Promote Event
                    </button>

                    {isMajorEvent && (
                      <button
                        type="button"
                        onClick={() => handleExtendMajorEvent(event.id)}
                        disabled={renewingEventId === event.id}
                        style={{
                          ...buttonGold,
                          opacity: renewingEventId === event.id ? 0.75 : 1,
                          cursor:
                            renewingEventId === event.id ? "wait" : "pointer",
                        }}
                      >
                        {renewingEventId === event.id
                          ? "Opening Checkout..."
                          : "Extend Major Event"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 20,
        background: "#ffffff",
        padding: 24,
        color: "#475569",
      }}
    >
      {children}
    </div>
  );
}

const buttonSecondary: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#0f172a",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 800,
  cursor: "pointer",
};

const buttonGold: React.CSSProperties = {
  border: "none",
  background: "#c8a96b",
  color: "#111318",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 900,
  cursor: "pointer",
};
