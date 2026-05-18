import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SuccessData = {
  organizationName?: string | null;
  campaignName?: string | null;
  campaignCode?: string | null;
  campaignId?: string | null;
  orgUuid?: string | null;
  eventId?: string | null;
  amountPaid?: number | null;
  status?: string | null;
};

function buildClientConfirmationCode(prefix: "CMP" | "EVT", seed?: string | null) {
  const clean = (seed || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

  if (clean.length >= 6) return `${prefix}-${clean}`;

  const fallback = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${fallback}`;
}

export default function CampaignPaymentSuccessPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const sessionId = params.get("session_id");
  const orgUuidFromQuery = params.get("orgUuid");

  const state = (location.state || {}) as {
    organizationName?: string;
    campaignName?: string;
    campaignCode?: string;
    campaignId?: string;
    orgUuid?: string;
  };

  const [data, setData] = useState<SuccessData | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    async function fetchPaymentSuccess() {
      try {
        const res = await fetch(
        `http://localhost:4000/api/v1/campaigns/payment-success?session_id=${encodeURIComponent(
          sessionId || ""
        )}`
      );
        if (!res.ok) {
          throw new Error(`Payment success lookup failed: ${res.status}`);
        }

        const json = await res.json();
        setData(json?.data || json);
      } catch (err) {
        console.error("Failed to fetch campaign payment success data:", err);
        setError("Confirmation details could not be loaded from the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentSuccess();
  }, [sessionId]);

  const organizationName =
    data?.organizationName || state.organizationName || "Organization";

  const campaignName =
    data?.campaignName || state.campaignName || "Reserved Campaign";

  const campaignCode =
    data?.campaignCode ||
    state.campaignCode ||
    buildClientConfirmationCode("CMP", data?.campaignId || state.campaignId || sessionId);

  const orgUuid = data?.orgUuid || state.orgUuid || orgUuidFromQuery || "";
  const dashboardHref = orgUuid ? `/org/${orgUuid}` : "/campaign-builder";

  const amountPaidLabel = useMemo(() => {
    if (typeof data?.amountPaid !== "number") return null;
    return `$${(data.amountPaid / 100).toFixed(2)}`;
  }, [data?.amountPaid]);

  if (loading) {
    return (
      <div style={{ padding: 48, fontWeight: 700 }}>
        Loading confirmation...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "48px 24px 72px",
        color: "#101828",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 32,
            background: "#ffffff",
            boxShadow: "0 18px 40px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#b69240",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Judah Global Monetization
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "3rem",
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Campaign Payment Successful
          </h1>

          <p
            style={{
              marginTop: 16,
              marginBottom: 0,
              maxWidth: 760,
              color: "#475467",
              lineHeight: 1.7,
              fontSize: "1rem",
            }}
          >
            Your campaign checkout has been completed successfully. Judah Global
            has received your payment and your campaign items are now being finalized.
          </p>

          <div
            style={{
              marginTop: 24,
              border: "1px solid #abefc6",
              background: "#ecfdf3",
              color: "#027a48",
              borderRadius: 16,
              padding: 18,
              fontWeight: 700,
            }}
          >
            Payment confirmed. Your campaign purchase was submitted successfully.
          </div>

          {error ? (
            <div
              style={{
                marginTop: 20,
                border: "1px solid #fedf89",
                background: "#fffaeb",
                color: "#b54708",
                borderRadius: 14,
                padding: 14,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 24,
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: 20,
              background: "#fafafa",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#667085",
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              Client Confirmation
            </div>

            <div style={{ display: "grid", gap: 10, color: "#101828", lineHeight: 1.6 }}>
              <div><strong>Organization:</strong> {organizationName}</div>
              <div><strong>Campaign:</strong> {campaignName}</div>
              <div><strong>Campaign Code:</strong> {campaignCode}</div>
              {amountPaidLabel ? <div><strong>Amount Paid:</strong> {amountPaidLabel}</div> : null}
              {data?.status ? <div><strong>Status:</strong> {data.status}</div> : null}
              {data?.eventId ? <div><strong>Event ID:</strong> {data.eventId}</div> : null}
              {orgUuid ? <div><strong>Organization UUID:</strong> {orgUuid}</div> : null}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 24,
            }}
          >
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                padding: 20,
                background: "#fafafa",
              }}
            >
              <strong>What happens next</strong>
              <div style={{ marginTop: 10, lineHeight: 1.7 }}>
                Your campaign and campaign items should now move into paid status
                through the Stripe webhook.
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                padding: 20,
                background: "#fafafa",
              }}
            >
              <strong>Stripe Session</strong>
              <div style={{ marginTop: 10, lineHeight: 1.7, wordBreak: "break-all" }}>
                {sessionId || "Session ID not available"}
              </div>
            </div>
          </div>

          {!orgUuid ? (
            <div
              style={{
                marginTop: 20,
                border: "1px solid #fecdca",
                background: "#fef3f2",
                color: "#b42318",
                borderRadius: 14,
                padding: 14,
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              Organization dashboard link was not available in this redirect, so the
              dashboard button will return to the Campaign Builder instead of a broken route.
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <Link
              to="/campaign-builder"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#101828",
                border: "1px solid #d0d5dd",
                borderRadius: 14,
                padding: "12px 18px",
                fontWeight: 700,
              }}
            >
              Back to Campaign Builder
            </Link>

            <Link
              to={dashboardHref}
              style={{
                textDecoration: "none",
                background: "#111827",
                color: "#ffffff",
                borderRadius: 14,
                padding: "12px 18px",
                fontWeight: 800,
              }}
            >
              Return to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}