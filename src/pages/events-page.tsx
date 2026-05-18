import EventCard, { type EventCardItem } from "../components/events/EventCard";

type DiscoveryPromo = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
  badge?: string;
};

const sampleEvents: EventCardItem[] = [
  {
    id: "sample-global-worship-revival",
    title: "Global Worship Revival",
    city: "Dallas",
    state_region: "Texas",
    country: "USA",
    venue_name: "Glory Center Arena",
    starts_at_utc: "2026-05-12T19:00:00Z",
    ends_at_utc: "2026-05-12T22:00:00Z",
    sponsor_name: "Bread of Life Ministries",
    status: "approved",
    is_featured: true,
    description:
      "A global evening of worship, prayer, and spiritual renewal bringing believers together from across the region.",
  },
  {
    id: "sample-kingdom-leadership-conference",
    title: "Kingdom Leadership Conference",
    city: "Atlanta",
    state_region: "Georgia",
    country: "USA",
    venue_name: "Covenant Leadership Hall",
    starts_at_utc: "2026-06-04T17:30:00Z",
    ends_at_utc: "2026-06-04T21:30:00Z",
    sponsor_name: "Kingdom Builders Fellowship",
    status: "approved",
    is_major_event: true,
    description:
      "Leadership-focused gathering for ministry, marketplace, and community leaders pursuing kingdom impact.",
  },
  {
    id: "sample-fire-glory-prayer-summit",
    title: "Fire & Glory Prayer Summit",
    city: "London",
    country: "UK",
    venue_name: "Revival House London",
    starts_at_utc: "2026-07-20T18:00:00Z",
    ends_at_utc: "2026-07-20T22:00:00Z",
    sponsor_name: "Revival Sound International",
    status: "approved",
    is_featured: true,
    is_major_event: true,
    description:
      "A high-impact summit focused on prayer, intercession, revival, and cross-city unity.",
  },
  {
    id: "sample-youth-awakening-gathering",
    title: "Youth Awakening Gathering",
    city: "Nairobi",
    country: "Kenya",
    venue_name: "Awakening Grounds",
    starts_at_utc: "2026-08-11T15:00:00Z",
    ends_at_utc: "2026-08-11T19:00:00Z",
    sponsor_name: "Awakened Generation Network",
    status: "approved",
    description:
      "A youth-centered gathering for prayer, worship, discipleship, and regional activation.",
  },
  {
    id: "sample-prophetic-prayer-night",
    title: "Prophetic Prayer Night",
    city: "Johannesburg",
    country: "South Africa",
    venue_name: "Kingdom Fire Tabernacle",
    starts_at_utc: "2026-09-03T17:00:00Z",
    ends_at_utc: "2026-09-03T21:00:00Z",
    sponsor_name: "Watchmen South Africa",
    status: "approved",
    is_featured: true,
    description:
      "An evening dedicated to prophetic intercession, spiritual alignment, and regional prayer coverage.",
  },
  {
    id: "sample-revival-fire-conference",
    title: "Revival Fire Conference",
    city: "Toronto",
    country: "Canada",
    venue_name: "Revival City Assembly",
    starts_at_utc: "2026-10-17T16:00:00Z",
    ends_at_utc: "2026-10-17T22:00:00Z",
    sponsor_name: "Northern Flame Collective",
    status: "approved",
    is_major_event: true,
    description:
      "A citywide conference centered on revival, worship, equipping, and apostolic encouragement.",
  },
];

const discoveryTopRowPromos: DiscoveryPromo[] = [
  {
    id: "discovery-top-row-1",
    title: "Discovery Top Row Placement 1",
    body:
      "High-visibility placement positioned above live event listings on the discovery page.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
  },
  {
    id: "discovery-top-row-2",
    title: "Discovery Top Row Placement 2",
    body:
      "Designed for campaign visibility, sponsor exposure, and event promotion at the point of discovery.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
  },
  {
    id: "discovery-top-row-3",
    title: "Discovery Top Row Placement 3",
    body:
      "Reserved for active paid discovery-level promotional inventory on Judah Global.",
    ctaLabel: "Learn More",
    ctaTo: "/events",
    badge: "Top Row",
  },
];

function DiscoveryTopRowCard({ promo }: { promo: DiscoveryPromo }) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: 22,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
      }}
    >
      {promo.badge ? (
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
          {promo.badge}
        </div>
      ) : null}

      <h3 style={{ margin: 0, marginBottom: 10 }}>{promo.title}</h3>

      <p
        style={{
          margin: 0,
          color: "#475569",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {promo.body}
      </p>

      <a
        href={promo.ctaTo}
        style={{
          textDecoration: "none",
          color: "#1d4ed8",
          fontWeight: 800,
          marginTop: 16,
        }}
      >
        {promo.ctaLabel} →
      </a>
    </div>
  );
}

export default function EventsPage() {
  const majorEvents = sampleEvents.filter((event) => event.is_major_event);

  return (
    <div className="container" style={{ display: "grid", gap: 28 }}>
      <section>
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ margin: 0, marginBottom: 8 }}>Event Discovery</h1>
          <p style={{ margin: 0, color: "#475569" }}>
            Explore global faith-based events happening around the world.
          </p>
        </div>
      </section>

      {majorEvents.length > 0 ? (
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
                color: "#b45309",
              }}
            >
              Featured Event Tier
            </p>

            <h2 style={{ margin: 0, marginBottom: 8 }}>Major Events</h2>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.7,
                maxWidth: 760,
              }}
            >
              Elevated event visibility for high-impact gatherings, conferences,
              and sponsored priority events.
            </p>
          </div>

          <div className="events-grid">
            {majorEvents.map((event) => (
              <EventCard
                key={event.id || event.event_id || event.title}
                event={event}
                engagementSource="discovery"
              />
            ))}
          </div>
        </section>
      ) : null}

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

          <h2 style={{ margin: 0, marginBottom: 8 }}>Discovery Top Row</h2>

          <p
            style={{
              margin: 0,
              color: "#475569",
              lineHeight: 1.7,
              maxWidth: 760,
            }}
          >
            Premium promotional placements rendered above live event discovery.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {discoveryTopRowPromos.map((promo) => (
            <DiscoveryTopRowCard key={promo.id} promo={promo} />
          ))}
        </div>
      </section>

      <section>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>All Events</h2>
          <p style={{ margin: 0, color: "#475569" }}>
            Browse live event listings across cities, regions, and countries.
          </p>
        </div>

        <div className="events-grid">
          {sampleEvents.map((event) => (
            <EventCard
              key={event.id || event.event_id || event.title}
              event={event}
              engagementSource="discovery"
            />
          ))}
        </div>
      </section>
    </div>
  );
}