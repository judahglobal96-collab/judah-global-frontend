import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type PaidPromo = {
  campaign_id: string;
  campaign_name: string | null;
  placement_type: string;
  placement_date: string | null;
  quantity: number | null;
  status: string | null;
};

type AdminEvent = {
  id: string;
  event_code: string | null;
  title: string;
  description: string;
  event_type: string;
  submitter_email: string;
  status: string;
  payment_status?: string | null;
  featured?: boolean | null;
  created_at: string;
  updated_at?: string | null;

  schedule_timezone?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;

  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  is_virtual?: boolean | null;

  sponsor_name?: string | null;
  sponsor_logo_url?: string | null;

  has_paid_featured_badge?: boolean;
  has_paid_hero?: boolean;
  has_paid_homepage_top?: boolean;
  has_paid_discovery_top?: boolean;
  has_paid_major_events?: boolean;
  has_paid_official_flyer?: boolean;

  paid_promos?: PaidPromo[];
};

export default function AdminEventReviewPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function loadEvent() {
    try {
      setLoading(true);

      const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/${eventId}`,
        {
          credentials: 'include',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );
      
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load event.");
      }

      setEvent({
        ...data,
        paid_promos: Array.isArray(data?.paid_promos) ? data.paid_promos : [],
      });
    } catch (error) {
      console.error("Failed to load event:", error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    try {
      setWorking(true);

          const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/${eventId}/approve`,
      {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );
      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to approve event right now."
        );
      }

      navigate("/admin/events/pending");
    } catch (error) {
      console.error("Approve failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to approve event right now."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleReject() {
    try {
      setWorking(true);

          const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/events/${eventId}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );
      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to reject event right now."
        );
      }

      navigate("/admin/events/rejected");
    } catch (error) {
      console.error("Reject failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to reject event right now."
      );
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 32 }}>Loading event...</div>;
  }

  if (!event) {
    return <div style={{ padding: 32 }}>Event not found.</div>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 980 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 8 }}>Admin Event Review</h1>
          <p style={{ margin: 0, color: "#475569" }}>
            Review event details, paid promotional purchases, and moderation
            actions.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/events/pending">Back to Pending Queue</Link>
          <Link to={`/admin/events/${event.id}/logs`}>View Event Logs</Link>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
          background: "#fff",
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <strong>Title:</strong> {event.title}
        </div>

        <div>
          <strong>Event Code:</strong> {event.event_code || "—"}
        </div>

        <div>
          <strong>Description:</strong> {event.description}
        </div>

        <div>
          <strong>Event Type:</strong> {event.event_type}
        </div>

        <div>
          <strong>Submitter Email:</strong> {event.submitter_email}
        </div>

        <div>
          <strong>Status:</strong> {event.status}
        </div>

        <div>
          <strong>Payment Status:</strong> {event.payment_status || "—"}
        </div>

        <div>
          <strong>Legacy Featured Flag:</strong>{" "}
          {event.featured ? "true" : "false"}
        </div>

        <div>
          <strong>Submitted:</strong>{" "}
          {event.created_at ? new Date(event.created_at).toLocaleString() : "—"}
        </div>

        <div
          style={{
            marginTop: 8,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <strong>Paid Promo Purchases:</strong>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PromoPill
              label="Featured Badge"
              active={Boolean(event.has_paid_featured_badge)}
            />
            <PromoPill
              label="Homepage Hero"
              active={Boolean(event.has_paid_hero)}
            />
            <PromoPill
              label="Homepage Top Row"
              active={Boolean(event.has_paid_homepage_top)}
            />
            <PromoPill
              label="Discovery Top Row"
              active={Boolean(event.has_paid_discovery_top)}
            />
            <PromoPill
              label="Major Events"
              active={Boolean(event.has_paid_major_events)}
              />
              <PromoPill
              label="Official Event Flyer"
              active={Boolean(event.has_paid_official_flyer)}

            />
          </div>

          {Array.isArray(event.paid_promos) && event.paid_promos.length > 0 ? (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#fafafa",
                display: "grid",
                gap: 10,
              }}
            >
              {event.paid_promos.map((promo, index) => (
                <div
                  key={`${promo.campaign_id}-${promo.placement_type}-${index}`}
                  style={{
                    paddingBottom: 10,
                    borderBottom:
                      index === event.paid_promos!.length - 1
                        ? "none"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{promo.placement_type}</div>

                  <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>
                    Date:{" "}
                    {promo.placement_date
                      ? new Date(promo.placement_date).toLocaleDateString()
                      : "—"}{" "}
                    · Quantity: {promo.quantity ?? 1} · Status:{" "}
                    {promo.status || "—"}
                  </div>

                  <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>
                    Campaign: {promo.campaign_name || promo.campaign_id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#475569" }}>No paid promo purchases found.</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleApprove}
            disabled={working}
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#111827",
              color: "#fff",
            }}
          >
            {working ? "Working..." : "Approve Event"}
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={working}
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            {working ? "Working..." : "Reject Event"}
          </button>

          <Link
            to={`/admin/event/${event.id}/logs`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 18px",
              borderRadius: 8,
              border: "1px solid #ccc",
              textDecoration: "none",
              color: "#111827",
              background: "#fff",
            }}
          >
            View Event Logs
          </Link>
        </div>
      </div>
    </div>
  );
}

function PromoPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 13,
        border: active ? "1px solid #abefc6" : "1px solid #e5e7eb",
        background: active ? "#ecfdf3" : "#f8fafc",
        color: active ? "#027a48" : "#475569",
      }}
    >
      {active ? "✓ " : ""}
      {label}
    </span>
  );
}
