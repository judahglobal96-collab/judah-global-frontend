import { Link, useNavigate, useParams } from "react-router-dom";

type PromotionTier = {
  title: string;
  price: string;
  description: string;
  highlights: string[];
  statusLabel: string;
};

export default function OrgPromoteEventPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const basePath = orgUuid ? `/org/${orgUuid}` : "/org";
  const isAdminPreview = Boolean(orgUuid);

  const orgSubscriptionActive = true;

  const promotionTiers: PromotionTier[] = [
    {
      title: "Featured Badge",
      price: orgSubscriptionActive ? "$89 Add-On" : "$109 Add-On",
      description:
        "Add a featured badge to an approved event after payment is confirmed and admin activates the promotion.",
      highlights: [
        "Ideal for added visibility",
        "Promotion begins after admin toggle",
        "Designed as a paid event add-on",
      ],
      statusLabel: "Tier 3",
    },
    {
      title: "Top Row Featured Placement",
      price: orgSubscriptionActive ? "$209 Weekly" : "$249 Weekly",
      description:
        "Place an approved event in the top featured row across the first pages of discovery for elevated visibility.",
      highlights: [
        "High-visibility promotional tier",
        "Reserved premium inventory placement",
        "Best for major conferences, concerts, and destination events",
      ],
      statusLabel: "Tier 2",
    },
    {
      title: "Major Events Access",
      price: orgSubscriptionActive ? "$149 Promotion Tier" : "$249 Promotion Tier",
      description:
        "List an approved event within the Major Events area for stronger branded promotion and elevated discovery presence.",
      highlights: [
        "Dedicated promotional positioning",
        "Supports campaign-style event visibility",
        "Aligned with future paid marketing growth",
      ],
      statusLabel: "Tier 1",
    },
  ];

  function handleLaunchCampaignBuilder() {
    navigate("/campaign-builder", {
      state: {
        orgUuid: orgUuid || null,
        source: "org-submit-event-monetization",
        includeEventFee: false,
        orgSubscriptionActive,
        waiveEventPayment: false,
      },
    });
  }

  return (
    <div
      style={{
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
          Promote Event
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
          Promote approved events with premium visibility options designed to help
          organizations expand reach, strengthen turnout, and highlight major
          gatherings across Judah Global.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              background: "rgba(200,169,107,0.14)",
              color: "#f3d89b",
              border: "1px solid rgba(200,169,107,0.24)",
            }}
          >
            Org Subscription: {orgSubscriptionActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to={basePath}
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
            Back to Overview
          </Link>

          <Link
            to={`${basePath}/approved-events`}
            style={{
              textDecoration: "none",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
              color: "#fffaf0",
              border: "1px solid rgba(200,169,107,0.34)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            }}
          >
            View Approved Events
          </Link>

          <button
            type="button"
            onClick={handleLaunchCampaignBuilder}
            style={{
              background: "#c8a96b",
              color: "#111318",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            }}
          >
            Launch Campaign Builder
          </button>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
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
            Promotion Options
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Promotional tiers for approved events
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {promotionTiers.map((tier) => (
              <div
                key={tier.title}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#fffaf0",
                        fontSize: "1.02rem",
                        marginBottom: "4px",
                      }}
                    >
                      {tier.title}
                    </div>

                    <div
                      style={{
                        color: "#c8a96b",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {tier.price}
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      background: "rgba(200,169,107,0.14)",
                      color: "#f3d89b",
                      border: "1px solid rgba(200,169,107,0.24)",
                    }}
                  >
                    {tier.statusLabel}
                  </span>
                </div>

                <p
                  style={{
                    margin: "0 0 14px",
                    color: "rgba(245, 241, 232, 0.78)",
                    lineHeight: 1.7,
                    fontSize: "0.96rem",
                  }}
                >
                  {tier.description}
                </p>

                <div style={{ display: "grid", gap: "8px" }}>
                  {tier.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      style={{
                        color: "#fffaf0",
                        fontSize: "0.93rem",
                        lineHeight: 1.5,
                      }}
                    >
                      • {highlight}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
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
              Promotion Rules
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Approved Event Required
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Promotion applies only after event approval
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Payment First
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Promotion becomes active after payment confirmation
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Admin Activation
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Admin toggles the promotion after paid approval workflow
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Expansion Ready
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Page prepared for future payment and promotion automation
                </div>
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
              Current Status
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                color: "#fffaf0",
                fontSize: "1.2rem",
              }}
            >
              Promotion checkout is ready to launch
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.65,
              }}
            >
              This page is now wired to the Campaign Builder for org promotion
              purchases and aligned to Judah Global’s locked promotion system.
            </p>

            <button
              type="button"
              onClick={handleLaunchCampaignBuilder}
              style={{
                background: "#c8a96b",
                color: "#111318",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
              }}
            >
              Open Campaign Builder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}