import { Link } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";

export default function SubmitEventPage() {
  return (
    <SubmitEventLayout
      title="Submit Event Portal"
      description="Add your faith-based event here. Ensure you have all your media ready to upload. Once approved, your event becomes discoverable worldwide."
    >
      <div style={{ display: "grid", gap: 28 }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr 1fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: "2rem",
                lineHeight: 1.1,
                color: "#0f172a",
              }}
            >
              Plan. Prepare. Publish.
              <br />
              <span style={{ color: "#d4a017" }}>Impact the World.</span>
            </h2>

            <div
              style={{
                width: 64,
                height: 3,
                background: "#4f46e5",
                borderRadius: 999,
                margin: "18px 0 22px",
              }}
            />

            <p
              style={{
                margin: 0,
                color: "#334155",
                lineHeight: 1.7,
                fontSize: 16,
              }}
            >
              Follow these steps to create an unforgettable experience and share
              your event with thousands across the globe.
            </p>

            <div
              style={{
                marginTop: 28,
                padding: 20,
                borderRadius: 18,
                background: "#f5f3ff",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: 28 }}>📷</div>
              <div>
                <h3 style={{ margin: 0, marginBottom: 6, color: "#0f172a" }}>
                  Media Placement Guide
                </h3>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    color: "#475569",
                    lineHeight: 1.6,
                  }}
                >
                  Ensure all images, flyers, and logos meet our upload
                  specifications.
                </p>
                <Link
                  to="/media-placement-guide"
                  style={{
                    color: "#4338ca",
                    fontWeight: 800,
                    textDecoration: "underline",
                  }}
                >
                  View Media Placement Guide →
                </Link>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 20,
                borderRadius: 18,
                background: "#f8fafc",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: 28 }}>🛡️</div>
              <div>
                <h3 style={{ margin: 0, marginBottom: 6, color: "#0f172a" }}>
                  Secure • Faith-Focused • Global Impact
                </h3>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
                  Your event will be reviewed for quality and alignment with our
                  mission before going live.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: 20,
                textAlign: "center",
                color: "#0f172a",
                fontSize: "1.4rem",
              }}
            >
              How It Works
            </h3>

            {[
              ["📋", "Plan Your Event", "Enter the essentials: details, dates & times."],
              ["🗓️", "Add Schedule & Location", "Share when and where your event will take place."],
              ["👥", "Add Sponsor Information", "Include your organization and sponsors."],
              ["🖼️", "Upload Media", "Add flyers, logos & promotional images."],
              ["✅", "Review & Submit", "Verify everything and submit for approval."],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 22,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, marginBottom: 4, color: "#0f172a" }}>
                    {title}
                  </h4>
                  <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: 20,
                textAlign: "center",
                color: "#0f172a",
                fontSize: "1.4rem",
              }}
            >
              What You’ll Need
            </h3>

            {[
              "Event Title & Description",
              "Date, Time & Timezone",
              "Location / Venue Details",
              "Sponsor or Organization Info",
              "Event Flyer (Required)",
              "Sponsor Logo (Recommended)",
              "Promotional Images (Optional)",
              "Contact Email for Verification",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 16,
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#d4a017", fontSize: 18 }}>●</span>
                <span>{item}</span>
              </div>
            ))}

            <Link
              to="/submit-event/basics"
              className="primary-action"
              style={{
                marginTop: 24,
                width: "100%",
                minHeight: 58,
                borderRadius: 14,
                background: "linear-gradient(135deg, #fbbf24, #d97706)",
                color: "#111827",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 18,
                boxShadow: "0 12px 24px rgba(217,119,6,0.25)",
              }}
            >
              🚀 Begin Event Submission
            </Link>

            <p
              style={{
                margin: "14px 0 0",
                textAlign: "center",
                color: "#475569",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              🔒 You can save your progress and return anytime.
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            padding: 22,
            borderRadius: 20,
            background: "linear-gradient(135deg, #020617, #0f172a)",
            color: "#ffffff",
            border: "1px solid rgba(212,160,23,0.45)",
          }}
        >
          {[
            ["🌍", "Global Reach", "Your event can be discovered by a worldwide audience."],
            ["👥", "Kingdom Impact", "Together, we’re advancing the Kingdom through unity."],
            ["🛡️", "Trusted Platform", "We review every event for quality and integrity."],
            ["⭐", "Featured Opportunities", "High-quality events may be featured across Judah Global."],
          ].map(([icon, title, text]) => (
            <div key={title}>
              <div style={{ fontSize: 30, marginBottom: 10, color: "#fbbf24" }}>
                {icon}
              </div>
              <h4 style={{ margin: 0, marginBottom: 6 }}>{title}</h4>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.5,
                  fontSize: 14,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </section>
      </div>
    </SubmitEventLayout>
  );
}