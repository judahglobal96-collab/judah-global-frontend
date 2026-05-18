import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PlacementType =
  | "event_fee"
  | "hero"
  | "homepage_top"
  | "homepage_top_row"
  | "discovery_top"
  | "discovery_top_row"
  | "featured_badge"
  | "major_events"
  | "official_flyer"
  | "org_subscription";

type NormalizedPlacementType =
  | "event_fee"
  | "hero"
  | "homepage_top"
  | "discovery_top"
  | "featured_badge"
  | "major_events"
  | "official_flyer"
  | "org_subscription";

type CampaignReviewItem = {
  id: string;
  placement_type: PlacementType;
  placement_date?: string;
  start_date?: string;
  quantity: number;
  duration_days?: number | null;
  status?: string;
  region_code?: string | null;
};

type CampaignReviewData = {
  id: string;
  campaign_name: string;
  organization_name: string;
  contact_email: string;
  goal?: string | null;
  notes?: string | null;
  status: string;
  items: CampaignReviewItem[];
  waive_event_payment?: boolean;
  org_subscription_active?: boolean;
};

type CampaignFormState = {
  campaignName: string;
  organization: string;
  contactEmail: string;
  goal: string;
  notes: string;
};

type AvailabilityStatus = "unknown" | "available" | "unavailable";
type PromoPreviewState = "no_media" | "pending" | "approved" | "rejected";

type BuilderPlacementType =
  | "event_fee"
  | "hero"
  | "homepage_top"
  | "discovery_top"
  | "featured_badge"
  | "major_events"
  | "official_flyer"
  | "org_subscription";

type BuilderItem = {
  id: string;
  placementType: BuilderPlacementType;
  startDate: string;
  quantity: number;
  durationDays: number | null;
  availability: AvailabilityStatus;
  hasLocalMedia?: boolean;
  localMediaFileName?: string;
  localMediaPreviewUrl?: string | null;
  mediaStatus?: PromoPreviewState;
  isLocked?: boolean;
};

type BuilderDraft = {
  form: CampaignFormState;
  items: BuilderItem[];
  calendarPlacementType: BuilderPlacementType;
  calendarAnchorDate: string;
  quickBuilderPlacementType: BuilderPlacementType;
  quickBuilderWeeks: number;
  selectedItemId?: string | null;
  statusMessage?: string;
};

type ReviewLocationState = {
  campaignId?: string;
  campaignCode?: string;
  eventId?: string;
  orgUuid?: string;
  source?: string;
  builderDraft?: BuilderDraft;
};

const API_BASE = "http://localhost:4000/api/v1/campaigns";

const EVENT_FEE_DOLLARS = 79;
const FEATURED_BADGE_PUBLIC_DOLLARS = 109;
const FEATURED_BADGE_ORG_DOLLARS = 89;
const MAJOR_EVENTS_PUBLIC_DOLLARS = 249;
const MAJOR_EVENTS_ORG_DOLLARS = 149;
const OFFICIAL_FLYER_DOLLARS = 49;
const HOMEPAGE_HERO_PUBLIC_DOLLARS = 449;
const HOMEPAGE_TOP_PUBLIC_DOLLARS = 249;
const DISCOVERY_TOP_PUBLIC_DOLLARS = 229;
const HOMEPAGE_HERO_ORG_DOLLARS = 399;
const HOMEPAGE_TOP_ORG_DOLLARS = 209;
const DISCOVERY_TOP_ORG_DOLLARS = 209;
const ORG_SUBSCRIPTION_DOLLARS = 299;

const ORG_AFRICA_HERO_DOLLARS = 329;
const ORG_AFRICA_HOMEPAGE_TOP_DOLLARS = 229;
const ORG_AFRICA_DISCOVERY_TOP_DOLLARS = 179;
const ORG_AFRICA_MAJOR_EVENTS_DOLLARS = 159;
const ORG_AFRICA_FEATURED_BADGE_DOLLARS = 89;

function normalizePlacementType(type: PlacementType): NormalizedPlacementType {
  switch (type) {
    case "event_fee":
      return "event_fee";
    case "homepage_top":
    case "homepage_top_row":
      return "homepage_top";
    case "discovery_top":
    case "discovery_top_row":
      return "discovery_top";
    case "featured_badge":
      return "featured_badge";
    case "major_events":
      return "major_events";
    case "official_flyer":
      return "official_flyer";
    case "org_subscription":
      return "org_subscription";
    case "hero":
    default:
      return "hero";
  }
}

