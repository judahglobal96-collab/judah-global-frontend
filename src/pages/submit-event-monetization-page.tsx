import { useNavigate, useParams } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import { getSubmitEventDraft, saveSubmitEventDraft } from "../lib/submit-event-draft";

const EVENT_FEE_CENTS = 7900;
const FEATURED_BADGE_CENTS = 10900;
const MAJOR_EVENT_PUBLIC_CENTS = 24900;

type StarterPlacement = "featured_badge" | "major_events";

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createPreselectedItem(type: StarterPlacement) {
  return {
    id: createId(),
    placementType: type,
    startDate: toInputDate(new Date()),
    quantity: 1,
    durationDays: 21,
    availability: "available",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
  };
}

export default function SubmitEventMonetizationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const draft = getSubmitEventDraft();
  const activeEventId = eventId || draft.eventId || "";

  function openCampaignBuilder(selectedPlacement?: StarterPlacement) {
    const currentDraft = getSubmitEventDraft();
    const today = toInputDate(new Date());
    const selectedItem = selectedPlacement
      ? createPreselectedItem(selectedPlacement)
      : null;

    saveSubmitEventDraft({
      ...currentDraft,
      eventId: currentDraft.eventId || activeEventId,
      monetization: {
        ...currentDraft.monetization,
        hasFeaturedBadge: false,
        hasMajorEventAccess: false,
        estimatedTotalCents: EVENT_FEE_CENTS,
      },
    });

    navigate("/campaign-builder", {
      state: {
        eventId: currentDraft.eventId || activeEventId,
        source: "submit-event-monetization",
        includeEventFee: true,
        builderDraft: selectedItem
          ? {
              form: {
                campaignName:
                  currentDraft.basics?.title || "Event Promotion Campaign",
                organization:
                  currentDraft.sponsor?.sponsorName ||
                  "Organization",
                contactEmail:
                  currentDraft.sponsor?.contactEmail ||
                  localStorage.getItem("judah_submitter_email") ||
                  "",
                goal: "Promote this event on Judah Global.",
                notes: `Linked event submission: ${
                  currentDraft.eventId || activeEventId
                }`,
              },
              items: [selectedItem],
              calendarPlacementType: "homepage_top",
              calendarAnchorDate: today,
              quickBuilderPlacementType: "homepage_top",
              quickBuilderWeeks: 4,
              selectedItemId: selectedItem.id,
              statusMessage:
                selectedPlacement === "major_events"
                  ? "Major Events Access added. Select your activation date, upload promo media, and review before checkout."
                  : "Featured Badge added. Select your activation date, upload promo media, and review before checkout.",
              region: "USA",
            }
          : undefined,
      },
    });
  }

  function continueWithoutCampaign() {
    const currentDraft = getSubmitEventDraft();

    saveSubmitEventDraft({
      ...currentDraft,
      eventId: currentDraft.eventId || activeEventId,
      monetization: {
        ...currentDraft.monetization,
        hasFeaturedBadge: false,
        hasMajorEventAccess: false,
        estimatedTotalCents: EVENT_FEE_CENTS,
      },
    });

    navigate(`/submit-event/${activeEventId}/review`);
  }

  const summaryRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 24,
    background: "#ffffff",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: "#ffffff",
    color: "#101828",
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const primaryButtonStyle: React.CSSProperties = {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: 14,
    padding: "14px 18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
  };

  const accentButton = (bg: string): React.CSSProperties => ({
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    color: "#ffffff",
    background: bg,
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
    minWidth: 220,
  });

  const helperBoxStyle: React.CSSProperties = {
    marginTop: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "#fafafa",
    color: "#475467",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  };

  return (
    <SubmitEventLayout
      title="New Monetization Portal"
      description="Build your promotion using Campaign Builder. Choose visibility options, upload media, select dates, and complete checkout in one guided workflow."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 24 }}>
          <section style={cardStyle}>
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
              Campaign Builder™
            </div>

            <h3 style={{ marginTop: 0, marginBottom: 10 }}>
              Use one unified promotion workflow
            </h3>

            <div style={{ color: "#475467", lineHeight: 1.7, marginBottom: 18 }}>
             Campaign Builder™ is the central promotion experience for Judah Global. 
             Plan high-visibility placements, upload promo media, select activation dates, 
             review pricing, and complete checkout in one unified workflow.
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                padding: 18,
                background: "#fafafa",
                marginBottom: 18,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>
                What happens in Campaign Builder™
              </div>

              <div style={{ color: "#475467", lineHeight: 1.7 }}>
                <div>• Choose HERO, HomePage, Regional, or other placements</div>
                <div>• Select activation dates</div>
                <div>• View available weeks in green</div>
                <div>• Add one or multiple campaign promos</div>
                <div>• Upload promo media</div>
                <div>• Review exact pricing before checkout</div>
                <div>• Secure placement after successful payment</div>
              </div>
            </div>

                <div style={{
                  height: 1,
                  background: "#e5e7eb",
                  margin: "18px 0"
                }} />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                style={primaryButtonStyle}
                onClick={() => openCampaignBuilder()}
              >
                Open Campaign Builder™
              </button>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={continueWithoutCampaign}
              >
                Continue Without Promo Placements
              </button>
            </div>
          </section>

          <section style={cardStyle}>
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
              Optional Promotion Starters
            </div>

            <h3 style={{ marginTop: 0, marginBottom: 18 }}>
              Start with a visibility option
            </h3>

            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 18,
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1 1 320px" }}>
                    <strong>Featured Badge</strong>

                    <div
                      style={{
                        color: "#475467",
                        marginTop: 4,
                        lineHeight: 1.6,
                      }}
                    >
                      Boost visibility with a featured badge treatment across
                      eligible Judah Global surfaces.
                    </div>

                    <div style={{ marginTop: 10, fontWeight: 800 }}>
                      +${centsToDollars(FEATURED_BADGE_CENTS)}
                    </div>
                  </div>

                  <button
                    type="button"
                    style={accentButton("#7F56D9")}
                    onClick={() => openCampaignBuilder("featured_badge")}
                  >
                    Start Featured Badge
                  </button>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 18,
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1 1 320px" }}>
                    <strong>Major Events</strong>

                    <div
                      style={{
                        color: "#475467",
                        marginTop: 4,
                        lineHeight: 1.6,
                      }}
                    >
                      High-visibility placement for premium event exposure in
                      the Major Events promotional tier.
                    </div>

                    <div style={helperBoxStyle}>
                      Major Events promotion is configured in Campaign Builder™,
                      where you can select the activation start date, upload
                      promo media, review pricing, and complete checkout.
                    </div>

                    <div style={{ marginTop: 10, fontWeight: 800 }}>
                      +${centsToDollars(MAJOR_EVENT_PUBLIC_CENTS)}
                    </div>
                  </div>

                  <button
                    type="button"
                    style={accentButton("#B69240")}
                    onClick={() => openCampaignBuilder("major_events")}
                  >
                    Start Major Events
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
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
              Promotion Rules
            </div>

            <h3 style={{ marginTop: 0, marginBottom: 18 }}>
              Availability and purchase behavior
            </h3>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 16,
                background: "#fafafa",
                color: "#475467",
                lineHeight: 1.7,
              }}
            >
              Availability is shown in real time inside Campaign Builder. Promo
              inventory is not held while browsing. Placement remains available
              until successful payment, and inventory is counted only after
              payment is completed.
            </div>
          </section>
        </div>

        <aside
          style={{
            position: "sticky",
            top: 24,
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            padding: 24,
            background: "#ffffff",
            boxShadow: "0 14px 32px rgba(15,23,42,0.06)",
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
            Pricing Summary
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={summaryRow}>
              <span>Event Submission Fee</span>
              <strong>${centsToDollars(EVENT_FEE_CENTS)}</strong>
            </div>

            <div style={summaryRow}>
              <span>Add Promo Placements</span>
              <strong style={{ textAlign: "right" }}>
                Select Campaign Builder™
              </strong>
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: 14,
                display: "grid",
                gap: 8,
                color: "#475467",
              }}
            >
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: 14,
                ...summaryRow,
                fontSize: 18,
              }}
            >
              <span style={{ fontWeight: 800 }}>Current Total</span>
              <strong>${centsToDollars(EVENT_FEE_CENTS)}</strong>
            </div>

            <button
              type="button"
              style={{ ...primaryButtonStyle, width: "100%" }}
              onClick={() => openCampaignBuilder()}
            >
              Campaign Builder
            </button>

            <button
              type="button"
              style={{ ...secondaryButtonStyle, width: "100%" }}
              onClick={continueWithoutCampaign}
            >
              Continue to Review
            </button>
          </div>
        </aside>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: "#98A2B3",
              textAlign: "center",
            }}
          >
            Event ID:{" "}
            <span style={{ fontWeight: 600, color: "#667085" }}>
              {activeEventId || "—"}
              </span>
            </div>      
          </div>
    </SubmitEventLayout>
  );
}
