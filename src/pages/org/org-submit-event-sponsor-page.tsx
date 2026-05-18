import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SPONSOR_TYPES } from "../../lib/event-options";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../../lib/submit-event-draft";
import OrgSubmitEventFaqCard from "../../components/org/OrgSubmitEventFaqCard";

export default function OrgSubmitEventSponsorPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  console.log("SPONSOR PAGE ORG UUID:", orgUuid, baseOrgPath);
  
  const existingDraft = getSubmitEventDraft();
  const sponsor = existingDraft.sponsor || {};

  const [sponsorName, setSponsorName] = useState(sponsor.sponsorName || "");
  const [sponsorType, setSponsorType] = useState(
    sponsor.sponsorType || "Organization"
  );
  const [contactName, setContactName] = useState(sponsor.contactName || "");
  const [contactEmail, setContactEmail] = useState(sponsor.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(sponsor.contactPhone || "");
  const [website, setWebsite] = useState(sponsor.website || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    if (!sponsorName || !sponsorType || !contactName || !contactEmail) {
      alert("Please complete all required sponsor fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const draft = getSubmitEventDraft();
      const eventId = draft.eventId;

      if (!eventId) {
        throw new Error(
          "Event ID is missing. Please return to Basics and recreate the draft."
        );
      }

      saveSubmitEventDraft({
        ...draft,
        sponsor: {
          ...draft.sponsor,
          sponsorName,
          sponsorType,
          contactName,
          contactEmail,
          contactPhone,
          website,
          logoUrl: "",
        },
      });

      navigate(`${baseOrgPath}/submit-event/monetization`);
    } catch (err) {
      console.error("Sponsor save error:", err);
      alert("Failed to save sponsor information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "#1a1a1a",
    color: "#fffaf0",
    border: hasError
      ? "1px solid rgba(248,113,113,0.8)"
      : "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "13px 14px",
    fontSize: "0.96rem",
    outline: "none",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    color: "#fffaf0",
    fontWeight: 700,
    fontSize: "0.92rem",
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
          Sponsor Information
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
          Add the sponsor and contact details that should be connected to this
          event before moving into the final review step.
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
            to={`${baseOrgPath}/submit-event/location`}
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
            Back to Location
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 18px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.18), rgba(200,169,107,0.08))",
              border: "1px solid rgba(200,169,107,0.28)",
              color: "#f3d89b",
              fontWeight: 700,
            }}
          >
            Step 4 of 6
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
        }}
      >
        <form onSubmit={handleContinue} style={cardStyle}>
          <div
            style={{
              fontSize: "0.76rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#c8a96b",
              marginBottom: "10px",
            }}
          >
            Sponsor Form
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Enter sponsor and contact details
          </h3>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Sponsor Name</label>
              <input
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                style={inputStyle()}
                placeholder="Example: The Word Church"
              />
            </div>

            <div>
              <label style={labelStyle}>Sponsor Type</label>
              <select
                value={sponsorType}
                onChange={(e) => setSponsorType(e.target.value)}
                style={inputStyle()}
              >
                {SPONSOR_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                    style={{ background: "#1a1a1a", color: "#fffaf0" }}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                style={inputStyle()}
                placeholder="Primary event contact"
              />
            </div>

            <div>
              <label style={labelStyle}>Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={inputStyle()}
                placeholder="contact@organization.org"
              />
            </div>

            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                style={inputStyle()}
                placeholder="Optional phone number"
              />
            </div>

            <div>
              <label style={labelStyle}>Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={inputStyle()}
                placeholder="https://example.org"
              />
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
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
                color: "#fffaf0",
                border: "1px solid rgba(200,169,107,0.34)",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 700,
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                cursor: isSubmitting ? "wait" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Continue to Monetization"}
            </button>

            <Link
              to={`${baseOrgPath}/submit-event/location`}
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
              Back
            </Link>
          </div>
        </form>

        <div style={{ display: "grid", gap: "24px" }}>
          <OrgSubmitEventFaqCard />
        </div>
      </section>
    </div>
  );
}