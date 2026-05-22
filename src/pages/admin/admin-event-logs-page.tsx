import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type EventLog = {
  id: string;
  event_id: string;
  event_code?: string | null;
  action_type: string;
  action_status: string;
  actor_user_id?: string | null;
  actor_role?: string | null;
  message?: string | null;
  error_detail?: string | null;
  metadata?: Record<string, any> | null;
  created_at?: string | null;
};

type AdminEvent = {
  id: string;
  title?: string | null;
  event_code?: string | null;
  status?: string | null;
  payment_status?: string | null;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

function getLogCategory(actionType?: string) {
  const value = String(actionType || "").toLowerCase();

  if (value.includes("payment") || value.includes("checkout") || value.includes("stripe")) {
    return "payment";
  }

  if (value.includes("approve") || value.includes("reject") || value.includes("review")) {
    return "moderation";
  }

  return "general";
}

function badgeStyle(actionStatus?: string, actionType?: string): React.CSSProperties {
  const category = getLogCategory(actionType);

  if (category === "payment") {
    return {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      background:
        actionStatus === "failed"
          ? "#fff1f2"
          : actionStatus === "success"
          ? "#eff6ff"
          : "#f8fafc",
      color:
        actionStatus === "failed"
          ? "#be123c"
          : actionStatus === "success"
          ? "#1d4ed8"
          : "#334155",
      border: `1px solid ${
        actionStatus === "failed"
          ? "#fecdd3"
          : actionStatus === "success"
          ? "#bfdbfe"
          : "#e2e8f0"
      }`,
    };
  }

  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    background:
      actionStatus === "failed"
        ? "#fff1f2"
        : actionStatus === "success"
        ? "#ecfdf3"
        : "#f8fafc",
    color:
      actionStatus === "failed"
        ? "#be123c"
        : actionStatus === "success"
        ? "#166534"
        : "#334155",
    border: `1px solid ${
      actionStatus === "failed"
        ? "#fecdd3"
        : actionStatus === "success"
        ? "#bbf7d0"
        : "#e2e8f0"
    }`,
  };
}

export default function AdminEventLogsPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPage() {
    if (!eventId) {
      setError("Missing event ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [eventRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/events/${eventId}`),
        fetch(`${API_BASE}/admin/events/${eventId}/logs`),
      ]);

      const eventData = await eventRes.json().catch(() => null);
      const logsData = await logsRes.json().catch(() => null);

      if (!eventRes.ok) {
        throw new Error(eventData?.error || "Failed to load event details.");
      }

      if (!logsRes.ok) {
        throw new Error(logsData?.error || "Failed to load event logs.");
      }

      setEvent(eventData);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error("Failed to load event logs page:", err);
      setError(err instanceof Error ? err.message : "Failed to load event logs.");
      setEvent(null);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, [eventId]);

  const paymentLogs = useMemo(
    () => logs.filter((log) => getLogCategory(log.action_type) === "payment"),
    [logs]
  );

  const moderationLogs = useMemo(
    () => logs.filter((log) => getLogCategory(log.action_type) === "moderation"),
    [logs]
  );

  const sectionStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
    background: "#fff",
  };

  const rowStyle: React.CSSProperties = {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "16px",
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "8px" }}>Event Activity Log</h1>
          <p style={{ margin: 0 }}>
            Review moderation and payment history for this event.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {eventId ? <Link to={`/admin/events/${eventId}`}>Back to Event</Link> : null}
          <Link to="/admin/events/pending">Pending Queue</Link>
          <Link to="/admin/events/rejected">Rejected Events</Link>
        </div>
      </div>

      <section style={{ ...sectionStyle, marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Event Summary</h2>

        {loading ? (
          <p>Loading event summary...</p>
        ) : error ? (
          <p>{error}</p>
        ) : !event ? (
          <p>Event not found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px 16px",
            }}
          >
            <div>
              <strong>Title:</strong> {event.title || "—"}
            </div>
            <div>
              <strong>Event Code:</strong> {event.event_code || "—"}
            </div>
            <div>
              <strong>Status:</strong> {event.status || "—"}
            </div>
            <div>
              <strong>Payment Status:</strong> {event.payment_status || "—"}
            </div>
            <div>
              <strong>Total Log Entries:</strong> {logs.length}
            </div>
            <div>
              <strong>Payment Logs:</strong> {paymentLogs.length}
            </div>
            <div>
              <strong>Moderation Logs:</strong> {moderationLogs.length}
            </div>
            <div>
              <strong>Event ID:</strong> {event.id || "—"}
            </div>
          </div>
        )}
      </section>

      <section style={{ ...sectionStyle, marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Payment Activity</h2>

        {loading ? (
          <p>Loading payment activity...</p>
        ) : paymentLogs.length === 0 ? (
          <p>No payment logs found for this event.</p>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {paymentLogs.map((log) => (
              <article key={log.id} style={rowStyle}>
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
                      {log.action_type || "payment_event"}
                    </h3>
                    <div style={badgeStyle(log.action_status, log.action_type)}>
                      {log.action_status || "info"}
                    </div>
                  </div>

                  <div style={{ color: "#475569" }}>
                    {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "10px 16px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <strong>Category:</strong> Payment
                  </div>
                  <div>
                    <strong>Actor Role:</strong> {log.actor_role || "system"}
                  </div>
                  <div>
                    <strong>Event Code:</strong> {log.event_code || "—"}
                  </div>
                  <div>
                    <strong>Log ID:</strong> {log.id || "—"}
                  </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>Message:</strong>
                  <div style={{ marginTop: "6px" }}>{log.message?.trim() || "—"}</div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>Error Detail:</strong>
                  <div style={{ marginTop: "6px", color: "#7f1d1d" }}>
                    {log.error_detail?.trim() || "—"}
                  </div>
                </div>

                <div>
                  <strong>Metadata:</strong>
                  <pre
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      overflowX: "auto",
                      fontSize: "13px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {JSON.stringify(log.metadata ?? {}, null, 2)}
                  </pre>
                </div>
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
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>All Activity Entries</h2>

          <button
            type="button"
            onClick={loadPage}
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

        {loading ? (
          <p>Loading event logs...</p>
        ) : error ? (
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
        ) : logs.length === 0 ? (
          <p>No log entries found for this event.</p>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {logs.map((log) => (
              <article key={log.id} style={rowStyle}>
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
                      {log.action_type || "event_action"}
                    </h3>
                    <div style={badgeStyle(log.action_status, log.action_type)}>
                      {log.action_status || "info"}
                    </div>
                  </div>

                  <div style={{ color: "#475569" }}>
                    {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "10px 16px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <strong>Category:</strong>{" "}
                    {getLogCategory(log.action_type).charAt(0).toUpperCase() +
                      getLogCategory(log.action_type).slice(1)}
                  </div>
                  <div>
                    <strong>Actor Role:</strong> {log.actor_role || "—"}
                  </div>
                  <div>
                    <strong>Actor User ID:</strong> {log.actor_user_id || "—"}
                  </div>
                  <div>
                    <strong>Event Code:</strong> {log.event_code || "—"}
                  </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>Message:</strong>
                  <div style={{ marginTop: "6px" }}>{log.message?.trim() || "—"}</div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>Error Detail:</strong>
                  <div style={{ marginTop: "6px", color: "#7f1d1d" }}>
                    {log.error_detail?.trim() || "—"}
                  </div>
                </div>

                <div>
                  <strong>Metadata:</strong>
                  <pre
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      overflowX: "auto",
                      fontSize: "13px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {JSON.stringify(log.metadata ?? {}, null, 2)}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
