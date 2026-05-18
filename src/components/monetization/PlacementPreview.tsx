import React from "react";

import PromoPreviewEmptyState from "./PromoPreviewEmptyState";
import HomepageHeroPreview from "./previews/HomepageHeroPreview";
import HomepageTopRowPreview from "./previews/HomepageTopRowPreview";
import DiscoveryTopRowPreview from "./previews/DiscoveryTopRowPreview";
import MajorEventPreview from "./previews/MajorEventPreview";
import WebsitePlacementPreview from "./previews/WebsitePlacementPreview";
import OfficialFlyerPreview from "./previews/OfficialFlyerPreview";

export type PromoPreviewState =
  | "no_media"
  | "pending"
  | "approved"
  | "rejected";

export type PlacementType =
  | "homepage_hero"
  | "homepage_top_row"
  | "discovery_top_row"
  | "major_event"
  | "website"
  | "official_flyer";

export interface PlacementPreviewProps {
  placementType: PlacementType;
  state?: PromoPreviewState;

  imageUrl?: string | null;
  title?: string;
  sponsorName?: string;
  description?: string;
  dateLabel?: string;
  locationLabel?: string;

  className?: string;
}

export interface SharedPreviewCardProps {
  imageUrl: string;
  title: string;
  sponsorName?: string;
  description?: string;
  dateLabel?: string;
  locationLabel?: string;
  state?: PromoPreviewState;
}

const compactShellStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  margin: "0 auto",
};

const compactInnerStyle: React.CSSProperties = {
  width: "100%",
  transform: "scale(0.86)",
  transformOrigin: "top center",
};

const compactHeightByPlacement: Record<PlacementType, number> = {
  homepage_hero: 280,
  homepage_top_row: 235,
  discovery_top_row: 235,
  major_event: 250,
  website: 235,
  official_flyer: 380,
};

const PlacementPreview: React.FC<PlacementPreviewProps> = ({
  placementType,
  state = "no_media",
  imageUrl,
  title = "Your Event Title",
  sponsorName = "Sponsor Name",
  description = "Your promotional creative will appear here once media is uploaded.",
  dateLabel = "Date Coming Soon",
  locationLabel = "Location Coming Soon",
  className = "",
}) => {
  const hasMedia = Boolean(imageUrl && imageUrl.trim().length > 0);

  const wrapperStyle: React.CSSProperties = {
    ...compactShellStyle,
    minHeight: compactHeightByPlacement[placementType] ?? 235,
  };

  if (!hasMedia || state === "no_media") {
    return (
      <div className={className} style={wrapperStyle}>
        <div style={compactInnerStyle}>
          <PromoPreviewEmptyState
            placementType={placementType}
            state={state}
          />
        </div>
      </div>
    );
  }

  const sharedProps: SharedPreviewCardProps = {
    imageUrl: imageUrl as string,
    title,
    sponsorName,
    description,
    dateLabel,
    locationLabel,
    state,
  };

  let content: React.ReactNode;

  switch (placementType) {
    case "homepage_hero":
      content = <HomepageHeroPreview {...sharedProps} />;
      break;

    case "homepage_top_row":
      content = <HomepageTopRowPreview {...sharedProps} />;
      break;

    case "discovery_top_row":
      content = <DiscoveryTopRowPreview {...sharedProps} />;
      break;

    case "major_event":
      content = <MajorEventPreview {...sharedProps} />;
      break;

    case "website":
      content = <WebsitePlacementPreview {...sharedProps} />;
      break;

    case "official_flyer":
      content = <OfficialFlyerPreview {...sharedProps} />;
      break;

    default:
      content = (
        <PromoPreviewEmptyState
          placementType={placementType}
          state={state}
        />
      );
      break;
  }

  return (
    <div className={className} style={wrapperStyle}>
      <div style={compactInnerStyle}>{content}</div>
    </div>
  );
};

export default PlacementPreview;
