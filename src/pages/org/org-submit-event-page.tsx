import 
{ Link, useNavigate, useParams } from "react-router-dom";
import { clearSubmitEventDraft } from "../../lib/submit-event-draft";
import OrgSubmitEventFaqCard from "../../components/org/OrgSubmitEventFaqCard";

export default function OrgSubmitEventPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  const handleStartSubmission = () => {
    clearSubmitEventDraft();
    navigate(`${baseOrgPath}/submit-event/basics`);
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
      {Boolean(orgUuid) && (
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
          Submit Event
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: "760px",
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.7,
            fontSize: "0.98rem",
          }}
        >
          Submit your event to reach people actively searching for faith-based business, conferences, concerts, and more.
          Judah Global helps your organization gain visibility through public discovery, Featured placements, and Major Event promotion.
          Create once, promote easily, and connect your event with the audience it was called to serve.
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
            to={baseOrgPath}
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

          <button
            type="button"
            onClick={handleStartSubmission}
            style={{
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
              color: "#fffaf0",
              border: "1px solid rgba(200,169,107,0.34)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              cursor: "pointer",
            }}
          >
            Start Event Submission
          </button>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
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
            Event Submission Workflow
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            What to submit for your global outreach
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {[
              {
                title: "Step 1 — Enter Event Basics",
                text: "Add the event title, description, event type, and sponsor contact email required to create the draft event.",
              },
              {
                title: "Step 2 — Add Date, Time, and Location",
                text: "Include the event schedule, timezone-aware timing, venue, and full address details.",
              },
              {
                title: "Step 3 — Add Sponsor Information",
                text: "Connect the event to your organization so the correct sponsor identity appears publicly.",
              },
              {
                title: "Step 4 — Add Event Monetization & Promotion",
                text: "Choose optional featured enhancements and open Campaign Builder for placement-based promotion.",
              },
              {
                title: "Step 5 — Submit for Review",
                text: "Send the event into Judah Global’s approval workflow before it appears publicly.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  padding: "16px 18px",
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
            <div style={{ display: "grid", gap: "24px" }}>
              <OrgSubmitEventFaqCard />
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
