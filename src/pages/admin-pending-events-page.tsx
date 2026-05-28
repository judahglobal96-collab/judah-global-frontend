import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PendingEvent = {
  id: string;
  event_code?: string | null;
  title: string;
  description?: string | null;
  event_type?: string | null;
  submitter_email?: string | null;
  status?: string | null;
  created_at?: string | null;
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

function normalizePendingEvents(data: any): PendingEvent[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.pendingEvents)) return data.pendingEvents;
  return [];
}

export default function AdminPendingEventsPage() {
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPendingEvents() {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Admin token missing. Please log in again.");
      }

      const response = await fetch(`${API_BASE}/admin/events/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to load pending events: ${response.status}`
        );
      }

      setEvents(normalizePendingEvents(data));
    } catch (err) {
      console.error("Failed to load pending events:", err);
      setError(err instanceof Error ? err.message : "Failed to load pending events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingEvents();
  }, []);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading pending events...</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Pending Events</h1>
          <p>Review event submissions awaiting admin approval.</p>
        </div>

        <button
          type="button"
          onClick={loadPendingEvents}
          style={{
            border: "1px solid #ccc",
            background: "#fff",
            borderRadius: 10,
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
            marginBottom: 16,
            padding: "12px 14px",
            borderRadius: 10,
            background: "#fff4f4",
            border: "1px solid #f2caca",
            color: "#8a1f1f",
          }}
        >
          {error}
        </div>
      ) : null}

      {events.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {events.map((event) => (
            <article
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
              }}
            >
              <h2>{event.title}</h2>

              {event.description ? <p>{event.description}</p> : null}

              <p>
                <strong>Event Code:</strong> {event.event_code || "—"}
              </p>
              <p>
                <strong>Type:</strong> {event.event_type || "—"}
              </p>
              <p>
                <strong>Email:</strong> {event.submitter_email || "—"}
              </p>
              <p>
                <strong>Status:</strong> {event.status || "—"}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {event.created_at
                  ? new Date(event.created_at).toLocaleString()
                  : "—"}
              </p>

              <Link to={`/admin/events/${event.id}`}>Review Event</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}