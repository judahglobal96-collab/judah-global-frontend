import { Link, useNavigate, useParams } from "react-router-dom";

type PresenceFeature = {
  title: string;
  text: string;
};

export default function OrgBuildPresencePage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const basePath = orgUuid ? `/org/${orgUuid}` : "/org";
  const isAdminPreview = Boolean(orgUuid);

  const presenceFeatures: PresenceFeature[] = [
    {
      title: "Regional Zones",
      text: "Judah Global is build around (4) Regional Zone: USA, CANADA, UNITED KINGDOM, AFRICA.",
    },
    {
      title: "Campaign Builder",
      text: "Each Regional Zone is controlled within the Campaign Builder (top section).",
    },
    {
      title: "Regional Zones Control Placement",
      text: "All regional zones default to USA. You must select other regional zone to expand your outreach.",
    },
    {
      title: "Campaign Builder Plus+",
      text: "Avaialable dates and many options to build your brand strategy and control your cost. You can be creative and use a combination of promo types.",
    },
    {
      title: "Campaign Builder Recurring Dates",
      text: "This is an awesome tool if you have recurring event dates. Scroll to the bottom of the Campaign Builder and select (1) start date and numbers of weeks. i.e. July 4, 2026 x 6 weeks. Campaign Builder will load all 6 weeks of events for your review.",
    },

  ];

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
          Build Presence
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
          Build a stronger organization presence across Judah Global through
          consistent identity, event visibility, and future profile-driven tools
          designed to expand reach and trust.
        </p>

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
            Presence Strategy
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            How organizations build stronger visibility
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {presenceFeatures.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: "#fffaf0",
                    fontSize: "1.02rem",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(245, 241, 232, 0.78)",
                    lineHeight: 1.7,
                    fontSize: "0.96rem",
                  }}
                >
                  {item.text}
                </p>
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
              Future Tools
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Organization Profile
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Future public-facing organization profile and details
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Branded Media
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Visual identity tools for stronger recognition
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Enhanced Promotion
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Future integration with featured campaigns and event marketing
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Organization Growth Layer
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  More ways to build visibility, trust, and discoverability
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
              Build Presence page is wired and ready
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.65,
              }}
            >
              This page is now connected to the org portal sidebar and prepared for
              future organization-profile, branding, and visibility feature
              expansion.
            </p>

            <button
              type="button"
              style={{
                background: "#c8a96b",
                color: "#111318",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 800,
                border: "none",
                cursor: "not-allowed",
                opacity: 0.95,
              }}
            >
              Presence Tools Coming Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
