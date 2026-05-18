import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../../lib/submit-event-draft";
import OrgSubmitEventFaqCard from "../../components/org/OrgSubmitEventFaqCard";

export default function OrgSubmitEventLocationPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  const existingDraft = getSubmitEventDraft();
  const location = existingDraft.location || {};

  const [venueName, setVenueName] = useState(location.venueName || "");
  const [addressLine1, setAddressLine1] = useState(location.addressLine1 || "");
  const [city, setCity] = useState(location.city || "");
  const [stateRegion, setStateRegion] = useState(location.stateRegion || "");
  const [country, setCountry] = useState(location.country || "United States");
  const [isVirtual, setIsVirtual] = useState(Boolean(location.isVirtual));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    if (!isVirtual) {
      if (!venueName || !addressLine1 || !city || !stateRegion || !country) {
        alert("Please complete all required location fields.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const draft = getSubmitEventDraft();

      saveSubmitEventDraft({
        ...draft,
        location: {
          ...draft.location,
          venueName,
          addressLine1,
          city,
          stateRegion,
          country,
          isVirtual,
        },
      });

      navigate(`${baseOrgPath}/submit-event/sponsor`);
    } catch (err) {
      console.error("Location save error:", err);
      alert("Failed to save location.");
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    color: "#fffaf0",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "13px 14px",
    fontSize: "0.96rem",
    outline: "none",
    boxSizing: "border-box",
  };

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
          Event Location
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
          Add the venue and location details for your event before continuing to
          the sponsor step.
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
            to={`${baseOrgPath}/submit-event/schedule`}
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
            Back to Schedule
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
            Step 3 of 5
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
            Location Form
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Enter venue and address details
          </h3>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Is this a virtual event?</label>
              <select
                value={isVirtual ? "yes" : "no"}
                onChange={(e) => setIsVirtual(e.target.value === "yes")}
                style={inputStyle}
              >
                <option value="no">No — In Person</option>
                <option value="yes">Yes — Virtual</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Venue Name</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                style={inputStyle}
                placeholder="Example: Wintrust Arena"
                disabled={isVirtual}
              />
            </div>

            <div>
              <label style={labelStyle}>Address Line 1</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                style={inputStyle}
                placeholder="Street address"
                disabled={isVirtual}
              />
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
                placeholder="City"
                disabled={isVirtual}
              />
            </div>

            <div>
              <label style={labelStyle}>State / Region</label>
              <input
                type="text"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                style={inputStyle}
                placeholder="State or region"
                disabled={isVirtual}
              />
            </div>

            <div>
              <label style={labelStyle}>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
                placeholder="Country"
                disabled={isVirtual}
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
              {isSubmitting ? "Saving..." : "Continue to Sponsor"}
            </button>

            <Link
              to={`${baseOrgPath}/submit-event/schedule`}
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