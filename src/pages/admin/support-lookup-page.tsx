// src/pages/admin/support-lookup-page.tsx

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type LookupResult = {
  id: string;
  event_code?: string | null;
  title: string;
  event_type?: string | null;
  status?: string | null;
  submitter_email?: string | null;
  organization_name?: string | null;
  sponsor_name?: string | null;
  sponsor_email?: string | null;
  updated_at?: string | null;
};

const API_BASE = "${import.meta.env.VITE_API_BASE_URL}/api/v1";

export default function AdminSupportLookupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runLookup(nextQuery = query) {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/admin/support-lookup?q=${encodeURIComponent(trimmed)}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Lookup failed.");
      }

      setResults(Array.isArray(data?.results) ? data.results : []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) runLookup(initialQuery);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchParams({ q: query.trim() });
    runLookup(query);
  }

  return (
    <main style={{ padding: "40px", maxWidth: 1100, margin: "0 auto" }}>
      <Link to="/admin" style={{ fontWeight: 700, textDecoration: "none" }}>
        ← Back to Admin Dashboard
      </Link>

      <h1 style={{ fontSize: "3rem", marginBottom: 8 }}>
        Event / Sponsor Lookup
      </h1>

      <p style={{ color: "#475467", marginBottom: 24 }}>
        Search by Event ID, event title, sponsor/org name, or sponsor email.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 12,
          padding: 16,
          border: "1px solid #E5C07B",
          borderRadius: 14,
          background: "#FFFBEB",
          marginBottom: 24,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Event ID, Sponsor Name, Email, or Event Title"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #D1D5DB",
          }}
        />

        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: 10,
            padding: "12px 18px",
            background: "#111827",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p style={{ color: "#B91C1C", fontWeight: 700 }}>{error}</p>}

      {!loading && !error && results.length === 0 && initialQuery && (
        <p>No matching events found.</p>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {results.map((event) => (
          <article
            key={event.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: 20,
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{event.title}</h2>

            <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
              <div>
                <strong>Event ID:</strong> {event.id}
              </div>
              <div>
                <strong>Organization/Sponsor:</strong>{" "}
                {event.organization_name || event.sponsor_name || "—"}
              </div>
              <div>
                <strong>Sponsor Email:</strong>{" "}
                {event.sponsor_email || event.submitter_email || "—"}
              </div>
              <div>
                <strong>Status:</strong> {event.status || "—"}
              </div>
              <div>
                <strong>Type:</strong> {event.event_type || "—"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={`/admin/events/${event.id}`}>View Admin Event</Link>
              <Link to={`/admin/events/${event.id}/paid-promos`}>
                Paid Promo Purchases
              </Link>
              <Link to={`/event/${event.id}`}>View Public Event</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
