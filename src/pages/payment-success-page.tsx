import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function buildClientConfirmationCode(
  prefix: "CMP" | "EVT" | "ORG",
  seed?: string | null
) {
  const clean = (seed || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

  if (clean.length >= 6) {
    return `${prefix}-${clean}`;
  }

  const fallback = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${fallback}`;
}

const paymentMetaCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "16px",
  marginTop: "20px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#6b7280",
  marginBottom: "4px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#111827",
  wordBreak: "break-word",
};

export default function PaymentSuccessPage() {

  const PURCHASE_TYPE_LABELS: Record<string, string> = {
    org_subscription: "Annual Subscription Plan",
    campaign: "Campaign Purchase",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  const sessionId = query.get("session_id") || "";
  const eventCodeFromQuery = query.get("event_code") || "";
  const amount = query.get("amount") || "";

  const state = (location.state || {}) as {
    organizationName?: string;
    eventName?: string;
    eventCode?: string;
    eventId?: string;
    orgUuid?: string;
  };

  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/payments/session/${sessionId}`);
          
        const data = await res.json();
        console.log("PAYMENT SUCCESS SESSION RESPONSE:", data);

        if (data.success) {
          setPaymentData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch payment session", err);
      }
    };

    fetchSession();
  }, [sessionId]);

  const purchaseType =
    paymentData?.purchaseType ||
    paymentData?.purchase_type ||
    null;

  const isOrgSubscription = purchaseType === "org_subscription";
  const isCampaign = purchaseType === "campaign";
  const isEventPayment = !isOrgSubscription && !isCampaign;

  const organizationName =
    state.organizationName ||
    paymentData?.organization_name ||
    paymentData?.organizationName ||
    "Organization";

  const eventName =
    state.eventName ||
    paymentData?.event_name ||
    paymentData?.eventName ||
    "Submitted Event";

  const eventCode =
    state.eventCode ||
    eventCodeFromQuery ||
    paymentData?.event_code ||
    paymentData?.eventCode ||
    buildClientConfirmationCode("EVT", state.eventId || sessionId);

  const orgReferenceCode = buildClientConfirmationCode(
    "ORG",
    paymentData?.orgUuid || state.orgUuid || sessionId
  );

  const campaignReferenceCode = buildClientConfirmationCode(
    "CMP",
    paymentData?.campaignId || sessionId
  );

  const headerTitle = isOrgSubscription
    ? "Organization Subscription Activated"
    : isCampaign
    ? "Campaign Payment Successful"
    : "Payment Successful";

  const headerText = isOrgSubscription
    ? "Thank you. Your Judah Global organization subscription payment has been received. Your organization subscription is now being activated."
    : isCampaign
    ? "Thank you. Your Judah Global campaign payment has been received. Your promotional campaign is now being processed and linked records are being updated."
    : "Thank you. Your Judah Global event payment has been received.";

  const nextSteps = isOrgSubscription
    ? [
        "1. Your payment has been confirmed.",
        "2. One moment while your organization subscription is being activated.",
        "3. Your organization account can move into active subscription status automatically.",
        "4. Org access, pricing benefits, and portal capabilities can now follow the paid subscription.",
      ]
    : isCampaign
    ? [
        "1. Your payment has been confirmed.",
        "2. Your campaign items are being updated into paid status.",
        "3. Any linked event payment state can continue through the workflow automatically.",
        "4. Promo media and campaign placement rendering remain subject to the normal approval and scheduling rules.",
      ]
    : [
        "1. Your payment has been confirmed through Stripe.",
        "2. Your event submission remains in the Judah Global review flow.",
        "3. Admin can review event details and approve or reject the submission.",
        "4. Event media can continue through the moderation workflow before public display.",
      ];

  const handlePrimaryAction = () => {
  if (isOrgSubscription) {
    const orgUuid = paymentData?.orgUuid || state.orgUuid || null;

    if (orgUuid) {
      navigate(`/org/${orgUuid}`);
      return;
    }

    navigate("/profile");
    return;
  }

  if (isCampaign) {
    navigate("/profile");
    return;
  }

  navigate("/profile");
};

  const handleSecondaryAction = () => {
  if (isOrgSubscription) {
    navigate("/register-organization");
    return;
  }

  if (isCampaign) {
    navigate("/campaign-builder");
    return;
  }

  navigate("/submit-event");
};

  const primaryButtonLabel = isOrgSubscription
    ? "Return to Dashboard"
    : isCampaign
    ? "Return to Dashboard"
    : "Return to Dashboard";

  const secondaryButtonLabel = isOrgSubscription
    ? "Register Another Organization"
    : isCampaign
    ? "Build Another Campaign"
    : "Submit Another Event";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        padding: "48px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          border: "1px solid rgba(226,232,240,0.8)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "40px 32px 28px",
            background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              marginBottom: "20px",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            {headerTitle}
          </h1>

          <p
            style={{
              marginTop: "14px",
              marginBottom: 0,
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.88)",
              maxWidth: "620px",
            }}
          >
            {headerText}
          </p>
        </div>

        <div style={{ padding: "32px" }}>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              What happens next
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
                color: "#374151",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              {nextSteps.map((step) => (
                <div key={step}>{step}</div>
              ))}
            </div>
          </div>

          <div style={paymentMetaCardStyle}>
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Client Confirmation
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
            <div>
              <div style={labelStyle}>Organization</div>
              <div style={valueStyle}>{organizationName}</div>
            </div>

            {isOrgSubscription ? (
              <>
                <div>
                  <div style={labelStyle}>Subscription</div>
                  <div style={valueStyle}>Annual Organization Access</div>
                </div>

                <div>
                  <div style={labelStyle}>Region</div>
                  <div style={valueStyle}>
                    {paymentData?.subscriptionRegion
                      ? ({
                          usa: "United States",
                          canada: "Canada",
                          uk: "United Kingdom",
                          africa: "Africa",
                        } as Record<string, string>)[paymentData.subscriptionRegion] ||
                        paymentData.subscriptionRegion
                      : "-"}                  
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Subscription Reference</div>
                  <div style={valueStyle}>{orgReferenceCode}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={labelStyle}>Event</div>
                  <div style={valueStyle}>{eventName}</div>
                </div>

                <div>
                  <div style={labelStyle}>Event Code</div>
                  <div style={valueStyle}>{eventCode}</div>
                </div>

                {isCampaign && (
                  <div>
                    <div style={labelStyle}>Campaign Reference</div>
                    <div style={valueStyle}>{campaignReferenceCode}</div>
                  </div>
                )}
              </>
            )}            
            </div>
          </div>

          {(sessionId ||
            eventCode ||
            amount ||
            paymentData?.amount_total ||
            purchaseType) && (
            <div style={paymentMetaCardStyle}>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Payment Confirmation
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {sessionId && (
                  <div>
                    <div style={labelStyle}>Stripe Session</div>
                    <div style={valueStyle}>{sessionId}</div>
                  </div>
                )}

                {purchaseType && purchaseType !== "org_subscription" && (
                  <div>
                    <div style={labelStyle}>Purchase Type</div>
                    <div style={valueStyle}>
                      {PURCHASE_TYPE_LABELS[purchaseType] || purchaseType}                    
                    </div>
                  </div>
                )}                

                {isEventPayment && eventCode && (
                  <div>
                    <div style={labelStyle}>Reference Code</div>
                    <div style={valueStyle}>{eventCode}</div>
                  </div>
                )}

                {isCampaign && (
                  <div>
                    <div style={labelStyle}>Campaign Reference</div>
                    <div style={valueStyle}>{campaignReferenceCode}</div>
                  </div>
                )}

                {isOrgSubscription && (
                  <div>
                    <div style={labelStyle}>Org UUID</div>
                    <div style={valueStyle}>
                      {paymentData?.orgUuid || state.orgUuid || "—"}
                    </div>
                  </div>
                )}

                {(paymentData?.amount_total || amount) && (
                  <div>
                    <div style={labelStyle}>Amount Paid</div>
                    <div style={valueStyle}>
                      {isOrgSubscription
                        ? paymentData?.subscriptionPriceCents
                          ? `$${(paymentData.subscriptionPriceCents / 100).toFixed(0)}/year`
                          : "$299/year"
                        : paymentData?.amount_total
                        ? `$${(paymentData.amount_total / 100).toFixed(2)} ${paymentData.currency?.toUpperCase()}`
                        : amount}
                    </div>
                  </div>
                )}
                {paymentData?.payment_status && (
                  <div>
                    <div style={labelStyle}>Payment Status</div>
                    <div style={valueStyle}>{paymentData.payment_status}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <button
              type="button"
              onClick={handlePrimaryAction}
              style={{
                border: "none",
                background: "#111827",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "14px 22px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {primaryButtonLabel}
            </button>

            <button
              type="button"
              onClick={handleSecondaryAction}
              style={{
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                borderRadius: "12px",
                padding: "14px 22px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {secondaryButtonLabel}
            </button>
          </div>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: 1.7,
            }}
          >
            {isOrgSubscription
              ? "This page confirms your organization subscription payment. You now have global outreach for your events."
              : isCampaign
              ? "This page confirms your campaign payment. You can now enjoy even placement discounts."
              : "This page is informational only."}
          </div>
        </div>
      </div>
    </div>
  );
}
