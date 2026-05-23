import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type AdminEvent = {
  id: string;
  title: string;
  description?: string | null;
  event_type?: string | null;
  submitter_email?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function AdminOverviewPage() {
  const navigate = useNavigate();

  const [pendingEvents, setPendingEvents] = useState<AdminEvent[]>([]);
  const [rejectedEvents, setRejectedEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingError, setPendingError] = useState("");
  const [rejectedError, setRejectedError] = useState("");
  const [lookupQuery, setLookupQuery] = useState("");

  async function loadDashboardData() {
    try {
      setLoading(true);
      setPendingError("");
      setRejectedError("");

      const [pendingRes, rejectedRes] = await Promise.all([
        fetch(`${API_BASE}/admin/events/pending`),
        fetch(`${API_BASE}/admin/events/rejected`),
      ]);

      const pendingData = await pendingRes.json();
      const rejectedData = await rejectedRes.json();

      if (!pendingRes.ok) {
        throw new Error(
          pendingData?.error || `Pending request failed with status ${pendingRes.status}`
        );
      }

      if (!rejectedRes.ok) {
        throw new Error(
          rejectedData?.error || `Rejected request failed with status ${rejectedRes.status}`
        );
      }

      setPendingEvents(Array.isArray(pendingData) ? pendingData : []);
      setRejectedEvents(Array.isArray(rejectedData) ? rejectedData : []);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      const message =
        err instanceof Error ? err.message : "Failed to load admin dashboard data.";

      setPendingError(message);
      setRejectedError(message);
      setPendingEvents([]);
      setRejectedEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLookupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = lookupQuery.trim();

    if (!trimmedQuery) {
      alert("Enter an Event ID, sponsor/org name, sponsor email, or event title.");
      return;
    }

    navigate(`/admin/support-lookup?q=${encodeURIComponent(trimmedQuery)}`);
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "18px",
    background: "#fff",
  };

  const sectionStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
    background: "#fff",
  };

  const articleStyle: React.CSSProperties = {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "16px",
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Event moderation and platform management.</p>

      <form
        onSubmit={handleLookupSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          border: "1px solid #E5C07B",
          borderRadius: 14,
          background: "#FFFBEB",
          marginTop: 24,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            color: "#111827",
            whiteSpace: "nowrap",
          }}
        >
          Event / Sponsor Lookup:
        </span>

        <input
          type="text"
          value={lookupQuery}
          onChange={(event) => setLookupQuery(event.target.value)}
          placeholder="Search Event ID, Sponsor Name, Email, or Event Title"
          style={{
            minWidth: 360,
            flex: "1 1 360px",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #D1D5DB",
            fontSize: "0.95rem",
            background: "#ffffff",
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            background: "#111827",
            color: "#ffffff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
          marginBottom: "28px",
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px" }}>
            Pending Review
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>
            {loading ? "..." : pendingEvents.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px" }}>
            Rejected Events
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>
            {loading ? "..." : rejectedEvents.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px" }}>
            Quick Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link to="/admin/pending-events">Open Pending Queue</Link>
            <Link to="/admin/rejected">Open Rejected Events</Link>
            <Link to="/admin/approved-events">Open Approved Events</Link>
            <Link to="/events">View Public Events</Link>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <section style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>Pending Review Queue</h2>
            <Link to="/admin/events/pending">View Full Queue</Link>
          </div>

          {pendingError ? <p>{pendingError}</p> : null}

          {loading ? (
            <p>Loading pending events...</p>
          ) : pendingEvents.length === 0 ? (
            <p>No pending events right now.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {pendingEvents.slice(0, 5).map((event) => (
                <article key={event.id} style={articleStyle}>
                  <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                    {event.title}
                  </h3>

                  {event.description ? <p>{event.description}</p> : null}

                  <div style={{ display: "grid", gap: "6px", marginBottom: "12px" }}>
                    <div>
                      <strong>Event ID:</strong> {event.id}
                    </div>
                    <div>
                      <strong>Type:</strong> {event.event_type || "—"}
                    </div>
                    <div>
                      <strong>Submitter Email:</strong> {event.submitter_email || "—"}
                    </div>
                    <div>
                      <strong>Status:</strong> {event.status || "—"}
                    </div>
                    <div>
                      <strong>Created:</strong> {event.created_at || "—"}
                    </div>
                  </div>

                  <Link to={`/admin/events/${event.id}`}>Review Event</Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>Rejected Events</h2>
            <Link to="/admin/events/rejected">View Rejected Events</Link> 
          </div>

          {rejectedError ? <p>{rejectedError}</p> : null}

          {loading ? (
            <p>Loading rejected events...</p>
          ) : rejectedEvents.length === 0 ? (
            <p>No rejected events right now.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {rejectedEvents.slice(0, 5).map((event) => (
                <article key={event.id} style={articleStyle}>
                  <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                    {event.title}
                  </h3>

                  {event.description ? <p>{event.description}</p> : null}

                  <div style={{ display: "grid", gap: "6px", marginBottom: "12px" }}>
                    <div>
                      <strong>Event ID:</strong> {event.id}
                    </div>
                    <div>
                      <strong>Type:</strong> {event.event_type || "—"}
                    </div>
                    <div>
                      <strong>Submitter Email:</strong> {event.submitter_email || "—"}
                    </div>
                    <div>
                      <strong>Status:</strong> {event.status || "—"}
                    </div>
                    <div>
                      <strong>Rejected At:</strong>{" "}
                      {event.rejected_at || event.updated_at || "—"}
                    </div>
                    <div>
                      <strong>Reason:</strong> {event.rejection_reason || "—"}
                    </div>
                  </div>

                  <Link to={`/admin/events/${event.id}`}>View Event</Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
