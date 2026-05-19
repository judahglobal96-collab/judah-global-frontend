import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyOrganization, getOrganizationByUuid } from "../../lib/org.api";

type OrgData = {
  id: string;
  org_uuid: string;
  organization_name: string;
  status: string;
  verification_status: string;
  created_at: string | null;
  account_type?: string;
  subscription_region?: string | null;
  subscription_status?: string | null;
  subscription_started_at?: string | null;
  subscription_expires_at?: string | null;
};

type FeatureItem = {
  title: string;
  text: string;
  to: string;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRegion(region?: string | null) {
  switch ((region || "").toLowerCase()) {
    case "usa":
      return "United States";
    case "canada":
      return "Canada";
    case "uk":
      return "United Kingdom";
    case "africa":
      return "Africa";
    default:
      return "—";
  }
}

export default function ActivatedOrgPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdminPreview = Boolean(orgUuid);

  useEffect(() => {
    let isMounted = true;

    async function loadOrganization() {
      try {
        setLoading(true);
        setError("");

        const response = orgUuid
          ? await getOrganizationByUuid(orgUuid)
          : await getMyOrganization();

        if (!isMounted) return;

        const org = response?.organization || null;

        if (!org) {
          setError("Organization not found");
          return;
        }

        if (orgUuid && org.org_uuid !== orgUuid) {
          setError("This organization portal could not be loaded.");
          return;
        }

        setOrganization(org);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load organization");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrganization();

    return () => {
      isMounted = false;
    };
  }, [orgUuid]);

  const orgName = organization?.organization_name || "Organization";
  const orgStatus = organization?.status || "Pending";
  const accountType =
    organization?.account_type || "Annual Organization Subscription";
  const subscriptionStatus = organization?.subscription_status || "pending";
  const subscriptionRegion = formatRegion(organization?.subscription_region);

  const isSubscriptionActive =
    subscriptionStatus === "active" &&
    (!organization?.subscription_expires_at ||
      new Date(organization.subscription_expires_at).getTime() > Date.now());

  const baseOrgPath = organization?.org_uuid
    ? `/org/${organization.org_uuid}`
    : orgUuid
    ? `/org/${orgUuid}`
    : "/org";

  const previewSuffix = isAdminPreview ? "?adminPreview=1" : "";

  const featureItems: FeatureItem[] = [
    {
      title: "Submit Event",
      text: "Create and submit events for admin review and approval before they go live across Judah Global.",
      to: `${baseOrgPath}/submit-event${previewSuffix}`,
    },
    {
      title: "Promote Event",
      text: "Increase visibility for major events with elevated placement and future promotional options.",
      to: `${baseOrgPath}/promote-event${previewSuffix}`,
    },
    {
      title: "Approved Events",
      text: "Review the events your organization has successfully published on the platform.",
      to: `${baseOrgPath}/approved-events${previewSuffix}`,
    },
    {
      title: "Upload Media",
      text: "Add approved flyers and visual assets to support stronger event presentation and discovery.",
      to: `${baseOrgPath}/upload-media${previewSuffix}`,
    },
    {
      title: "Build Presence",
      text: "Strengthen your organization identity as Judah Global expands its organization tools.",
      to: `${baseOrgPath}/build-presence${previewSuffix}`,
    },
  ];

  if (loading) {
    return <div style={{ color: "#f5f1e8" }}>Loading organization portal...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          color: "#f5f1e8",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Organization Portal</h2>
        <p style={{ marginBottom: 0 }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#f5f1e8",
      }}
    >
      {isAdminPreview && (
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
            Return to Admin Portal
          </button>
        </div>
      )}

      <section
        style={{
          width: "100%",
          boxSizing: "border-box",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: "32px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.76rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8a96b",
                marginBottom: "10px",
              }}
            >
              Activated Organization
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.1,
                color: "#fffaf0",
              }}
            >
              {orgName}
            </h2>

            <p
              style={{
                margin: "12px 0 0",
                maxWidth: "760px",
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.7,
                fontSize: "0.98rem",
              }}
            >
              {orgName} is now active on Judah Global. Your organization can now
              submit events, promote key gatherings, build visibility, and grow
              your presence across the platform.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "180px",
              }}
            >
              <Link
                to={`${baseOrgPath}/submit-event${previewSuffix}`}
                style={primaryLinkStyle}
              >
                Submit Event
              </Link>

              <Link
                to={`${baseOrgPath}/promote-event${previewSuffix}`}
                style={secondaryLinkStyle}
              >
                Promote Event
              </Link>

              <Link
                to={`${baseOrgPath}/media-placement-guide${previewSuffix}`}
                style={secondaryLinkStyle}
              >
                Media Placement Guide
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <InfoCard
              label="Status"
              value={isSubscriptionActive ? "Active" : orgStatus}
              highlight
            />
            <InfoCard
              label="Subscribed"
              value={formatDate(organization?.subscription_started_at)}
            />
            <InfoCard label="Account Type" value={accountType} />
            <InfoCard
              label="Organization ID"
              value={organization?.org_uuid || "—"}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "24px",
        }}
      >
        <div style={panelStyle}>
          <div style={eyebrowStyle}>What You Can Do</div>

          <h3 style={sectionTitleStyle}>Organization features include:</h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {featureItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.to)}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  padding: "16px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fffaf0",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.78)",
                    lineHeight: 1.6,
                    fontSize: "0.96rem",
                  }}
                >
                  {item.text}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div style={panelStyle}>
            <div style={eyebrowStyle}>Organization Details</div>

            <div style={{ display: "grid", gap: "14px" }}>
              <DetailRow label="Organization" value={orgName} />
              <DetailRow label="Account Type" value={accountType} />
              <DetailRow
                label="Subscription Status"
                value={subscriptionStatus}
              />
              <DetailRow label="Region" value={subscriptionRegion} />
              <DetailRow
                label="Started"
                value={formatDate(organization?.subscription_started_at)}
              />
              <DetailRow
                label="Expires"
                value={formatDate(organization?.subscription_expires_at)}
              />
              <DetailRow label="Access" value="Private Organization Portal" />
              <DetailRow label="Visibility" value="Active on Judah Global" />
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
            <div style={eyebrowStyle}>Next Step</div>

            <h3 style={sectionTitleStyle}>Start by submitting your first event</h3>

            <p
              style={{
                margin: 0,
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.65,
              }}
            >
              Begin building your organization presence by submitting an event
              for review. Once approved, your event can appear in discovery and
              support broader audience reach.
            </p>

            <div style={{ marginTop: "18px" }}>
              <Link
                to={`${baseOrgPath}/submit-event${previewSuffix}`}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  background: "#c8a96b",
                  color: "#111318",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  fontWeight: 800,
                }}
              >
                Go to Submit Event
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const primaryLinkStyle = {
  textDecoration: "none",
  background:
    "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
  color: "#fffaf0",
  border: "1px solid rgba(200,169,107,0.34)",
  borderRadius: "14px",
  padding: "12px 18px",
  fontWeight: 700,
  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
};

const secondaryLinkStyle = {
  textDecoration: "none",
  background: "rgba(255,255,255,0.04)",
  color: "#fffaf0",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "12px 18px",
  fontWeight: 700,
};

const panelStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  padding: "24px",
};

const eyebrowStyle = {
  fontSize: "0.76rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color: "#c8a96b",
  marginBottom: "10px",
};

const sectionTitleStyle = {
  margin: "0 0 18px",
  fontSize: "1.35rem",
  color: "#fffaf0",
};

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight
          ? "rgba(200, 169, 107, 0.12)"
          : "rgba(255,255,255,0.04)",
        border: highlight
          ? "1px solid rgba(200, 169, 107, 0.28)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#c8a96b",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fffaf0",
          textTransform: label.toLowerCase().includes("status")
            ? "capitalize"
            : "none",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          color: "rgba(245, 241, 232, 0.58)",
          fontSize: "0.84rem",
        }}
      >
        {label}
      </div>

      <div style={{ color: "#fffaf0", fontWeight: 600 }}>{value || "—"}</div>
    </div>
  );
}