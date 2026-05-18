import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

type PaidPromo = {
  id?: string;
  campaign_id?: string;
  campaign_name?: string;
  placement_type?: string;
  placement_date?: string;
  start_date?: string;
  quantity?: number;
  status?: string;
  region_code?: string;
  created_at?: string;
};

type LocationState = {
  event?: {
    id: string;
    title?: string;
    event_code?: string | null;
    event_paid_promos?: PaidPromo[];
    has_paid_featured_badge?: boolean;
    has_paid_hero?: boolean;
    has_paid_homepage_top?: boolean;
    has_paid_discovery_top?: boolean;
    has_paid_major_events?: boolean;
    has_paid_official_flyer?: boolean;
  };
};

function formatDate(date?: string | null) {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPlacementType(type?: string) {
  if (!type) return "Unknown Promo";

  const labels: Record<string, string> = {
    event_fee: "Event Fee",
    featured_badge: "Featured Badge",
    hero: "Homepage Hero",
    homepage_top: "Homepage Top Row",
    homepage_top_row: "Homepage Top Row",
    discovery_top: "Discovery Top Row",
    discovery_top_row: "Discovery Top Row",
    major_events: "Major Events",
    official_flyer: "Official Event Flyer",
  };

  return labels[type] || type.replaceAll("_", " ");
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
        borderRadius: 999,
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        border: active ? "1px solid #abefc6" : "1px solid #e5e7eb",
        background: active ? "#ecfdf3" : "#f8fafc",
        color: active ? "#027a48" : "#475467",
      }}
    >
      {active ? "✓ " : ""}
      {label}
    </span>
  );
}

export default function AdminPaidPromosPage() {
  const { eventId } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [eventTitle, setEventTitle] = useState(
    state.event?.title || "Approved Event"
  );
  const [paidPromos, setPaidPromos] = useState<PaidPromo[]>(
    Array.isArray(state.event?.event_paid_promos)
      ? state.event?.event_paid_promos || []
      : []
  );
  const [loading, setLoading] = useState(!state.event?.event_paid_promos);
  const [error, setError] = useState("");

  const paidFlags = {
    featuredBadge: Boolean(state.event?.has_paid_featured_badge),
    hero: Boolean(state.event?.has_paid_hero),
    homepageTop: Boolean(state.event?.has_paid_homepage_top),
    discoveryTop: Boolean(state.event?.has_paid_discovery_top),
    majorEvents: Boolean(state.event?.has_paid_major_events),
    officialFlyer: Boolean(state.event?.has_paid_official_flyer),
  };

  useEffect(() => {
    async function loadPaidPromos() {
      if (!eventId) return;

      try {
        setLoading(true);
        setError("");

    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `http://localhost:4000/api/v1/admin/events/${eventId}/paid-promos`,
  {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  }
);
        const rawText = await response.text();

        let data: any = {};
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load paid promos.");
        }

        setEventTitle(data?.event?.title || state.event?.title || "Approved Event");

        setPaidPromos(
          Array.isArray(data?.paidPromos)
            ? data.paidPromos
            : Array.isArray(data?.event_paid_promos)
            ? data.event_paid_promos
            : []
        );
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load paid promo purchases."
        );
      } finally {
        setLoading(false);
      }
    }

    if (!state.event?.event_paid_promos) {
      loadPaidPromos();
    } else {
      setLoading(false);
    }
  }, [eventId, state.event]);

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/admin/approved-events"
          style={{
            color: "#475467",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ← Back to Approved Events
        </Link>
      </div>

      <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 10 }}>
        Paid Promo Purchases
      </h1>

      <p style={{ fontSize: "1.15rem", color: "#475467", marginBottom: 28 }}>
        Review paid promotional products attached to this approved event.
      </p>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 28,
          background: "#ffffff",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}>
          {eventTitle}
        </h2>

        <p style={{ color: "#475467", fontWeight: 700, marginBottom: 22 }}>
          Event ID: {eventId || "—"}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <PromoPill label="Featured Badge" active={paidFlags.featuredBadge} />
          <PromoPill label="Homepage Hero" active={paidFlags.hero} />
          <PromoPill label="Homepage Top Row" active={paidFlags.homepageTop} />
          <PromoPill label="Discovery Top Row" active={paidFlags.discoveryTop} />
          <PromoPill label="Major Events" active={paidFlags.majorEvents} />
          <PromoPill label="Official Event Flyer" active={paidFlags.officialFlyer} />
        </div>
      </section>

      {loading && <p>Loading paid promo purchases...</p>}

      {error && (
        <div
          style={{
            border: "1px solid #fecdca",
            background: "#fef3f2",
            color: "#b42318",
            borderRadius: 16,
            padding: 16,
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && paidPromos.length === 0 && (
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 28,
            background: "#ffffff",
          }}
        >
          <p style={{ color: "#475467", fontWeight: 700 }}>
            No paid promo purchases were found for this event.
          </p>
        </section>
      )}

      {!loading && !error && paidPromos.length > 0 && (
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 28,
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 18 }}>
            Purchase Details
          </h2>

          <div style={{ display: "grid", gap: 0 }}>
            {paidPromos.map((promo, index) => (
              <div
                key={promo.id || `${promo.placement_type}-${index}`}
                style={{
                  padding: "18px 0",
                  borderTop: index === 0 ? "none" : "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    margin: "0 0 8px",
                  }}
                >
                  {formatPlacementType(promo.placement_type)}
                </h3>

                <p style={{ margin: "0 0 6px", color: "#475467" }}>
                  Date: {formatDate(promo.placement_date || promo.start_date)} ·
                  Quantity: {promo.quantity ?? 1} · Status:{" "}
                  {promo.status || "paid"}
                </p>

                <p style={{ margin: 0, color: "#475467" }}>
                  Campaign: {promo.campaign_name || promo.campaign_id || "—"}
                  {promo.region_code ? ` · Region: ${promo.region_code}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}