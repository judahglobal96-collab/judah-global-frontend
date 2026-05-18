import React from "react";
import { useNavigate } from "react-router-dom";

type PlacementGuideItem = {
  category: string;
  name: string;
  location: string;
  recommendedSize: string;
  aspectRatio: string;
  formats: string;
  bestFor: string;
  note: string;
  mockupShape: "hero" | "card" | "flyer" | "badge";
};

const PLACEMENTS: PlacementGuideItem[] = [
  {
    category: "Homepage Placement",
    name: "Homepage Hero",
    location: "Top featured area of the Judah Global homepage.",
    recommendedSize: "1920 × 900 px",
    aspectRatio: "Wide landscape",
    formats: "JPG, PNG, WebP",
    bestFor: "Major conferences, revivals, tours, and high-priority promotions.",
    note: "Use a wide image with important text centered and away from the edges.",
    mockupShape: "hero",
  },
  {
    category: "Homepage Placement",
    name: "Homepage Top Row",
    location: "Premium top-row promotional section on the homepage.",
    recommendedSize: "1200 × 800 px",
    aspectRatio: "3:2 landscape",
    formats: "JPG, PNG, WebP",
    bestFor: "Strong event promotions, ministry campaigns, and featured announcements.",
    note: "Best with a clean horizontal image and minimal text.",
    mockupShape: "card",
  },
  {
    category: "Discovery Placement",
    name: "Discovery Top Row",
    location: "Top promotional row on the event discovery page.",
    recommendedSize: "1200 × 800 px",
    aspectRatio: "3:2 landscape",
    formats: "JPG, PNG, WebP",
    bestFor: "Events that need stronger visibility during browsing and search.",
    note: "Use clear event artwork that remains readable at card size.",
    mockupShape: "card",
  },
  {
    category: "Major Event Placement",
    name: "Major Events",
    location: "Major Events promotional area for high-priority listings.",
    recommendedSize: "1400 × 900 px",
    aspectRatio: "Large landscape",
    formats: "JPG, PNG, WebP",
    bestFor: "Regional, national, or large-scale faith events.",
    note: "Best with premium event artwork, strong contrast, and clear event name.",
    mockupShape: "card",
  },
  {
    category: "Event Detail Placement",
    name: "Event Official Flyer",
    location: "Event Official flyer appears on the event detail page.",
    recommendedSize: "1080 × 1920 px",
    aspectRatio: "9:16 vertical",
    formats: "JPG, PNG, WebP",
    bestFor: "Full event flyers, posters, speaker graphics, and schedule flyers.",
    note: "Upload a vertical flyer. Avoid tiny text near the edges.",
    mockupShape: "flyer",
  },
  {
    category: "Event Detail Placement",
    name: "Featured Badge",
    location: "Get discovered faster, spotlight tier, priority ranking in search discovery",
    recommendedSize: "No separate image required",
    aspectRatio: "Uses existing event media",
    formats: "N/A",
    bestFor: "Adding visual priority and trust to an existing event listing.",
    note: "This placement does not require a separate upload.",
    mockupShape: "badge",
  },
];

