import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../../lib/submit-event-draft";

const EVENT_FEE_CENTS = 7900;
const FEATURED_BADGE_CENTS = 7900;
const MAJOR_EVENT_ORG_CENTS = 10900;

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export default function OrgSubmitEventMonetizationPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  const draft = getSubmitEventDraft() || {};
  const existing = draft.monetization || {};

  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  const hasFeaturedBadge = Boolean(existing.hasFeaturedBadge);
  const hasMajorEventAccess = Boolean(existing.hasMajorEventAccess);

  const totalCents = useMemo(() => {
    return (
      EVENT_FEE_CENTS +
      (hasFeaturedBadge ? FEATURED_BADGE_CENTS : 0) +
      (hasMajorEventAccess ? MAJOR_EVENT_ORG_CENTS : 0)
    );
  }, [hasFeaturedBadge, hasMajorEventAccess]);

  async function saveOrgEventMetadata() {
    const currentDraft = getSubmitEventDraft() || {};
    const eventId = currentDraft.eventId || "";

    if (!eventId) {
      alert("Event draft ID is missing. Please return to Basics and try again.");
      throw new Error("Missing eventId");
    }

    if (!orgUuid) {
      alert("Organization ID is missing. Please return to the organization portal.");
      throw new Error("Missing orgUuid");
    }

    const token = localStorage.getItem("auth_token");

    console.log("SAVING ORG EVENT METADATA BEFORE CONTINUING:", {
      eventId,
      orgUuid,
      schedule: currentDraft.schedule,
      location: currentDraft.location,
      sponsor: currentDraft.sponsor,
    });

    const metadataRes = await fetch(
      `http://localhost:4000/api/v1/org/${orgUuid}/submit-event/review`,
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
          schedule: currentDraft.schedule || {},
          location: currentDraft.location || {},
          sponsor: currentDraft.sponsor || {},
        }),
      }
    );

    console.log("ORG METADATA SAVE STATUS:", metadataRes.status);

    const metadataData = await metadataRes.json().catch(() => ({}));

    if (!metadataRes.ok) {
      console.error("ORG METADATA SAVE FAILED:", metadataData);
      throw new Error(
        metadataData?.error ||
          metadataData?.message ||
          "Failed to save event metadata before continuing."
      );
    }

    console.log("ORG METADATA SAVE SUCCESS:", metadataData);

    return currentDraft;
  }

  async function openCampaignBuilder(
    selectedPlacement?: "featured_badge" | "major_events"
  ) {
    try {
      setIsSavingMetadata(true);

      const currentDraft = getSubmitEventDraft() || {};

      saveSubmitEventDraft({
        ...currentDraft,
        eventId: currentDraft.eventId || "",
        monetization: {
          ...currentDraft.monetization,
          hasFeaturedBadge: Boolean(currentDraft.monetization?.hasFeaturedBadge),
          hasMajorEventAccess: Boolean(currentDraft.monetization?.hasMajorEventAccess),
          estimatedTotalCents:
            EVENT_FEE_CENTS +
            (Boolean(currentDraft.monetization?.hasFeaturedBadge)
              ? FEATURED_BADGE_CENTS
              : 0) +
            (Boolean(currentDraft.monetization?.hasMajorEventAccess)
              ? MAJOR_EVENT_ORG_CENTS
              : 0),
        },
      });

      const savedDraft = await saveOrgEventMetadata();

      navigate("/campaign-builder", {
        state: {
          eventId: savedDraft.eventId || "",
          orgUuid: orgUuid || "",
          source: "org-submit-event-monetization",
          selectedPlacement,
          isOrgAccount: true,
        },
      });
    } catch (error) {
      console.error("Open Campaign Builder error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to continue to Campaign Builder."
      );
    } finally {
      setIsSavingMetadata(false);
    }
  }

  async function continueWithoutPromoPlacements() {
    try {
      setIsSavingMetadata(true);

      const currentDraft = getSubmitEventDraft() || {};

      saveSubmitEventDraft({
        ...currentDraft,
        eventId: currentDraft.eventId || "",
        monetization: {
          ...currentDraft.monetization,
          hasFeaturedBadge: Boolean(currentDraft.monetization?.hasFeaturedBadge),
          hasMajorEventAccess: Boolean(currentDraft.monetization?.hasMajorEventAccess),
          estimatedTotalCents:
            EVENT_FEE_CENTS +
            (Boolean(currentDraft.monetization?.hasFeaturedBadge)
              ? FEATURED_BADGE_CENTS
              : 0) +
            (Boolean(currentDraft.monetization?.hasMajorEventAccess)
              ? MAJOR_EVENT_ORG_CENTS
              : 0),
        },
      });

      await saveOrgEventMetadata();

      navigate(`${baseOrgPath}/submit-event/review`);
    } catch (error) {
      console.error("Continue without promo error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to continue to review."
      );
    } finally {
      setIsSavingMetadata(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    color: "#fffaf0",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: isSavingMetadata ? "wait" : "pointer",
    opacity: isSavingMetadata ? 0.7 : 1,
  };

  const primaryButtonStyle: React.CSSProperties = {
    background: "#c8a96b",
    color: "#111318",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    fontWeight: 800,
    cursor: isSavingMetadata ? "wait" : "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    opacity: isSavingMetadata ? 0.7 : 1,
  };

  const accentButton = (bg: string): React.CSSProperties => ({
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    cursor: isSavingMetadata ? "wait" : "pointer",
    border: "none",
    color: "#ffffff",
    background: bg,
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
    opacity: isSavingMetadata ? 0.7 : 1,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "#f5f1e8" }}>
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
        <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#c8a96b", marginBottom: "10px" }}>
          Organization Portal
        </div>

        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1, color: "#fffaf0" }}>
          Monetization & Promotion
        </h1>

        <p style={{ margin: "14px 0 0", maxWidth: "820px", color: "rgba(245, 241, 232, 0.82)", lineHeight: 1.7, fontSize: "0.98rem" }}>
          Campaign Builder is the central promotion experience for Judah Global. Plan high-visibility
          placements, upload promo media, select activation dates, review pricing, and complete
          checkout in one unified workflow.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 24 }}>
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
              background: "linear-gradient(135deg, rgba(200,169,107,0.18), rgba(200,169,107,0.08))",
              border: "1px solid rgba(200,169,107,0.28)",
              color: "#f3d89b",
              fontWeight: 700,
            }}
          >
            Step 5 of 6
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 24 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#c8a96b", marginBottom: "10px" }}>
              Campaign Builder
            </div>

            <h3 style={{ margin: "0 0 10px", color: "#fffaf0" }}>
              Use one unified promotion workflow
            </h3>

            <div style={{ color: "rgba(245,241,232,0.74)", lineHeight: 1.7, marginBottom: 18 }}>
              Build your promotion using Campaign Builder. Choose visibility options, upload media,
              select dates, and complete checkout in one guided workflow.
            </div>

            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 18, background: "rgba(255,255,255,0.03)", marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10, color: "#fffaf0" }}>
                What happens in Campaign Builder
              </div>

              <div style={{ color: "rgba(245,241,232,0.74)", lineHeight: 1.7 }}>
                <div>• Choose HERO, HomePage, Regional or other placements</div>
                <div>• View available weeks in green</div>
                <div>• Add one or multiple campaign items</div>
                <div>• Upload promo media</div>
                <div>• Select activation dates</div>
                <div>• Review exact pricing before payment</div>
                <div>• Placement is secured upon successful payment</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" style={primaryButtonStyle} disabled={isSavingMetadata} onClick={() => openCampaignBuilder()}>
                {isSavingMetadata ? "Saving..." : "Open Campaign Builder"}
              </button>

              <button type="button" style={secondaryButtonStyle} disabled={isSavingMetadata} onClick={continueWithoutPromoPlacements}>
                {isSavingMetadata ? "Saving..." : "Continue Without Promo Placements"}
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#c8a96b", marginBottom: "10px" }}>
              Add-Ons
            </div>

            <h3 style={{ margin: "0 0 18px", color: "#fffaf0" }}>Optional visibility enhancements</h3>

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                  <div>
                    <strong>Featured Badge</strong>
                    <div style={{ color: "rgba(245,241,232,0.74)", marginTop: 4, lineHeight: 1.6 }}>
                      Add a featured badge treatment across eligible Judah Global surfaces.
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: "#f3d89b" }}>+$79.00</div>
                  </div>

                  <button type="button" style={accentButton("#7F56D9")} disabled={isSavingMetadata} onClick={() => openCampaignBuilder("featured_badge")}>
                    Featured Badge Access
                  </button>
                </div>
              </div>

              <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                  <div>
                    <strong>Major Events Access</strong>
                    <div style={{ color: "rgba(245,241,232,0.74)", marginTop: 4, lineHeight: 1.6 }}>
                      Organization pricing for Major Events benefit area and access.
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: "#f3d89b" }}>+$109.00</div>
                  </div>

                  <button type="button" style={accentButton("#B69240")} disabled={isSavingMetadata} onClick={() => openCampaignBuilder("major_events")}>
                    Major Event Access
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#c8a96b", marginBottom: "10px" }}>
              Promotion Rules
            </div>

            <h3 style={{ margin: "0 0 18px", color: "#fffaf0" }}>
              Availability and purchase behavior
            </h3>

            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, background: "rgba(255,255,255,0.03)", color: "rgba(245,241,232,0.74)", lineHeight: 1.7 }}>
              Availability is shown in real time inside Campaign Builder. Promo inventory is not
              held while browsing. Placement remains available until successful payment, and
              inventory is counted only after payment is completed.
            </div>
          </div>
        </div>

        <aside style={{ position: "sticky", top: 24, ...cardStyle, boxShadow: "0 14px 32px rgba(0,0,0,0.16)" }}>
          <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#c8a96b", marginBottom: "10px" }}>
            Pricing Summary
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span>Event Submission Fee</span>
              <strong>${centsToDollars(EVENT_FEE_CENTS)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span>Featured Badge</span>
              <strong>{hasFeaturedBadge ? `+$${centsToDollars(FEATURED_BADGE_CENTS)}` : "$0.00"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span>Major Events Access</span>
              <strong>{hasMajorEventAccess ? `+$${centsToDollars(MAJOR_EVENT_ORG_CENTS)}` : "$0.00"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span>Promo Placements</span>
              <strong>Built in Campaign Builder</strong>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 14, display: "flex", justifyContent: "space-between", gap: 16, fontSize: "1.05rem" }}>
              <span style={{ color: "#fffaf0", fontWeight: 700 }}>Current Total</span>
              <strong style={{ color: "#f3d89b" }}>${centsToDollars(totalCents)}</strong>
            </div>

            <button type="button" style={primaryButtonStyle} disabled={isSavingMetadata} onClick={() => openCampaignBuilder()}>
              {isSavingMetadata ? "Saving..." : "Open Campaign Builder"}
            </button>

            <button type="button" style={secondaryButtonStyle} disabled={isSavingMetadata} onClick={continueWithoutPromoPlacements}>
              {isSavingMetadata ? "Saving..." : "Continue to Review"}
            </button>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: "#98A2B3", textAlign: "center" }}>
            Event ID:{" "}
            <span style={{ fontWeight: 600, color: "#667085" }}>
              {getSubmitEventDraft()?.eventId || "--"}
            </span>
          </div>
        </aside>
      </section>
    </div>
  );
}