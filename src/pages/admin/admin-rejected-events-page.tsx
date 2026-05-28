import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type RejectedEvent = {
  id: string;
  event_code?: string | null;
  title: string;
  description?: string | null;
  event_type?: string | null;
  submitter_email?: string | null;
  status?: string | null;
  payment_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  rejected_at?: string | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

function getAuthToken() {
  return (
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function normalizeRejectedEvents(data: any): RejectedEvent[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.rejectedEvents)) return data.rejectedEvents;
  return [];
}

export default function AdminRejectedEventsPage() {
  const [events, setEvents] = useState<RejectedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRejectedEvents() {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Admin token missing. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/admin/events/rejected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${res.status}`
        );
      }

      setEvents(normalizeRejectedEvents(data));
    } catch (err) {
      console.error("Failed to load rejected events:", err);
      setError(err instanceof Error ? err.message : "Failed to load rejected events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRejectedEvents();
  }, []);

  const pageStyle: React.CSSProperties = {
    padding: "40px",
    maxWidth: "1100px",
    margin: "0 auto",
  };

  const sectionStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
    background: "#fff",
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "16px",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    background: "#fdeaea",
    color: "#a12626",
    border: "1px solid #f5c2c2",
  };

  return (
    <main style={pageStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "8px" }}>Rejected Events</h1>
          <p style={{ margin: 0 }}>
            Review all rejected submissions and their rejection details.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin/overview">Back to Dashboard</Link>
          <Link to="/admin/pending-events">Open Pending Queue</Link>
        </div>
      </div>

      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>Rejected Event Queue</h2>

          <button
            type="button"
            onClick={loadRejectedEvents}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: "10px",
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fff4f4",
              border: "1px solid #f2caca",
              color: "#8a1f1f",
            }}
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <p>Loading rejected events...</p>
        ) : events.length === 0 ? (
          <p>No rejected events found.</p>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {events.map((event) => (
              <article key={event.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
                      {event.title}
                    </h3>
                    <div style={badgeStyle}>{event.status || "rejected"}</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <Link to={`/admin/events/${event.id}`}>View Event</Link>
                  </div>
                </div>

                {event.description ? (
                  <p style={{ marginTop: 0 }}>{event.description}</p>
                ) : null}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "10px 16px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <strong>Event Code:</strong> {event.event_code || "—"}
                  </div>
                  <div>
                    <strong>Type:</strong> {event.event_type || "—"}
                  </div>
                  <div>
                    <strong>Submitter Email:</strong>{" "}
                    {event.submitter_email || "—"}
                  </div>
                  <div>
                    <strong>Payment Status:</strong> {event.payment_status || "—"}
                  </div>
                  <div>
                    <strong>Created:</strong> {event.created_at || "—"}
                  </div>
                  <div>
                    <strong>Updated:</strong> {event.updated_at || "—"}
                  </div>
                  <div>
                    <strong>Rejected At:</strong> {event.rejected_at || "—"}
                  </div>
                  <div>
                    <strong>Rejected By:</strong> {event.rejected_by || "—"}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #f1f1f1",
                    paddingTop: "12px",
                  }}
                >
                  <strong>Rejection Reason:</strong>
                  <div style={{ marginTop: "6px" }}>
                    {event.rejection_reason?.trim() ||
                      "No rejection reason recorded."}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}