export default function MediaPlacementGuidePage() {
  const navigate = useNavigate();

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

  const topMetaStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#b69240",
    marginBottom: 10,
    fontWeight: 800,
  };

  const heroStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))",
    border: "1px solid #e5e7eb",
    borderRadius: 28,
    padding: "34px 34px 30px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.04)",
  };

  const pageTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "3rem",
    lineHeight: 1.05,
    fontWeight: 900,
    color: "#101828",
  };

  const pageDescStyle: React.CSSProperties = {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 820,
    color: "#475467",
    lineHeight: 1.7,
    fontSize: "1rem",
  };

  const infoBoxStyle: React.CSSProperties = {
    marginTop: 22,
    border: "1px solid rgba(182,146,64,0.22)",
    background:
      "linear-gradient(135deg, rgba(200,169,107,0.12), rgba(255,255,255,0.7))",
    borderRadius: 18,
    padding: 18,
    color: "#475467",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.65,
  };

  const primaryButtonStyle: React.CSSProperties = {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: "#ffffff",
    color: "#101828",
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 24,
    marginTop: 28,
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
  };

  const mockShellStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 16,
    background: "#fafafa",
    minHeight: 190,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  };

  function renderMockup(shape: PlacementGuideItem["mockupShape"]) {
    if (shape === "hero") {
      return (
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            height: 150,
            borderRadius: 18,
            border: "2px dashed rgba(182,146,64,0.5)",
            background:
              "linear-gradient(135deg, rgba(182,146,64,0.18), rgba(255,255,255,0.72))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b69240",
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Homepage Hero
        </div>
      );
    }

    if (shape === "flyer") {
      return (
        <div
          style={{
            width: 120,
            height: 180,
            borderRadius: 16,
            border: "2px dashed rgba(182,146,64,0.5)",
            background:
              "linear-gradient(180deg, rgba(182,146,64,0.18), rgba(255,255,255,0.8))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b69240",
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            padding: 10,
          }}
        >
          Official Flyer
        </div>
      );
    }

    if (shape === "badge") {
      return (
        <div
          style={{
            width: 210,
            minHeight: 118,
            borderRadius: 18,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              background: "#f2f4f7",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              borderRadius: 999,
              padding: "6px 10px",
              background: "#fff7e6",
              border: "1px solid rgba(182,146,64,0.25)",
              color: "#b69240",
              fontWeight: 900,
              fontSize: 11,
            }}
          >
            Featured
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: 240,
          height: 160,
          borderRadius: 18,
          border: "2px dashed rgba(182,146,64,0.5)",
          background:
            "linear-gradient(135deg, rgba(182,146,64,0.16), rgba(255,255,255,0.75))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b69240",
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: 12,
        }}
      >
        Promo Card
      </div>
    );
  }

  return (
    <div style={pageShell}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div style={topMetaStyle}>Judah Global Media Guide</div>

          <h1 style={pageTitleStyle}>Media Placement Guide</h1>

          <p style={pageDescStyle}>
            Use this guide to prepare your promotional media before uploading it
            in the Campaign Builder. This page shows where each placement appears
            across Judah Global and the recommended image sizes for best display
            quality.
          </p>

          <div style={infoBoxStyle}>
            This page is informational only. Final placement availability,
            pricing, media upload, and checkout are handled inside Campaign
            Builder.
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={() => navigate("/campaign-builder")}
            >
              Open Campaign Builder
            </button>

            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </section>

        <section style={gridStyle}>
          {PLACEMENTS.map((placement) => (
            <article key={placement.name} style={cardStyle}>
              <div style={mockShellStyle}>{renderMockup(placement.mockupShape)}</div>

              <div style={topMetaStyle}>{placement.category}</div>

              <h2
                style={{
                  margin: 0,
                  color: "#101828",
                  fontSize: 24,
                  lineHeight: 1.2,
                  fontWeight: 900,
                }}
              >
                {placement.name}
              </h2>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 18,
                  color: "#475467",
                  lineHeight: 1.65,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {placement.location}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  background: "#fafafa",
                  padding: 16,
                }}
              >
                <GuideRow label="Recommended Size" value={placement.recommendedSize} />
                <GuideRow label="Aspect Ratio" value={placement.aspectRatio} />
                <GuideRow label="Accepted Formats" value={placement.formats} />
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#98a2b3",
                      fontWeight: 900,
                    }}
                  >
                    Best For
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      color: "#475467",
                      fontSize: 14,
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    {placement.bestFor}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    background: "#fffaf0",
                    border: "1px solid rgba(182,146,64,0.2)",
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#b69240",
                      fontWeight: 900,
                    }}
                  >
                    Upload Note
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      color: "#6b5b2a",
                      fontSize: 14,
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    {placement.note}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function GuideRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          color: "#667085",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#101828",
          fontSize: 14,
          fontWeight: 900,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
