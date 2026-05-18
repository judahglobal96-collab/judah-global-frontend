import { Link, useNavigate, useParams } from "react-router-dom";

type MediaGuideline = {
  title: string;
  text: string;
};

export default function OrgUploadMediaPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const basePath = orgUuid ? `/org/${orgUuid}` : "/org";
  const isAdminPreview = Boolean(orgUuid);

  const mediaGuidelines: MediaGuideline[] = [
    {
      title: "Use event-relevant visuals",
      text: "Upload flyers, promotional graphics, or approved event images that clearly represent the event being submitted.",
    },
    {
      title: "Keep content platform-appropriate",
      text: "All uploaded media should align with Judah Global review standards before it can appear publicly.",
    },
    {
      title: "Prioritize readable designs",
      text: "Graphics should be clear, legible, and visually strong enough to support public discovery and event promotion.",
    },
    {
      title: "Prepare for admin review",
      text: "Uploaded event images will move through moderation and approval before they are displayed live.",
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
          Upload Media
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
          Upload event media that supports stronger visibility, public discovery,
          and approved event presentation across Judah Global.
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
            to={`${basePath}/submit-event`}
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
            Go to Submit Event
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
            Media Guidelines
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            How event media should be prepared
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {mediaGuidelines.map((item) => (
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
              Media Workflow
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Upload
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Organization adds event flyer or approved visual asset
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Review
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Media moves through admin moderation before public display
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Approval
                </div>
                <div style={{ color: "#fffaf0", fontWeight: 600 }}>
                  Approved event media becomes eligible for detailed event pages
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
                  Page prepared for future direct media upload tools
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
              Upload Media page is wired and ready
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.65,
              }}
            >
              This page is now connected to the org portal sidebar and prepared for
              future organization media upload and moderation workflow expansion.
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
              Media Upload Tools Coming Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}