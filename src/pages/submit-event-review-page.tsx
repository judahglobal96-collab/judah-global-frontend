import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import { getSubmitEventDraft } from "../lib/submit-event-draft";

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

type DraftMedia = {
  previewUrl?: string | null;
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
  media?: DraftMedia;
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
  return ((cents ?? 0) / 100).toFixed(2);
}

function displayValue(value?: string | number | null | boolean) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}

export default function SubmitEventReviewPage() {
  const navigate = useNavigate();
  const { eventId: routeEventId } = useParams();
  const [searchParams] = useSearchParams();

  const localDraft = useMemo(() => getSubmitEventDraft() as DraftState, []);
  const [draft] = useState<DraftState>(localDraft);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const paymentQuery = searchParams.get("payment");
  const hasSuccessfulReturn = paymentQuery === "success";
  const eventId = routeEventId || localDraft.eventId || "";

  const scheduleValidationMessage = getScheduleValidationMessage(draft.schedule);

  const monetization = draft.monetization || {};
  const hasFeaturedBadge = Boolean(monetization.hasFeaturedBadge);
  const hasMajorEventAccess = Boolean(monetization.hasMajorEventAccess);

  const baseEventFeeCents = 7900;
  const featuredBadgeFeeCents = hasFeaturedBadge ? 7900 : 0;
  const majorEventFeeCents = hasMajorEventAccess ? 24900 : 0;

  const calculatedTotalCents =
    baseEventFeeCents + featuredBadgeFeeCents + majorEventFeeCents;

  const totalFeeCents =
    Number(monetization.estimatedTotalCents || 0) > 0
      ? Number(monetization.estimatedTotalCents)
      : calculatedTotalCents;

  useEffect(() => {
    if (scheduleValidationMessage) {
      setReviewError(scheduleValidationMessage);
      return;
    }

    setReviewError("");
  }, [scheduleValidationMessage]);

  async function handlePayAndSubmit() {
    const validationMessage = getScheduleValidationMessage(draft.schedule);

    if (validationMessage) {
      setReviewError(validationMessage);
      return;
    }

    setReviewError("");

    if (!eventId) {
      alert("Missing event draft ID.");
      return;
    }

    setIsStartingPayment(true);

    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch(
        "${import.meta.env.VITE_API_BASE_URL}/api/v1/event-payments/checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            eventId,
            hasFeaturedBadge,
            hasMajorEventAccess,
            isOrgAccount: false,
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
      console.error("Submit payment start failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment right now."
      );
      setIsStartingPayment(false);
    }
  }

  function getPaymentLabel(status?: string) {
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

  const paymentStatus = draft.payment_status || "unpaid";
  const eventStatus = draft.status || "draft";

  const controlsDisabled =
    isStartingPayment ||
    hasSuccessfulReturn ||
    paymentStatus === "paid" ||
    paymentStatus === "waived" ||
    eventStatus === "pending" ||
    eventStatus === "approved";

  return (
    <SubmitEventLayout
      title="Review & Submit"
      description="Review all event details and pricing before payment and submission for approval."
    >
      {paymentQuery === "success" && (
        <div className="review-section">
          <p style={{ margin: 0, fontWeight: 700 }}>
            Payment received. Your event has been submitted successfully and is now pending admin approval.
          </p>
        </div>
      )}

      {paymentQuery === "cancelled" && (
        <div className="review-section">
          <p style={{ margin: 0, fontWeight: 700 }}>
            Payment was not completed. Your event remains in draft until payment is completed.
          </p>
        </div>
      )}

      {reviewError && (
        <div className="review-section">
          <p style={{ margin: 0, fontWeight: 800, color: "#b42318" }}>
            {reviewError}
          </p>

          <div style={{ marginTop: 16 }}>
            {eventId ? (
              <Link to={`/submit-event/${eventId}/schedule`}>Back to Schedule</Link>
            ) : (
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/submit-event")}
              >
                Back to Basics
              </button>
            )}
          </div>
        </div>
      )}

      <div className="review-section">
        <h3>Submission Status</h3>

        <p>
          <strong>Draft Event ID:</strong> {displayValue(eventId)}
        </p>

        <p>
          <strong>Event Status:</strong> {displayValue(eventStatus)}
        </p>

        <p>
          <strong>Payment Status:</strong> {displayValue(getPaymentLabel(paymentStatus))}
        </p>
      </div>

      <div className="review-section">
        <h3>Pricing Summary</h3>

        <p>
          <strong>Event Submission Fee:</strong> ${centsToDollars(baseEventFeeCents)}
        </p>

        <p>
          <strong>Featured Badge:</strong>{" "}
          {hasFeaturedBadge ? `+$${centsToDollars(featuredBadgeFeeCents)}` : "$0.00"}
        </p>

        <p>
          <strong>Major Event Access:</strong>{" "}
          {hasMajorEventAccess ? `+$${centsToDollars(majorEventFeeCents)}` : "$0.00"}
        </p>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "#fafafa",
            marginTop: 12,
          }}
        >
          <div style={{ fontWeight: 700 }}>Promo Placements</div>
          <div style={{ color: "#475467", marginTop: 6, lineHeight: 1.7 }}>
            Promo placement scheduling and availability are managed in Campaign Builder.
            Placement inventory is secured upon successful payment.
          </div>
        </div>

        <p style={{ marginTop: 16 }}>
          <strong>Total:</strong> ${centsToDollars(totalFeeCents)}
        </p>

        <p>
          Payment is required before your event can enter the approval workflow.
        </p>

        {eventId && (
          <div style={{ marginTop: 12 }}>
            <Link to={`/submit-event/${eventId}/monetization`}>
              Edit Monetization
            </Link>
          </div>
        )}
      </div>

      <div className="review-section">
        <h3>Basics</h3>

        <p>
          <strong>Title:</strong> {displayValue(draft.basics?.title)}
        </p>

        <p>
          <strong>Short Description:</strong> {displayValue(draft.basics?.shortDescription)}
        </p>

        <p>
          <strong>Description:</strong> {displayValue(draft.basics?.description)}
        </p>

        <p>
          <strong>Category:</strong> {displayValue(draft.basics?.category)}
        </p>

        {eventId && (
          <Link to={`/submit-event/${eventId}/basics`}>Edit Basics</Link>
        )}
      </div>

      <div className="review-section">
        <h3>Schedule</h3>

        <p>
          <strong>Start:</strong> {displayValue(draft.schedule?.startDate)}{" "}
          {displayValue(draft.schedule?.startTime)}
        </p>

        <p>
          <strong>End:</strong> {displayValue(draft.schedule?.endDate)}{" "}
          {displayValue(draft.schedule?.endTime)}
        </p>

        <p>
          <strong>Timezone:</strong> {displayValue(draft.schedule?.timezone)}
        </p>

        <p>
          <strong>Recurrence:</strong> {displayValue(draft.schedule?.recurrence)}
        </p>

        {eventId && (
          <Link to={`/submit-event/${eventId}/schedule`}>Edit Schedule</Link>
        )}
      </div>

      <div className="review-section">
        <h3>Location</h3>

        <p>
          <strong>Venue:</strong> {displayValue(draft.location?.venueName)}
        </p>

        <p>
          <strong>Address:</strong> {displayValue(draft.location?.addressLine1)}
        </p>

        <p>
          <strong>City:</strong> {displayValue(draft.location?.city)}
        </p>

        <p>
          <strong>State / Region:</strong> {displayValue(draft.location?.stateRegion)}
        </p>

        <p>
          <strong>Country:</strong> {displayValue(draft.location?.country)}
        </p>

        <p>
          <strong>Virtual:</strong> {displayValue(draft.location?.isVirtual)}
        </p>

        {eventId && (
          <Link to={`/submit-event/${eventId}/location`}>Edit Location</Link>
        )}
      </div>

      <div className="review-section">
        <h3>Sponsor</h3>

        <p>
          <strong>Sponsor Name:</strong> {displayValue(draft.sponsor?.sponsorName)}
        </p>

        <p>
          <strong>Sponsor Type:</strong> {displayValue(draft.sponsor?.sponsorType)}
        </p>

        <p>
          <strong>Contact Name:</strong> {displayValue(draft.sponsor?.contactName)}
        </p>

        <p>
          <strong>Contact Email:</strong> {displayValue(draft.sponsor?.contactEmail)}
        </p>

        <p>
          <strong>Contact Phone:</strong> {displayValue(draft.sponsor?.contactPhone)}
        </p>

        <p>
          <strong>Website:</strong> {displayValue(draft.sponsor?.website)}
        </p>

        {eventId && (
          <Link to={`/submit-event/${eventId}/sponsor`}>Edit Sponsor</Link>
        )}
      </div>

      {draft.media?.previewUrl && (
        <div className="review-section">
          <h3>Media Preview</h3>
          <img
            src={draft.media.previewUrl}
            alt="Event media preview"
            style={{
              maxWidth: "100%",
              borderRadius: 16,
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      )}

      <div className="actions-row">
        {eventId && (
          <Link to={`/submit-event/${eventId}/monetization`}>
            <button type="button">Back to Monetization</button>
          </Link>
        )}

        <button
          type="button"
          className="primary-action"
          disabled={controlsDisabled}
          onClick={handlePayAndSubmit}
        >
          {getPrimaryButtonLabel(paymentStatus, eventStatus)}
        </button>
      </div>
    </SubmitEventLayout>
  );
}
