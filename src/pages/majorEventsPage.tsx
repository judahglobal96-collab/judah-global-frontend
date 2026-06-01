import { useEffect, useMemo, useState } from "react";
import EventCard, { type EventCardItem } from "../components/events/EventCard";
import { getSupportRegion } from "../utils/region";

const BUTTON_STYLE: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: 600,
};

export default function MajorEventsPage() {
  const [events, setEvents] = useState<EventCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadMajorEvents(currentPage: number) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "12");

      const region = getSupportRegion();
      params.set("region", region); // TEMP for P0.3

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/major-events?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("MAJOR EVENTS RESPONSE:", data);

      const resolvedEvents = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : Array.isArray(data?.events)
        ? data.events
        : [];

      setEvents(resolvedEvents);

      setTotalPages(
        typeof data?.total_pages === "number" && data.total_pages > 0
          ? data.total_pages
          : typeof data?.pagination?.totalPages === "number" &&
            data.pagination.totalPages > 0
          ? data.pagination.totalPages
          : 1
      );
    } catch (err) {
      console.error("Failed to fetch major events", err);
      setError("Failed to load major events.");
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMajorEvents(page);
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const summaryText = useMemo(() => {
    if (loading) return "Loading major events...";
    return `${events.length} major event${events.length === 1 ? "" : "s"} found`;
  }, [events.length, loading]);

  return (
    <main style={{ padding: "32px", maxWidth: 1180, margin: "0 auto" }}>
      <section
        style={{
          marginBottom: 22,
          borderRadius: 24,
          padding: "32px 28px",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "#ffffff",
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: 10,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fcd34d",
          }}
        >
          Judah Global
        </p>

        <h1
          style={{
            margin: 0,
            marginBottom: 12,
            fontSize: "2.4rem",
            lineHeight: 1.05,
            color: "#ffffff",
          }}
        >
          Major Events
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 760,
            lineHeight: 1.8,
            color: "#e2e8f0",
            textAlign: "center",
          }}
        >
          Our most popular promotion tier. Explore high-visibility, high-impact events surfaced
          through Judah Global’s Major Event promotion tier. Events shown here remain eligible
          even when they are also Featured.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <div
          style={{
            color: "#475569",
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          {summaryText}
        </div>
      </section>

      {loading ? (
        <div
          style={{
            padding: 28,
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          Loading major events...
        </div>
      ) : error ? (
        <div
          style={{
            padding: 28,
            border: "1px solid #fecaca",
            borderRadius: 20,
            background: "#fff7f7",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      ) : events.length === 0 ? (
        <div
          style={{
            padding: 28,
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          No major events found.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 22,
            }}
          >
            {events.map((event, index) => {
              const key = event.event_id || event.id || String(index);

              return (
                <EventCard
                  key={key}
                  event={event}
                  engagementSource="major-events"
                />
              );
            })}
          </div>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{
                ...BUTTON_STYLE,
                background: page === 1 ? "#f8fafc" : "#ffffff",
                color: page === 1 ? "#94a3b8" : "#0f172a",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                fontWeight: 600,
              }}
            >
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                ...BUTTON_STYLE,
                background: page === totalPages ? "#f8fafc" : "#ffffff",
                color: page === totalPages ? "#94a3b8" : "#0f172a",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
