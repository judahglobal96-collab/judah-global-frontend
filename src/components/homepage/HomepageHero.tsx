import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getSupportRegion } from "../../utils/region";

type HeroPromoItem = {
  placement_type?: string;
  placement_date?: string;
  event_id?: string;
  event_code?: string;
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

type FallbackHero = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
  badge?: string;
};

const fallbackHeroes: FallbackHero[] = [
  {
    id: "homepage-hero-1",
    title: "Homepage Hero Slot 1",
    subtitle: "Premium homepage visibility",
    body:
      "This premium hero placement is designed for campaign promotions, featured outreach, and high-visibility sponsored content.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Featured Placement",
  },
  {
    id: "homepage-hero-2",
    title: "Homepage Hero Slot 2",
    subtitle: "Premium homepage visibility",
    body:
      "This second hero placement gives sponsors premium exposure without hiding visibility behind rotation or autoplay.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Featured Placement",
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

function buildLocation(hero: HeroPromoItem) {
  return [hero.city, hero.state_region, cleanCountry(hero.country)]
    .filter(Boolean)
    .join(", ");
}

function getHeroImageUrl(hero: HeroPromoItem) {
  return (
    resolveMediaUrl(hero.media_url) ||
    resolveMediaUrl(hero.imageUrl) ||
    resolveMediaUrl(hero.display_image_url) ||
    ""
  );
}

function LiveHeroCard({ hero, index }: { hero: HeroPromoItem; index: number }) {
  const dateLabel = formatDate(hero.starts_at_utc);
  const locationLabel = buildLocation(hero);
  const to = hero.event_id ? `/event/${hero.event_id}` : "/events";
  const heroImageUrl = getHeroImageUrl(hero);

  return (
    <div
      style={{
        borderRadius: 24,
        overflow: "hidden",
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: 300,
        display: "grid",
        gridTemplateColumns: heroImageUrl ? "1.1fr 1fr" : "1fr",
      }}
    >
      {heroImageUrl ? (
        <div
          style={{
            minHeight: 300,
            backgroundImage: `linear-gradient(rgba(17,24,39,0.28), rgba(17,24,39,0.42)), url(${heroImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : null}

      <div
        style={{
          padding: "32px 28px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <div
            style={{
              display: "inline-block",
              marginBottom: 12,
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              background: "rgba(255,255,255,0.10)",
              color: "#e9d5ff",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            Hero Placement {index + 1}
          </div>

          <h3
            style={{
              margin: 0,
              marginBottom: 10,
              fontSize: "2rem",
              lineHeight: 1.1,
            }}
          >
            {hero.title || `Homepage Hero Slot ${index + 1}`}
          </h3>

          <p
            style={{
              margin: 0,
              marginBottom: 10,
              color: "#c4b5fd",
              fontWeight: 700,
            }}
          >
            {hero.is_featured
              ? "Featured visibility"
              : "Premium homepage visibility"}
          </p>

          <p
            style={{
              margin: 0,
              marginBottom: 20,
              lineHeight: 1.8,
              color: "#e5e7eb",
              maxWidth: 680,
            }}
          >
            {[
              hero.sponsor_name ? `Sponsored by ${hero.sponsor_name}` : "",
              dateLabel,
              locationLabel,
            ]
              .filter(Boolean)
              .join(" • ") || "Premium homepage hero placement."}
          </p>

          <Link
            to={to}
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#ffffff",
              color: "#111827",
              padding: "13px 18px",
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
}

function FallbackHeroCard({ hero }: { hero: FallbackHero }) {
  return (
    <div
      style={{
        borderRadius: 24,
        padding: "32px 28px",
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: 240,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 760 }}>
        {hero.badge ? (
          <div
            style={{
              display: "inline-block",
              marginBottom: 12,
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              background: "rgba(255,255,255,0.10)",
              color: "#e9d5ff",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            {hero.badge}
          </div>
        ) : null}

        <h3
          style={{
            margin: 0,
            marginBottom: 10,
            fontSize: "2rem",
            lineHeight: 1.1,
          }}
        >
          {hero.title}
        </h3>

        <p
          style={{
            margin: 0,
            marginBottom: 10,
            color: "#c4b5fd",
            fontWeight: 700,
          }}
        >
          {hero.subtitle}
        </p>

        <p
          style={{
            margin: 0,
            marginBottom: 20,
            lineHeight: 1.8,
            color: "#e5e7eb",
            maxWidth: 680,
          }}
        >
          {hero.body}
        </p>

        <Link
          to={hero.ctaTo}
          style={{
            display: "inline-block",
            textDecoration: "none",
            background: "#ffffff",
            color: "#111827",
            padding: "13px 18px",
            borderRadius: 12,
            fontWeight: 800,
          }}
        >
          {hero.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageHero() {
  const [liveHeroes, setLiveHeroes] = useState<HeroPromoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepagePromos() {
      try {
        setLoading(true);

    const region = getSupportRegion(); // later replace with selected/active region context

    const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/homepage-promos?region=${encodeURIComponent(region)}`
);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

      console.log("HOMEPAGE PROMO REGION REQUEST:", region);
      console.log("HOMEPAGE PROMO RESPONSE:", data);

        const resolvedHero = Array.isArray(data?.hero) ? data.hero : [];
        setLiveHeroes(resolvedHero);
      } catch (error) {
        console.error("Failed to load homepage hero promos:", error);
        setLiveHeroes([]);
      } finally {
        setLoading(false);
      }
    }

    loadHomepagePromos();
  }, []);

  const displayHeroes = useMemo(() => {
    if (liveHeroes.length > 0) return liveHeroes.slice(0, 2);
    return [];
  }, [liveHeroes]);

  if (loading) {
    return (
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
              color: "#7c3aed",
            }}
          >
            Sponsored Placement
          </p>

          <h2 style={{ margin: 0, marginBottom: 8 }}>Homepage Hero Promo</h2>

          <p
            style={{
              margin: 0,
              color: "#475569",
              lineHeight: 1.7,
              maxWidth: 760,
            }}
          >
            Loading homepage hero placements...
          </p>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          {fallbackHeroes.map((hero) => (
            <FallbackHeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      </section>
    );
  }

  return (
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
            color: "#7c3aed",
          }}
        >
          Sponsored Placement
        </p>

        <h2 style={{ margin: 0, marginBottom: 8 }}>Homepage Hero Promo</h2>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.7,
            maxWidth: 760,
          }}
        >
          {displayHeroes.length > 0
            ? "Live homepage hero placements powered by active paid campaign inventory."
            : "Two premium homepage hero placements rendered directly on the page."}
        </p>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {displayHeroes.length > 0
          ? displayHeroes.map((hero, index) => (
              <LiveHeroCard
                key={hero.event_id || `hero-${index}`}
                hero={hero}
                index={index}
              />
            ))
          : fallbackHeroes.map((hero) => (
              <FallbackHeroCard key={hero.id} hero={hero} />
            ))}
      </div>
    </section>
  );
}
