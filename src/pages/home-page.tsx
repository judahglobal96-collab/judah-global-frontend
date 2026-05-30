import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import HomepageHero from "../components/homepage/HomepageHero";
import { getSupportRegion } from "../utils/region";


const topRowFallbackImage = "/images/judah-default-fallback.png";

type HomepagePromoItem = {
  placement_type?: string;
  placement_date?: string;
  event_id?: string;
  title?: string;
  starts_at_utc?: string;
  ends_at_utc?: string;
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  media_url?: string | null;
  imageUrl?: string | null;
  display_image_url?: string | null;
  is_featured?: boolean;
  sponsor_name?: string | null;
};

type TopRowPromo = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
  badge?: string;
  imageUrl?: string;
};

const fallbackTopRowPromos: TopRowPromo[] = [
  {
    id: "top-row-1",
    title: "Homepage Top Row Placement 1",
    body:
      "Top row promotional placement for events, campaigns, announcements, or sponsor media.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
    imageUrl: topRowFallbackImage,
  },
  {
    id: "top-row-2",
    title: "Homepage Top Row Placement 2",
    body:
      "Designed for homepage campaign exposure with simple CTA-driven visibility.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
    imageUrl: topRowFallbackImage,
  },
  {
    id: "top-row-3",
    title: "Homepage Top Row Placement 3",
    body:
      "Reserved for active paid homepage top-row promotional inventory.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
    imageUrl: topRowFallbackImage,
  },
];

function formatDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cleanCountry(country?: string | null) {
  if (!country) return "";
  const trimmed = country.trim().toLowerCase();
  if (trimmed === "united states" || trimmed === "united states of america") {
    return "USA";
  }
  return country;
}

function resolveMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${import.meta.env.VITE_API_BASE_URL}${normalized}`;
}

function buildPromoBody(promo: HomepagePromoItem) {
  const dateLabel = formatDate(promo.starts_at_utc);
  const location = [promo.city, promo.state_region, cleanCountry(promo.country)]
    .filter(Boolean)
    .join(", ");

  const parts = [
    promo.sponsor_name ? `Sponsored by ${promo.sponsor_name}` : "",
    dateLabel,
    location,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(" • ")
    : "Top row promotional placement for events, campaigns, announcements, or sponsor media.";
}

function getPromoImageUrl(
  promo: HomepagePromoItem | TopRowPromo,
  isLive: boolean
): string {
  if (isLive) {
    const livePromo = promo as HomepagePromoItem;
    return (
      resolveMediaUrl(livePromo.media_url) ||
      resolveMediaUrl(livePromo.imageUrl) ||
      resolveMediaUrl(livePromo.display_image_url) ||
      topRowFallbackImage
    );
  }

  const staticPromo = promo as TopRowPromo;
  return staticPromo.imageUrl || topRowFallbackImage;
}

function HomepageTopRowCard({
  promo,
  isLive = false,
}: {
  promo: TopRowPromo | HomepagePromoItem;
  isLive?: boolean;
}) {
  const livePromo = promo as HomepagePromoItem;
  const staticPromo = promo as TopRowPromo;

  const title = isLive
    ? livePromo.title || "Homepage Top Row Placement"
    : staticPromo.title;

  const body = isLive ? buildPromoBody(livePromo) : staticPromo.body;

  const ctaTo =
    isLive && livePromo.event_id
      ? `/event/${livePromo.event_id}`
      : staticPromo.ctaTo;

  const ctaLabel = isLive ? "View Event" : staticPromo.ctaLabel;

  const badge = isLive
    ? livePromo.is_featured
      ? "Featured Top Row"
      : "Top Row"
    : staticPromo.badge;

  const imageUrl = getPromoImageUrl(promo, isLive);

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <div
          style={{
            width: "100%",
            height: 200,
            overflow: "hidden",
            background: "#f1f5f9",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = topRowFallbackImage;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          padding: 22,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {badge ? (
          <div
            style={{
              alignSelf: "flex-start",
              marginBottom: 12,
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              background: "#dbeafe",
              color: "#1d4ed8",
            }}
          >
            {badge}
          </div>
        ) : null}

        <h3 style={{ margin: 0, marginBottom: 10 }}>{title}</h3>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          {body}
        </p>

        <Link
          to={ctaTo}
          style={{
            marginTop: 16,
            color: "#1d4ed8",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [liveTopRow, setLiveTopRow] = useState<HomepagePromoItem[]>([]);
  const [loadingTopRow, setLoadingTopRow] = useState(true);

  useEffect(() => {
    async function loadHomepagePromos() {
      try {
  const region = getSupportRegion(); // TEMP for P0.3

  const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/homepage-promos?region=${encodeURIComponent(region)}`
);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setLiveTopRow(Array.isArray(data?.topRow) ? data.topRow : []);
      } catch (error) {
        console.error("Failed to load homepage promos:", error);
        setLiveTopRow([]);
      } finally {
        setLoadingTopRow(false);
      }
    }

    loadHomepagePromos();
  }, []);

  const displayTopRow = useMemo(() => {
    const live = liveTopRow.slice(0, 3);

    if (live.length === 3) return live;
    if (live.length === 0) return fallbackTopRowPromos;

    const remaining = fallbackTopRowPromos.slice(0, 3 - live.length);
    return [...live, ...remaining];
  }, [liveTopRow]);

    let isAdmin = false;

    try {
      const user = JSON.parse(localStorage.getItem("judah_user") || "null");

      isAdmin = ["admin", "sysadmin", "execsysadmin"].includes(
        user?.role
      );
    } catch {
      isAdmin = false;
    }

  return (
    <div style={{ display: "grid", gap: 28 }}>

    {/* Regional Support Selector (admin only) */}
      {isAdmin && (
  <div
    style={{
      background: "#fff7ed",
      border: "1px solid #fdba74",
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 600,
    }}
  >
    <span>
      Support Region: <strong>{localStorage.getItem("judah_support_region") || "United States"}</strong>
    </span>
    
    <select
      defaultValue={
        localStorage.getItem("judah_support_region") || "United States"
      }
      onChange={(e) => {
        localStorage.setItem("judah_support_region", e.target.value);
        window.location.reload();
      }}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #cbd5f5",
      }}
    >
      <option value="United States">United States</option>
      <option value="Canada">Canada</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Africa">Africa</option>
    </select>
  </div>
)}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#475569",
              }}
            >
              Judah Global
            </p>

            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                color: "#0f172a",
              }}
            >
              Explore, promote, and expand your event visibility
            </h2>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              Discover faith-based events, access Major Events, and create an
              official organization presence on Judah Global.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/events"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#0f172a",
                padding: "14px 20px",
                borderRadius: 12,
                fontWeight: 800,
                border: "1px solid #d1d5db",
              }}
            >
              Explore Events
            </Link>

            <Link
              to="/major-events"
              style={{
                textDecoration: "none",
                background: "#0f172a",
                color: "#ffffff",
                padding: "14px 20px",
                borderRadius: 12,
                fontWeight: 800,
                border: "1px solid #0f172a",
              }}
            >
              Major Events
            </Link>

            <Link
              to="/register-organization"
              style={{
                textDecoration: "none",
                background: "#c084fc",
                color: "#0f172a",
                padding: "14px 20px",
                borderRadius: 12,
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Register Your Organization
            </Link>
          </div>
        </div>
      </section>

      <HomepageHero />

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563eb",
            }}
          >
            Sponsored Placement
          </p>

          <h2 style={{ margin: 0, marginBottom: 8 }}>Homepage Top Row</h2>

          <p
            style={{
              margin: 0,
              color: "#475569",
              lineHeight: 1.7,
              maxWidth: 760,
            }}
          >
            {liveTopRow.length > 0
              ? "Live homepage top-row placements powered by active paid campaign inventory."
              : "Three top-row promotional placements for paid homepage visibility."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {displayTopRow.map((promo, index) => {
            const isLivePromo =
              typeof (promo as HomepagePromoItem).event_id === "string" &&
              Boolean((promo as HomepagePromoItem).event_id);

            return (
              <HomepageTopRowCard
                key={
                  isLivePromo
                    ? (promo as HomepagePromoItem).event_id ||
                      `live-top-row-${index}`
                    : (promo as TopRowPromo).id
                }
                promo={promo}
                isLive={isLivePromo}
              />
            );
          })}
        </div>

        {loadingTopRow ? (
          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Loading homepage top-row placements...
          </p>
        ) : null}
      </section>
    </div>
  );
}
