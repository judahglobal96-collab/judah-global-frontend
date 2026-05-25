import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type ApprovedEvent = {
  id: string;
  event_code?: string | null;
  title: string;
  description?: string | null;
  event_type?: string | null;
  submitter_email?: string | null;
  status: string;
  featured: boolean;
  created_by_admin?: boolean | null;
  admin_seeded?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export default function AdminApprovedEventsPage() {
  const [events, setEvents] = useState<ApprovedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingFeaturedId, setSavingFeaturedId] = useState<string | null>(null);

  async function loadApprovedEvents() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/approved`,
        {
          credentials: 'include',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const rawText = await response.text();

      let data: ApprovedEvent[] = [];

      try {
        data = rawText ? JSON.parse(rawText) : [];
      } catch {
        data = [];
      }

      console.log("APPROVED EVENTS DATA", data);

      if (!response.ok) {
        throw new Error("Failed to load approved events.");
      }

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load approved events right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFeatured(
    eventId: string,
    currentFeatured: boolean
  ) {
    try {
      setSavingFeaturedId(eventId);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/${eventId}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            featured: !currentFeatured,
          }),
        }
      );

      const rawText = await response.text();

      let data: { success?: boolean; message?: string } = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      console.log("FEATURED TOGGLE RESPONSE", data);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update featured status.");
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, featured: !currentFeatured }
            : event
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update featured status.");
    } finally {
      setSavingFeaturedId(null);
    }
  }

  useEffect(() => {
    loadApprovedEvents();
  }, []);

  return (
    <div style={{ padding: "24px 28px" }}>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Approved Events
      </h1>

      <p
        style={{
          fontSize: "1.15rem",
          marginBottom: 24,
        }}
      >
        Review all events that have already been approved.
      </p>

      {loading && <p>Loading approved events...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && events.length === 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 24,
            background: "#fff",
          }}
        >
          <p>No approved events found.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div style={{ display: "grid", gap: 24 }}>
          {events.map((event) => {
            const isAdminSeeded =
              event.created_by_admin === true || event.admin_seeded === true;

            return (
              <div
                key={event.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 24,
                  padding: 28,
                  background: "#fff",
                }}
              >
                <h2
                  style={{
                    fontSize: "2.1rem",
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  {event.title}
                </h2>

                {event.description && (
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      marginBottom: 18,
                    }}
                  >
                    {event.description}
                  </p>
                )}

                <div
                  style={{
                    marginTop: 8,
                    marginBottom: 18,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    color: "#475467",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                  }}
                >
                  <div>
                    <strong style={{ color: "#111827" }}>Event Code:</strong>{" "}
                    {event.event_code || "—"}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <strong style={{ color: "#111827" }}>
                      Internal Event ID:
                    </strong>{" "}
                    {event.id}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "18px 28px",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>Type:</strong> {event.event_type || "—"}
                  </p>

                  <p style={{ margin: 0 }}>
                    <strong>Email:</strong> {event.submitter_email || "—"}
                  </p>

                  <p style={{ margin: 0 }}>
                    <strong>Status:</strong> {event.status}
                  </p>

                  <p style={{ margin: 0 }}>
                    <strong>Approved:</strong>{" "}
                    {event.updated_at
                      ? new Date(event.updated_at).toLocaleString()
                      : "—"}
                  </p>

                  <p style={{ margin: 0 }}>
                    <strong>Featured:</strong> {event.featured ? "Yes" : "No"}
                  </p>

                  <p style={{ margin: 0 }}>
                    <strong>Admin Seeded:</strong>{" "}
                    {isAdminSeeded ? "Yes" : "No"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 22,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: event.featured ? "#FEF3C7" : "#F3F4F6",
                      color: event.featured ? "#92400E" : "#374151",
                    }}
                  >
                    {event.featured ? "Featured" : "Standard"}
                  </span>

                  {isAdminSeeded && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        background: "#EDE9FE",
                        color: "#5B21B6",
                      }}
                    >
                      Admin Seeded
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleFeatured(event.id, event.featured)
                    }
                    disabled={savingFeaturedId === event.id}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor:
                        savingFeaturedId === event.id
                          ? "not-allowed"
                          : "pointer",
                      opacity: savingFeaturedId === event.id ? 0.7 : 1,
                      background: event.featured ? "#FEE2E2" : "#DCFCE7",
                      color: event.featured ? "#B91C1C" : "#166534",
                    }}
                  >
                    {savingFeaturedId === event.id
                      ? "Saving..."
                      : event.featured
                      ? "Remove Featured"
                      : "Mark Featured"}
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to={`/event/${event.id}`}
                    style={{
                      fontSize: "1rem",
                      textDecoration: "none",
                      color: "#111827",
                      fontWeight: 600,
                    }}
                  >
                    View Public Event
                  </Link>

                  <Link
                    to={`/admin/events/${event.id}/paid-promos`}
                    state={{ event }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #d0d5dd",
                      borderRadius: 12,
                      padding: "10px 16px",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Paid Promo Purchases
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
