import { Link } from "react-router-dom";

export default function SubmitEventPage() {
  return (
          <div
            style={{
              minHeight: "100vh",
              backgroundImage: `
                linear-gradient(
                  rgba(4,8,25,0.72),
                  rgba(4,8,25,0.82)
                ),
                url('/images/submit-event-bg.jpg')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "48px 24px 80px"
            }}
          >
        <main style={{ maxWidth: 1500, margin: "0 auto" }}>
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            maxWidth: 960,
            margin: "0 auto 28px",
            padding: "32px 32px",
            borderRadius: 24,
            textAlign: "center",
            color: "#fff",
            background: "rgba(2, 6, 23, 0.82)",
            border: "1px solid rgba(251, 191, 36, 0.48)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >
            <img
              src="/images/gold-globe.png"
              alt=""
              style={{
                position: "absolute",
                top: "-60px",
                right: "-80px",
                width: "420px",
                opacity: 0.22,
                pointerEvents: "none",
                zIndex: 1
              }}
            />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: 0,
                marginBottom: 10,
                color: "#facc15",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              Judah Global
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "3rem",
                lineHeight: 1,
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              Submit Event Portal
            </h1>

            <div
              style={{
                width: 120,
                height: 3,
                background: "#d4a017",
                margin: "18px auto",
                borderRadius: 999,
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Add your faith-based event here. Ensure you have all your media
              ready to upload. Once approved, your event becomes discoverable
              worldwide.
            </p>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <aside
            style={{
              borderRadius: 20,
              padding: 22,
              color: "#fff",
              background: "rgba(2, 6, 23, 0.88)",
              border: "1px solid rgba(251, 191, 36, 0.45)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 18 }}>Submit Event</h3>

            {[
              ["🎫", "Basics"],
              ["🗓️", "Schedule"],
              ["📍", "Location"],
              ["👥", "Sponsor"],
              ["💰", "Monetization"],
              ["📋", "Review"],
              ["✉️", "Verify Email"],
            ].map(([icon, label], index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 12px",
                  borderRadius: 12,
                  marginBottom: 8,
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #6d28d9, #4f46e5)"
                      : "transparent",
                  borderBottom:
                    index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </aside>

          <section
            style={{
              borderRadius: 22,
              padding: 32,
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1fr",
              gap: 28,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.75rem",
                  lineHeight: 1.15,
                  color: "#0f172a",
                }}
              >
                Plan. Prepare. Publish.
                <br />
                <span style={{ color: "#d4a017" }}>Impact the World.</span>
              </h2>

              <p style={{ color: "#334155", lineHeight: 1.7, fontSize: 15 }}>
                Follow these steps to create an unforgettable experience and
                share your event with thousands across the globe.
              </p>

              <InfoCard
                icon="📷"
                title="Media Placement Guide"
                text="Ensure all images, flyers, and logos meet our upload specifications."
                link
              />

              <InfoCard
                icon="🛡️"
                title="Secure • Faith-Focused • Global Impact"
                text="Your event will be reviewed for quality and alignment with our mission before going live."
              />
            </div>

            <div>
              <ColumnTitle>How It Works</ColumnTitle>

              <Step icon="📋" title="Plan Your Event" text="Enter the essentials: details, dates & times." />
              <Step icon="🗓️" title="Add Schedule & Location" text="Share when and where your event will take place." />
              <Step icon="👥" title="Add Sponsor Information" text="Include your organization and sponsors." />
              <Step icon="🖼️" title="Upload Media" text="Add flyers, logos & promotional images." />
              <Step icon="✅" title="Review & Submit" text="Verify everything and submit for approval." />
            </div>

            <div>
              <ColumnTitle>What You’ll Need</ColumnTitle>

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
                    gap: 10,
                    marginBottom: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: "#d4a017" }}>●</span>
                  {item}
                </div>
              ))}

              <Link
                to="/submit-event/basics"
                style={{
                  marginTop: 20,
                  width: "100%",
                  minHeight: 56,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #fbbf24, #d97706)",
                  color: "#111827",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: 17,
                  boxShadow: "0 12px 24px rgba(217,119,6,0.25)",
                }}
              >
                🚀 Begin Event Submission
              </Link>

              <p
                style={{
                  textAlign: "center",
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                🔒 You can save your progress and return anytime.
              </p>
            </div>
          </section>
        </div>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            padding: 24,
            borderRadius: 20,
            background: "rgba(2, 6, 23, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(251, 191, 36, 0.45)",
          }}
        >
          <Value icon="🌍" title="Global Reach" text="Your event can be discovered by a worldwide audience." />
          <Value icon="👥" title="Kingdom Impact" text="Together, we’re advancing the Kingdom through unity." />
          <Value icon="🛡️" title="Trusted Platform" text="We review every event for quality and integrity." />
          <Value icon="⭐" title="Featured Opportunities" text="High-quality events may be featured across Judah Global." />
        </section>
      </main>
    </div>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: 0,
        marginBottom: 22,
        textAlign: "center",
        color: "#0f172a",
        fontSize: "1.25rem",
      }}
    >
      {children}
    </h3>
  );
}

function InfoCard({
  icon,
  title,
  text,
  link,
}: {
  icon: string;
  title: string;
  text: string;
  link?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 18,
        background: "#f5f3ff",
        display: "flex",
        gap: 14,
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div>
        <h3 style={{ margin: 0, marginBottom: 6, fontSize: 16 }}>{title}</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: 14 }}>
          {text}
        </p>
        {link && (
          <Link
            to="/media-placement-guide"
            style={{
              display: "inline-block",
              marginTop: 10,
              color: "#4338ca",
              fontWeight: 900,
              textDecoration: "underline",
              fontSize: 14,
            }}
          >
            View Media Placement Guide →
          </Link>
        )}
      </div>
    </div>
  );
}

function Step({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div>
        <h4 style={{ margin: 0, marginBottom: 4, fontSize: 15 }}>{title}</h4>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.5, fontSize: 14 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <h4 style={{ margin: 0, marginBottom: 6 }}>{title}</h4>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", lineHeight: 1.5, fontSize: 14 }}>
        {text}
      </p>
    </div>
  );
}