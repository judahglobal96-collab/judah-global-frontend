import type { CSSProperties, FC } from "react";
import type { SharedPreviewCardProps } from "../PlacementPreview";

const cardStyle: CSSProperties = {
  width: 280,
  margin: "0 auto",
  borderRadius: 20,
  overflow: "hidden",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
};

const imageShellStyle: CSSProperties = {
  width: "100%",
  background: "#f8fafc",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  minHeight: 420,
};

const contentStyle: CSSProperties = {
  padding: 14,
  display: "grid",
  gap: 8,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.25,
  fontWeight: 800,
  color: "#0f172a",
};

const sponsorStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 700,
  color: "#475569",
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.6,
  color: "#475569",
};

const metaRowStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  marginTop: 2,
};

const metaTextStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: "#64748b",
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  marginTop: 6,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 800,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  color: "#3730a3",
  border: "1px solid #c7d2fe",
  whiteSpace: "nowrap",
};

const ctaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 800,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#0f172a",
  color: "#ffffff",
  whiteSpace: "nowrap",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  maxHeight: 640,
  objectFit: "contain",
  display: "block",
  borderRadius: 12,
  background: "#ffffff",
};

const stateToneMap: Record<
  NonNullable<SharedPreviewCardProps["state"]>,
  { label: string; background: string; color: string; border: string }
> = {
  no_media: {
    label: "No Media",
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e5e7eb",
  },
  pending: {
    label: "Pending Review",
    background: "#fffaeb",
    color: "#b54708",
    border: "1px solid #fedf89",
  },
  approved: {
    label: "Approved",
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
  },
  rejected: {
    label: "Rejected",
    background: "#fef3f2",
    color: "#b42318",
    border: "1px solid #fecdca",
  },
};

const OfficialFlyerPreview: FC<SharedPreviewCardProps> = ({
  imageUrl,
  title,
  sponsorName,
  description,
  dateLabel,
  locationLabel,
  state = "pending",
}) => {
  const tone = stateToneMap[state];

  return (
    <div style={cardStyle}>
      <div style={imageShellStyle}>
        <img
          src={imageUrl}
          alt={title || "Official flyer preview"}
          style={imageStyle}
        />
      </div>

      <div style={contentStyle}>
        <div style={headerRowStyle}>
          <span
            style={{
              ...badgeStyle,
              background: tone.background,
              color: tone.color,
              border: tone.border,
            }}
          >
            {tone.label}
          </span>

          <span style={ctaStyle}>Official Flyer</span>
        </div>

        <h3 style={titleStyle}>{title || "Your Event Title"}</h3>

        <p style={sponsorStyle}>{sponsorName || "Organization Name"}</p>

        <p style={descriptionStyle}>
          {description || "Full-page flyer placement on the event detail page."}
        </p>

        <div style={metaRowStyle}>
          <div style={metaTextStyle}>
            {dateLabel || "Lives until event expires"}
          </div>
          <div style={metaTextStyle}>
            {locationLabel || "Visible on the event detail page"}
          </div>
        </div>

        <div style={footerStyle} />
      </div>
    </div>
  );
};

export default OfficialFlyerPreview;