function normalizeRegionCode(regionCode?: string | null) {
  const normalized = String(regionCode || "USA").trim().toUpperCase();

  if (normalized === "CA") return "CANADA";
  if (normalized === "CAN") return "CANADA";
  if (normalized === "UNITED_KINGDOM") return "UK";
  if (normalized === "GB") return "UK";

  if (["USA", "CANADA", "UK", "AFRICA", "GLOBAL"].includes(normalized)) {
    return normalized;
  }

  return "USA";
}

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date: string) {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getPlacementLabel(type: PlacementType | NormalizedPlacementType) {
  const normalized = normalizePlacementType(type as PlacementType);

  switch (normalized) {
    case "event_fee":
      return "Event Submission Fee";
    case "hero":
      return "Homepage Hero";
    case "homepage_top":
      return "Homepage Top Row";
    case "discovery_top":
      return "Discovery Top Row";
    case "featured_badge":
      return "Featured Badge";
    case "major_events":
      return "Major Events Access";
    case "official_flyer":
      return "Official Event Flyer";
    case "org_subscription":
      return "Organization Annual Subscription";
    default:
      return "Placement";
  }
}

function isDurationPlacement(type: PlacementType) {
  return normalizePlacementType(type) === "major_events";
}

function isFlyerPlacement(type: PlacementType) {
  return normalizePlacementType(type) === "official_flyer";
}

function isEventFeePlacement(type: PlacementType) {
  return normalizePlacementType(type) === "event_fee";
}

function isOrgSubscriptionPlacement(type: PlacementType) {
  return normalizePlacementType(type) === "org_subscription";
}

function isOrgFlow(params: { orgUuid?: string; source?: string }) {
  return Boolean(params.orgUuid) || params.source === "org-submit-event-monetization";
}

function shouldWaiveEventFee(params: { waiveEventPayment?: boolean }) {
  return Boolean(params.waiveEventPayment);
}

function getPlacementPrice(
  type: PlacementType,
  options?: {
    isOrgFlow?: boolean;
    orgSubscriptionActive?: boolean;
    regionCode?: string | null;
  }
) {
  const orgFlow = Boolean(options?.isOrgFlow);
  const useOrgRates = orgFlow;
  const regionCode = normalizeRegionCode(options?.regionCode);
  const useAfricaOrgRates = useOrgRates && regionCode === "AFRICA";
  const normalized = normalizePlacementType(type);

  switch (normalized) {
    case "event_fee":
      return EVENT_FEE_DOLLARS;
    case "hero":
      return useAfricaOrgRates
        ? ORG_AFRICA_HERO_DOLLARS
        : useOrgRates
        ? HOMEPAGE_HERO_ORG_DOLLARS
        : HOMEPAGE_HERO_PUBLIC_DOLLARS;
    case "homepage_top":
      return useAfricaOrgRates
        ? ORG_AFRICA_HOMEPAGE_TOP_DOLLARS
        : useOrgRates
        ? HOMEPAGE_TOP_ORG_DOLLARS
        : HOMEPAGE_TOP_PUBLIC_DOLLARS;
    case "discovery_top":
      return useAfricaOrgRates
        ? ORG_AFRICA_DISCOVERY_TOP_DOLLARS
        : useOrgRates
        ? DISCOVERY_TOP_ORG_DOLLARS
        : DISCOVERY_TOP_PUBLIC_DOLLARS;
    case "featured_badge":
      return useAfricaOrgRates
        ? ORG_AFRICA_FEATURED_BADGE_DOLLARS
        : useOrgRates
        ? FEATURED_BADGE_ORG_DOLLARS
        : FEATURED_BADGE_PUBLIC_DOLLARS;
    case "major_events":
      return useAfricaOrgRates
        ? ORG_AFRICA_MAJOR_EVENTS_DOLLARS
        : useOrgRates
        ? MAJOR_EVENTS_ORG_DOLLARS
        : MAJOR_EVENTS_PUBLIC_DOLLARS;
    case "official_flyer":
      return OFFICIAL_FLYER_DOLLARS;
    case "org_subscription":
      return ORG_SUBSCRIPTION_DOLLARS;
    default:
      return 0;
  }
}

function getItemStartDate(item: CampaignReviewItem) {
  return item.start_date || item.placement_date || "";
}

function getItemDurationDays(item: CampaignReviewItem) {
  if (item.duration_days !== null && item.duration_days !== undefined) {
    return item.duration_days;
  }

  if (isDurationPlacement(item.placement_type)) return 21;
  return null;
}

function getSafeQuantity(item: CampaignReviewItem) {
  if (
    isEventFeePlacement(item.placement_type) ||
    isFlyerPlacement(item.placement_type) ||
    isDurationPlacement(item.placement_type) ||
    isOrgSubscriptionPlacement(item.placement_type)
  ) {
    return 1;
  }

  return Math.max(1, item.quantity || 1);
}

function getItemScheduleLabel(item: CampaignReviewItem) {
  const startDate = getItemStartDate(item);
  const quantity = getSafeQuantity(item);

  if (isEventFeePlacement(item.placement_type)) {
    return "Required one-time event submission fee";
  }

  if (isFlyerPlacement(item.placement_type)) {
    return "One-time placement · lives until linked event expires";
  }

  if (isOrgSubscriptionPlacement(item.placement_type)) {
    return `Annual subscription starting ${formatDate(startDate)}`;
  }

  if (isDurationPlacement(item.placement_type)) {
    return `${formatDate(startDate)} · ${getItemDurationDays(item) ?? 21}-day activation`;
  }

  if (quantity <= 1) return `Week of ${formatDate(startDate)}`;
  return `${quantity} weeks starting ${formatDate(startDate)}`;
}

function getLineTotal(
  item: CampaignReviewItem,
  options?: {
    isOrgFlow?: boolean;
    orgSubscriptionActive?: boolean;
    waiveEventPayment?: boolean;
    regionCode?: string | null;
  }
) {
  if (
    isEventFeePlacement(item.placement_type) &&
    shouldWaiveEventFee({ waiveEventPayment: options?.waiveEventPayment })
  ) {
    return 0;
  }

  return (
    getPlacementPrice(item.placement_type, {
      isOrgFlow: options?.isOrgFlow,
      orgSubscriptionActive: options?.orgSubscriptionActive,
      regionCode: options?.regionCode,
    }) * getSafeQuantity(item)
  );
}

function getItemWindowLabel(item: CampaignReviewItem, options?: { waiveEventPayment?: boolean }) {
  if (isEventFeePlacement(item.placement_type)) {
    if (shouldWaiveEventFee({ waiveEventPayment: options?.waiveEventPayment })) {
      return "Required fee for the linked event submission. This fee has been waived and will not be charged at checkout.";
    }

    return "Required fee for the linked event submission. This fee is automatically included.";
  }

  if (isFlyerPlacement(item.placement_type)) {
    return "Official flyer remains active until the linked event expires.";
  }

  if (isOrgSubscriptionPlacement(item.placement_type)) {
    return "Annual organization subscription with org pricing and benefits once active.";
  }

  if (isDurationPlacement(item.placement_type)) {
    return `Fixed ${getItemDurationDays(item) ?? 21}-day activation period`;
  }

  return "Weekly placement inventory is confirmed at successful payment.";
}

function getItemUnitLabel(item: CampaignReviewItem) {
  if (isEventFeePlacement(item.placement_type)) return "Required one-time fee";
  if (isFlyerPlacement(item.placement_type)) return "One-time flyer placement";
  if (isOrgSubscriptionPlacement(item.placement_type)) return "One annual subscription";
  if (isDurationPlacement(item.placement_type)) return `One ${getItemDurationDays(item) ?? 21}-day activation`;
  return `Weeks: ${getSafeQuantity(item)}`;
}

function getStatusTone(status?: string): React.CSSProperties {
  const value = (status || "").toLowerCase();

  if (
    value.includes("ready") ||
    value.includes("draft") ||
    value.includes("pending") ||
    value.includes("review")
  ) {
    return {
      background: "#eff8ff",
      border: "1px solid #b2ddff",
      color: "#175cd3",
    };
  }

  if (value.includes("paid") || value.includes("complete") || value.includes("approved")) {
    return {
      background: "#ecfdf3",
      border: "1px solid #abefc6",
      color: "#027a48",
    };
  }

  if (value.includes("unavailable") || value.includes("failed") || value.includes("rejected")) {
    return {
      background: "#fef3f2",
      border: "1px solid #fecdca",
      color: "#b42318",
    };
  }

  return {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    color: "#475467",
  };
}

export default function CampaignReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as ReviewLocationState;

  const campaignId = locationState.campaignId;
  const campaignCode = locationState.campaignCode;
  const eventId = locationState.eventId;
  const orgUuid = locationState.orgUuid;
  const source = locationState.source;
  const builderDraft = locationState.builderDraft;

  const locationOrgFlow = isOrgFlow({ orgUuid, source });

  const [campaign, setCampaign] = useState<CampaignReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const effectiveOrgFlow = useMemo(() => locationOrgFlow, [locationOrgFlow]);

  const subtotal = useMemo(() => {
    if (!campaign?.items?.length) return 0;

    return campaign.items.reduce((sum, item) => {
      return (
        sum +
        getLineTotal(item, {
          isOrgFlow: effectiveOrgFlow,
          orgSubscriptionActive: campaign.org_subscription_active,
          waiveEventPayment: campaign.waive_event_payment,
          regionCode: item.region_code,
        })
      );
    }, 0);
  }, [campaign, effectiveOrgFlow]);

  const groupedSummary = useMemo(() => {
    if (!campaign?.items?.length) return [];

    const grouped = new Map<
      NormalizedPlacementType,
      { lineItems: number; units: number; total: number }
    >();

    for (const item of campaign.items) {
      const normalized = normalizePlacementType(item.placement_type);
      const current = grouped.get(normalized) ?? {
        lineItems: 0,
        units: 0,
        total: 0,
      };

      current.lineItems += 1;
      current.units += getSafeQuantity(item);
      current.total += getLineTotal(item, {
        isOrgFlow: effectiveOrgFlow,
        orgSubscriptionActive: campaign.org_subscription_active,
        waiveEventPayment: campaign.waive_event_payment,
        regionCode: item.region_code,
      });

      grouped.set(normalized, current);
    }

    return Array.from(grouped.entries()).map(([type, value]) => ({
      type,
      label:
        type === "event_fee" && campaign.waive_event_payment
          ? "Event Submission Fee (Waived)"
          : getPlacementLabel(type),
      lineItems: value.lineItems,
      units: value.units,
      total: value.total,
    }));
  }, [campaign, effectiveOrgFlow]);

  useEffect(() => {
    async function loadCampaignReview() {
      if (!campaignId) {
        setErrorMessage("Missing campaign ID. Please return to the Campaign Builder.");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");

        const response = await fetch(`${API_BASE}/create-review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ campaignId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load campaign review.");
        }

        setCampaign({
          ...data,
          items: Array.isArray(data?.items) ? data.items : [],
          waive_event_payment: Boolean(data?.waive_event_payment),
          org_subscription_active: Boolean(data?.org_subscription_active),
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load campaign review right now."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCampaignReview();
  }, [campaignId]);

  async function handlePayCampaign() {
    if (!campaignId) {
      setErrorMessage("Missing campaign ID.");
      return;
    }

    setIsCreatingCheckout(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ campaignId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create campaign checkout session.");
      }

      if (!data?.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start payment right now."
      );
      setIsCreatingCheckout(false);
    }
  }

  function handleBackToBuilder() {
    navigate("/campaign-builder", {
      state: {
        campaignId: campaignId || null,
        campaignCode: campaignCode || null,
        eventId: eventId || null,
        orgUuid: orgUuid || null,
        source: source || null,
        includeEventFee: true,
        builderDraft: builderDraft || null,
      },
    });
  }

  const pageShell: React.CSSProperties = {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 24px 64px",
    color: "#101828",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 1180,
    margin: "0 auto",
  };

  const heroStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))",
    border: "1px solid #e5e7eb",
    borderRadius: 24,
    padding: "28px 28px 24px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.04)",
  };

  const topMetaStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#b69240",
    marginBottom: 10,
    fontWeight: 700,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "3rem",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#101828",
  };

  const descStyle: React.CSSProperties = {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 820,
    color: "#475467",
    lineHeight: 1.7,
    fontSize: "1rem",
  };

  const mainGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 24,
    alignItems: "start",
    marginTop: 32,
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 24,
    background: "#ffffff",
    boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 18,
    fontSize: 18,
    fontWeight: 800,
    color: "#101828",
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
    width: "100%",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: "#ffffff",
    color: "#101828",
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (isLoading) {
    return (
      <div style={pageShell}>
        <div style={containerStyle}>
          <section style={heroStyle}>
            <div style={topMetaStyle}>Judah Global Monetization</div>
            <h1 style={titleStyle}>Campaign Review</h1>
            <p style={descStyle}>Loading campaign review...</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={pageShell}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div style={topMetaStyle}>Judah Global Monetization</div>
          <h1 style={titleStyle}>Campaign Review</h1>
          <p style={descStyle}>
            Review your selected campaign items before continuing to secure payment.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button type="button" onClick={handleBackToBuilder} style={secondaryButtonStyle}>
              Back to Campaign Builder
            </button>

            <button
              type="button"
              onClick={handlePayCampaign}
              disabled={isCreatingCheckout || !campaign}
              style={{
                ...primaryButtonStyle,
                width: "auto",
                minWidth: 220,
                opacity: isCreatingCheckout ? 0.7 : 1,
              }}
            >
              {isCreatingCheckout ? "Redirecting to Stripe..." : "Continue to Payment"}
            </button>
          </div>
        </section>

        {errorMessage ? (
          <div
            style={{
              marginTop: 18,
              border: "1px solid #fecdca",
              background: "#fef3f2",
              color: "#b42318",
              borderRadius: 14,
              padding: 14,
              fontWeight: 700,
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <section style={mainGridStyle}>
          <div style={{ display: "grid", gap: 24 }}>
            <section style={cardStyle}>
              <div style={topMetaStyle}>Campaign Information</div>
              <h3 style={sectionTitleStyle}>Campaign details</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <InfoBlock label="Campaign Name" value={campaign?.campaign_name || "—"} />
                <InfoBlock label="Organization" value={campaign?.organization_name || "—"} />
                <InfoBlock label="Contact Email" value={campaign?.contact_email || "—"} />
                <InfoBlock label="Status" value={campaign?.status || "—"} />
                <InfoBlock label="Campaign ID" value={campaign?.id || "—"} />
                <InfoBlock label="Campaign Code" value={campaignCode || "—"} />
              </div>

              <div style={{ marginTop: 18 }}>
                <InfoBlock label="Goal" value={campaign?.goal || "—"} fullWidth />
              </div>

              <div style={{ marginTop: 18 }}>
                <InfoBlock
                  label="Notes"
                  value={campaign?.notes || "No notes provided."}
                  fullWidth
                  multiline
                />
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                <InfoBlock
                  label="Org Subscription"
                  value={campaign?.org_subscription_active ? "Active" : "Inactive"}
                />
                <InfoBlock
                  label="Event Fee"
                  value={campaign?.waive_event_payment ? "Waived" : "Standard"}
                />
              </div>
            </section>

            <section style={cardStyle}>
              <div style={topMetaStyle}>Campaign Items</div>
              <h3 style={sectionTitleStyle}>Items included in checkout</h3>

              <div style={{ display: "grid", gap: 14 }}>
                {campaign?.items?.length ? (
                  campaign.items.map((item, index) => {
                    const isWaivedEventFee =
                      isEventFeePlacement(item.placement_type) &&
                      shouldWaiveEventFee({
                        waiveEventPayment: campaign.waive_event_payment,
                      });

                    const unitPrice = getPlacementPrice(item.placement_type, {
                      isOrgFlow: effectiveOrgFlow,
                      orgSubscriptionActive: campaign.org_subscription_active,
                      regionCode: item.region_code,
                    });

                    const lineTotal = getLineTotal(item, {
                      isOrgFlow: effectiveOrgFlow,
                      orgSubscriptionActive: campaign.org_subscription_active,
                      waiveEventPayment: campaign.waive_event_payment,
                      regionCode: item.region_code,
                    });

                    const statusLabel = item.status || "ready for purchase";

                    return (
                      <div
                        key={item.id || `${item.placement_type}-${index}`}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 18,
                          padding: 18,
                          background: "#ffffff",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 16,
                            marginBottom: 12,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: "#101828" }}>
                              {isWaivedEventFee
                                ? "Event Submission Fee (Waived)"
                                : getPlacementLabel(item.placement_type)}
                            </div>

                            <div
                              style={{
                                marginTop: 6,
                                color: "#475467",
                                fontSize: 14,
                                lineHeight: 1.7,
                              }}
                            >
                              <div>Schedule: {getItemScheduleLabel(item)}</div>
                              <div>{getItemUnitLabel(item)}</div>
                              <div>Region: {normalizeRegionCode(item.region_code)}</div>
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                display: "inline-flex",
                                padding: "8px 12px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 800,
                                marginBottom: 10,
                                ...getStatusTone(statusLabel),
                              }}
                            >
                              {statusLabel}
                            </div>

                            <div style={{ fontWeight: 800, fontSize: 18, color: "#101828" }}>
                              {formatMoney(lineTotal)}
                            </div>

                            <div style={{ marginTop: 4, color: "#475467", fontSize: 12 }}>
                              {isWaivedEventFee
                                ? `Standard price ${formatMoney(unitPrice)}`
                                : `Unit price ${formatMoney(unitPrice)}`}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            borderTop: "1px solid #e5e7eb",
                            paddingTop: 12,
                            color: "#475467",
                            fontSize: 13,
                          }}
                        >
                          {getItemWindowLabel(item, {
                            waiveEventPayment: campaign.waive_event_payment,
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 14,
                      padding: 16,
                      background: "#fafafa",
                      color: "#475467",
                      fontWeight: 600,
                    }}
                  >
                    No campaign items were found for this review.
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside style={{ position: "sticky", top: 24, ...cardStyle }}>
            <div style={topMetaStyle}>Payment Summary</div>
            <h3 style={sectionTitleStyle}>Ready for secure checkout</h3>

            <div style={{ display: "grid", gap: 14 }}>
              {groupedSummary.map((row) => (
                <div
                  key={row.type}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <span>{row.label}</span>
                    <span style={{ color: "#475467", fontSize: 13 }}>
                      {row.lineItems} line item{row.lineItems > 1 ? "s" : ""} · {row.units} unit
                      {row.units > 1 ? "s" : ""}
                    </span>
                  </div>
                  <strong>{formatMoney(row.total)}</strong>
                </div>
              ))}

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 14,
                  display: "grid",
                  gap: 8,
                  color: "#475467",
                }}
              >
                <div>Campaign Name: {campaign?.campaign_name || "—"}</div>
                <div>Organization: {campaign?.organization_name || "—"}</div>
                <div>Total Line Items: {campaign?.items?.length || 0}</div>
                <div>Status: {campaign?.status || "—"}</div>
                <div>Org Subscription: {campaign?.org_subscription_active ? "Active" : "Inactive"}</div>
                <div>Event Fee: {campaign?.waive_event_payment ? "Waived" : "Charged normally"}</div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  fontSize: 18,
                }}
              >
                <span style={{ fontWeight: 800 }}>Campaign Total</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>

              <div
                style={{
                  border: "1px dashed #d0d5dd",
                  background: "#fafafa",
                  borderRadius: 14,
                  padding: 16,
                  color: "#475467",
                  lineHeight: 1.65,
                  fontSize: 14,
                }}
              >
                Availability is checked live during review and purchase. Promo inventory is only
                counted after successful payment.
              </div>

              <button
                type="button"
                onClick={handlePayCampaign}
                disabled={isCreatingCheckout || !campaign}
                style={{
                  ...primaryButtonStyle,
                  opacity: isCreatingCheckout ? 0.7 : 1,
                }}
              >
                {isCreatingCheckout ? "Redirecting to Stripe..." : "Continue to Payment"}
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  fullWidth = false,
  multiline = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
  multiline?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        background: "#fafafa",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#667085",
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#101828",
          fontWeight: 700,
          lineHeight: multiline ? 1.7 : 1.5,
          whiteSpace: multiline ? "pre-wrap" : "normal",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}