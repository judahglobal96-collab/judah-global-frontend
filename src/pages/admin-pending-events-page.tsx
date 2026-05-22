import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PendingEvent = {
  id: string;
  event_code: string;
  title: string;
  description: string;
  event_type: string;
  submitter_email: string;
  status: string;
  created_at: string;
};

export default function AdminPendingEventsPage() {
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingEvents();
  }, []);

  async function loadPendingEvents() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/pending`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load pending events:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 32 }}>Loading pending events...</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Pending Events</h1>

      {events.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
              }}
            >
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Type:</strong> {event.event_type}</p>
              <p><strong>Email:</strong> {event.submitter_email}</p>
              <p><strong>Status:</strong> {event.status}</p>
              <p><strong>Submitted:</strong> {new Date(event.created_at).toLocaleString()}</p>

              <Link to={`/admin/events/${event.id}`}>Review Event</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
