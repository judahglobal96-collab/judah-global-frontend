import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSubmitEventDraft } from "../../lib/submit-event-draft";

type DraftBasics = {
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
};

type DraftSchedule = {
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timezone?: string;
  recurrence?: string;
};

type DraftLocation = {
  venueName?: string;
  addressLine1?: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  isVirtual?: boolean;
};

type DraftSponsor = {
  sponsorName?: string;
  sponsorType?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
};

type DraftMonetization = {
  hasFeaturedBadge?: boolean;
  hasMajorEventAccess?: boolean;
  estimatedTotalCents?: number;
};

type DraftState = {
  eventId?: string;
  basics?: DraftBasics;
  schedule?: DraftSchedule;
  location?: DraftLocation;
  sponsor?: DraftSponsor;
  monetization?: DraftMonetization;
  payment_status?: string;
  status?: string;
};

function normalizeDateOnly(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function normalizeTimeOnly(value?: string) {
  if (!value) return null;
  return String(value).split(".")[0].slice(0, 8);
}

function getScheduleValidationMessage(schedule?: DraftSchedule) {
  if (!schedule) return null;

  const startDate = normalizeDateOnly(schedule.startDate);
  const endDate = normalizeDateOnly(schedule.endDate);
  const startTime = normalizeTimeOnly(schedule.startTime);
  const endTime = normalizeTimeOnly(schedule.endTime);

  if (startDate && endDate && endDate < startDate) {
    return "End date cannot be earlier than start date.";
  }

  if (
    startDate &&
    endDate &&
    startDate === endDate &&
    startTime &&
    endTime &&
    endTime < startTime
  ) {
    return "End time cannot be earlier than start time on the same day.";
  }

  return null;
}

function centsToDollars(cents?: number) {
  return ((Number(cents) || 0) / 100).toFixed(2);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatTime(value?: string) {
  if (!value) return "—";

  const raw = String(value).slice(0, 8);
  const [hoursStr = "0", minutesStr = "00"] = raw.split(":");
  const hours = Number(hoursStr);
  const minutes = String(minutesStr).padStart(2, "0");

  if (Number.isNaN(hours)) return value;

  const suffix = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12;

  return `${twelveHour}:${minutes} ${suffix}`;
}

export default function OrgSubmitEventReviewPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [searchParams] = useSearchParams();

  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";
  const localDraft = useMemo<DraftState>(() => getSubmitEventDraft() || {}, []);
  const [draft] = useState<DraftState>(localDraft || {});
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const paymentQuery = searchParams.get("payment");
  const hasSuccessfulReturn = paymentQuery === "success";
  const eventId = draft?.eventId || localDraft?.eventId;

  const paymentStatus = draft.payment_status || "unpaid";
  const eventStatus = draft.status || "draft";

  const monetization = draft.monetization || {};
  const basics = draft.basics || {};
  const schedule = draft.schedule || {};
  const location = draft.location || {};
  const sponsor = draft.sponsor || {};

  const hasFeaturedBadge = Boolean(monetization.hasFeaturedBadge);
  const hasMajorEventAccess = Boolean(monetization.hasMajorEventAccess);

  const baseEventFeeCents = 7900;
  const featuredBadgeFeeCents = hasFeaturedBadge ? 7900 : 0;
  const majorEventFeeCents = hasMajorEventAccess ? 10900 : 0;

  const scheduleValidationMessage = getScheduleValidationMessage(schedule);

  const computedFallbackTotalCents =
    baseEventFeeCents + featuredBadgeFeeCents + majorEventFeeCents;

  const totalFeeCents =
    Number(monetization.estimatedTotalCents || 0) > 0
      ? Number(monetization.estimatedTotalCents)
      : computedFallbackTotalCents;

  const pricingRows = useMemo(() => {
    const rows: { label: string; amountCents: number }[] = [
      { label: "Event Submission Fee", amountCents: baseEventFeeCents },
    ];

    if (hasFeaturedBadge) {
      rows.push({ label: "Featured Badge", amountCents: featuredBadgeFeeCents });
    }

    if (hasMajorEventAccess) {
      rows.push({ label: "Major Event Access", amountCents: majorEventFeeCents });
    }

    return rows;
  }, [baseEventFeeCents, hasFeaturedBadge, featuredBadgeFeeCents, hasMajorEventAccess, majorEventFeeCents]);

  const showAdminBackButton =
    routerLocation.pathname.startsWith("/org/") &&
    searchParams.get("adminView") === "true";

  useEffect(() => {
    if (scheduleValidationMessage) {
      setReviewError(scheduleValidationMessage);
      return;
    }

    setReviewError("");
  }, [scheduleValidationMessage]);

  const handleGoBackToSchedule = () => {
    navigate(`${baseOrgPath}/submit-event/schedule`);
  };

  console.log("PAY AND SUBMIT CLICKED", {
  eventId,
  orgUuid,
  schedule,
  location,
  sponsor,
});

  const handlePayAndSubmit = async () => {
    const validationMessage = getScheduleValidationMessage(schedule);

    if (validationMessage) {
      setReviewError(validationMessage);
      return;
    }

    setReviewError("");

    if (!eventId) {
      alert("Event draft ID is missing. Please return to Basics and try again.");
      return;
    }

    setIsStartingPayment(true);

    try {
      const token = localStorage.getItem("auth_token");

      console.log("SAVING ORG EVENT METADATA BEFORE PAYMENT:", {
      eventId,
      orgUuid,
      schedule,
      location,
      sponsor,
    });

      const metadataRes = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/org/${orgUuid}/submit-event/review`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
      event_id: eventId,
      org_uuid: orgUuid,
      schedule,
      location,
      sponsor,
    }),
  }
);

const metadataData = await metadataRes.json().catch(() => ({}));

if (!metadataRes.ok) {
  throw new Error(
    metadataData?.error ||
      metadataData?.message ||
      "Unable to save event metadata before payment."
  );
}
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/event-payments/checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            eventId,
            orgUuid,
            hasFeaturedBadge,
            hasMajorEventAccess,
            isOrgAccount: true,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.checkoutUrl) {
        throw new Error(
          data?.message || "Unable to start payment checkout session."
        );
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Payment checkout error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment right now."
      );
      setIsStartingPayment(false);
    }
  };

  function getPaymentLabel(status: string) {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Processing";
      case "failed":
        return "Failed";
      case "waived":
        return "Waived";
      case "refunded":
        return "Refunded";
      default:
        return "Unpaid";
    }
  }

  function getPrimaryButtonLabel(
    currentPaymentStatus?: string,
    currentEventStatus?: string
  ) {
    if (isStartingPayment) return "Redirecting...";
    if (hasSuccessfulReturn) return "Submitted (Pending Approval)";
    if (currentEventStatus === "pending") return "Submitted (Pending Approval)";
    if (currentEventStatus === "approved") return "Approved";
    if (currentPaymentStatus === "pending") return "Processing Payment...";
    if (currentPaymentStatus === "paid") return "Submitted (Pending Approval)";
    if (currentPaymentStatus === "waived") return "Submitted (Waived)";
    if (currentPaymentStatus === "failed") return "Retry Payment";
    return "Pay & Submit Event";
  }

  function isPrimaryButtonDisabled() {
    return (
      isStartingPayment ||
      paymentStatus === "paid" ||
      paymentStatus === "waived" ||
      eventStatus === "pending" ||
      eventStatus === "approved"
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  };

  const valueLabelStyle: React.CSSProperties = {
    color: "rgba(245, 241, 232, 0.58)",
    fontSize: "0.84rem",
  };

  const valueStyle: React.CSSProperties = {
    color: "#fffaf0",
    fontWeight: 600,
    lineHeight: 1.6,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#f5f1e8",
      }}
    >
      {showAdminBackButton && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/org-accounts")}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Admin Portal
          </button>
        </div>
      )}

      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            fontSize: "0.76rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#c8a96b",
            marginBottom: "10px",
          }}
        >
          Organization Portal
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            lineHeight: 1.1,
            color: "#fffaf0",
          }}
        >
          Review Event Submission
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: "820px",
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.7,
            fontSize: "0.98rem",
          }}
        >
          Review all event details and pricing before payment and submission into Judah Global’s approval workflow.
        </p>

        {paymentQuery === "success" && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(92, 184, 92, 0.35)",
              background: "rgba(92, 184, 92, 0.10)",
              color: "#d8f2d8",
              fontWeight: 600,
            }}
          >
            Payment received. Your event has been submitted successfully and is now pending admin approval.
          </div>
        )}

        {paymentQuery === "cancelled" && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(200,169,107,0.28)",
              background: "rgba(200,169,107,0.10)",
              color: "#f3d89b",
              fontWeight: 600,
            }}
          >
            Payment was not completed. Your event remains in draft until payment is completed.
          </div>
        )}

        {reviewError && (
          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid rgba(220, 80, 80, 0.35)",
              background: "rgba(220, 80, 80, 0.12)",
              color: "#ffd6d6",
              fontWeight: 700,
            }}
          >
            {reviewError}
            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={handleGoBackToSchedule}
                style={{
                  background: "#c8a96b",
                  color: "#111318",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Back to Schedule
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to={`${baseOrgPath}/submit-event/monetization`}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Back to Monetization
          </Link>

          <Link
            to={`${baseOrgPath}/submit-event/sponsor`}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Back to Sponsor
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 18px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.18), rgba(200,169,107,0.08))",
              border: "1px solid rgba(200,169,107,0.28)",
              color: "#f3d89b",
              fontWeight: 700,
            }}
          >
            Review & Submit
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <div style={cardStyle}>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Event Basics
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={valueLabelStyle}>Event Title</div>
                <div style={valueStyle}>{basics.title || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Description</div>
                <div style={valueStyle}>{basics.description || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Event Type</div>
                <div style={valueStyle}>{basics.category || "—"}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Event Schedule
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={valueLabelStyle}>Start Date</div>
                <div style={valueStyle}>{formatDate(schedule.startDate)}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>End Date</div>
                <div style={valueStyle}>{formatDate(schedule.endDate)}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Start Time</div>
                <div style={valueStyle}>{formatTime(schedule.startTime)}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>End Time</div>
                <div style={valueStyle}>{formatTime(schedule.endTime)}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Timezone</div>
                <div style={valueStyle}>{schedule.timezone || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Recurrence</div>
                <div style={valueStyle}>{schedule.recurrence || "—"}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Event Location
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={valueLabelStyle}>Virtual Event</div>
                <div style={valueStyle}>{location.isVirtual ? "Yes" : "No"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Venue Name</div>
                <div style={valueStyle}>{location.venueName || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Address</div>
                <div style={valueStyle}>{location.addressLine1 || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>City</div>
                <div style={valueStyle}>{location.city || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>State / Region</div>
                <div style={valueStyle}>{location.stateRegion || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Country</div>
                <div style={valueStyle}>{location.country || "—"}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Sponsor Information
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={valueLabelStyle}>Sponsor Name</div>
                <div style={valueStyle}>{sponsor.sponsorName || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Sponsor Type</div>
                <div style={valueStyle}>{sponsor.sponsorType || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Contact Name</div>
                <div style={valueStyle}>{sponsor.contactName || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Contact Email</div>
                <div style={valueStyle}>{sponsor.contactEmail || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Contact Phone</div>
                <div style={valueStyle}>{sponsor.contactPhone || "—"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Website</div>
                <div style={valueStyle}>{sponsor.website || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div style={cardStyle}>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Draft Status
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={valueLabelStyle}>Draft Event ID</div>
                <div style={valueStyle}>{eventId || "Not created"}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Event Status</div>
                <div style={valueStyle}>{eventStatus}</div>
              </div>

              <div>
                <div style={valueLabelStyle}>Payment Status</div>
                <div style={valueStyle}>{getPaymentLabel(paymentStatus)}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.14), rgba(200,169,107,0.06))",
              border: "1px solid rgba(200,169,107,0.24)",
              borderRadius: "22px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Pricing Summary
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
              {pricingRows.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
                >
                  <span>{row.label}</span>
                  <strong>
                    {row.amountCents > 0 ? `+$${centsToDollars(row.amountCents)}` : "$0.00"}
                  </strong>
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 16,
                background: "rgba(255,255,255,0.03)",
                marginBottom: 18,
                color: "rgba(245,241,232,0.82)",
                lineHeight: 1.6,
              }}
            >
              Promo placement scheduling and availability are managed in Campaign Builder.
              Placement inventory is secured upon successful payment.
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 14,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                fontSize: "1.05rem",
              }}
            >
              <span style={{ color: "#fffaf0", fontWeight: 700 }}>Total</span>
              <strong style={{ color: "#f3d89b" }}>${centsToDollars(totalFeeCents)}</strong>
            </div>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                color: "rgba(245,241,232,0.82)",
                lineHeight: 1.6,
              }}
            >
              Payment is required before your event can enter the approval workflow.
            </p>
          </div>

          <div style={cardStyle}>
            <button
              type="button"
              onClick={handlePayAndSubmit}
              disabled={isPrimaryButtonDisabled()}
              style={{
                width: "100%",
                background: isPrimaryButtonDisabled()
                  ? "rgba(255,255,255,0.08)"
                  : "#c8a96b",
                color: isPrimaryButtonDisabled() ? "rgba(255,255,255,0.5)" : "#111318",
                border: "none",
                borderRadius: "14px",
                padding: "14px 18px",
                fontWeight: 800,
                cursor: isPrimaryButtonDisabled() ? "not-allowed" : "pointer",
              }}
            >
              {getPrimaryButtonLabel(paymentStatus, eventStatus)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
