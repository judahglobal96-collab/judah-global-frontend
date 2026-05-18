import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlacementPreview, {
  type PlacementType as PreviewPlacementType,
  type PromoPreviewState,
} from "../components/monetization/PlacementPreview";

type PlacementType =
  | "event_fee"
  | "hero"
  | "homepage_top"
  | "homepage_top_row"
  | "discovery_top"
  | "discovery_top_row"
  | "featured_badge"
  | "major_events"
  | "official_flyer"
  | "org_subscription";

type AvailabilityStatus = "unknown" | "available" | "unavailable";

type RegionCode = "USA" | "CANADA" | "UK" | "AFRICA";

type CampaignFormState = {
  campaignName: string;
  organization: string;
  contactEmail: string;
  goal: string;
  notes: string;
};

type CampaignItem = {
  id: string;
  placementType: PlacementType;
  startDate: string;
  quantity: number;
  durationDays: number | null;
  availability: AvailabilityStatus;
  hasLocalMedia?: boolean;
  localMediaFile?: File | null;
  localMediaFileName?: string;
  localMediaPreviewUrl?: string | null;
  mediaStatus?: PromoPreviewState;
  isLocked?: boolean;
  regionCode?: RegionCode;
};

type CalendarWeek = {
  placementType: PlacementType;
  weekStartDate: string;
  available: boolean;
  availability: "available" | "unavailable";
  availableCount: number;
};

type BuilderLocationState = {
  eventId?: string;
  orgUuid?: string;
  source?: string;
  includeEventFee?: boolean;
  campaignId?: string;
  campaignCode?: string;
  orgSubscriptionActive?: boolean;
  waiveEventPayment?: boolean;
  region?: RegionCode;
  builderDraft?: {
    form: CampaignFormState;
    items: CampaignItem[];
    calendarPlacementType: PlacementType;
    calendarAnchorDate: string;
    quickBuilderPlacementType: PlacementType;
    quickBuilderWeeks: number;
    selectedItemId?: string | null;
    statusMessage?: string;
    orgSubscriptionActive?: boolean;
    waiveEventPayment?: boolean;
    region?: RegionCode;
  };
};

const EVENT_FEE_DOLLARS = 79;
const FEATURED_BADGE_PUBLIC_DOLLARS = 109;
const FEATURED_BADGE_ORG_DOLLARS = 89;
const MAJOR_EVENTS_PUBLIC_DOLLARS = 249;
const MAJOR_EVENTS_ORG_DOLLARS = 149;
const OFFICIAL_FLYER_DOLLARS = 49;
const HOMEPAGE_HERO_PUBLIC_DOLLARS = 449;
const HOMEPAGE_TOP_PUBLIC_DOLLARS = 249;
const DISCOVERY_TOP_PUBLIC_DOLLARS = 229;
const HOMEPAGE_HERO_ORG_DOLLARS = 399;
const HOMEPAGE_TOP_ORG_DOLLARS = 209;
const DISCOVERY_TOP_ORG_DOLLARS = 209;
const ORG_SUBSCRIPTION_DOLLARS = 299;

const API_BASE = "${import.meta.env.VITE_API_BASE_URL}/api/v1/campaigns";

const REGIONS: Array<{
  value: RegionCode;
  label: string;
  description: string;
}> = [
  {
    value: "USA",
    label: "United States",
    description: "USA regional promotional inventory.",
  },
  {
    value: "CANADA",
    label: "Canada",
    description: "Canada regional promotional inventory.",
  },
  {
    value: "UK",
    label: "United Kingdom",
    description: "UK regional promotional inventory.",
  },
  {
    value: "AFRICA",
    label: "Africa",
    description: "Africa regional promotional inventory.",
  },
];

const PLACEMENT_OPTIONS: Array<{
  value: PlacementType;
  label: string;
  description: string;
  price: number;
  billingModel: "weekly" | "duration";
  defaultDurationDays?: number | null;
}> = [
  {
    value: "event_fee",
    label: "Event Submission Fee",
    description: "Required event submission fee.",
    price: EVENT_FEE_DOLLARS,
    billingModel: "duration",
    defaultDurationDays: null,
  },
  {
    value: "hero",
    label: "Homepage Hero",
    description: "Premium homepage visibility with highest-priority placement.",
    price: HOMEPAGE_HERO_PUBLIC_DOLLARS,
    billingModel: "weekly",
  },
  {
    value: "homepage_top",
    label: "Homepage Top Row",
    description: "Homepage top-row placement with strong premium visibility.",
    price: HOMEPAGE_TOP_PUBLIC_DOLLARS,
    billingModel: "weekly",
  },
  {
    value: "discovery_top",
    label: "Discovery Top Row",
    description: "Top row discovery placement for high event visibility.",
    price: DISCOVERY_TOP_PUBLIC_DOLLARS,
    billingModel: "weekly",
  },
  {
    value: "featured_badge",
    label: "Featured Badge",
    description: "Featured badge treatment across eligible Judah Global surfaces.",
    price: FEATURED_BADGE_PUBLIC_DOLLARS,
    billingModel: "duration",
    defaultDurationDays: 21,
  },
  {
    value: "major_events",
    label: "Major Events Access",
    description: "Priority visibility in the Major Events promotional tier.",
    price: MAJOR_EVENTS_PUBLIC_DOLLARS,
    billingModel: "duration",
    defaultDurationDays: 21,
  },
  {
    value: "official_flyer",
    label: "Official Flyer Placement",
    description:
      "Adds a full-page vertical flyer to the event detail page. Remains active until the event expires.",
    price: OFFICIAL_FLYER_DOLLARS,
    billingModel: "duration",
    defaultDurationDays: null,
  },
  {
    value: "org_subscription",
    label: "Organization Annual Subscription",
    description:
      "Annual organization subscription with org pricing and benefits.",
    price: ORG_SUBSCRIPTION_DOLLARS,
    billingModel: "duration",
    defaultDurationDays: null,
  },
];

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function addDays(date: string, days: number) {
  if (!date) return "";
  const base = parseDate(date);
  if (Number.isNaN(base.getTime())) return "";
  base.setDate(base.getDate() + days);
  return toInputDate(base);
}

function formatDate(date: string) {
  if (!date) return "—";
  const parsed = parseDate(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

  function getRegionLabel(region: RegionCode) {
  return (
    REGIONS.find((item) => item.value === region)?.label ||
    REGIONS.find((item) => item.value === "USA")?.label ||
    "United States"
  );
}
function shouldAutoIncludeEventFee(params: {
  eventId?: string;
  includeEventFee?: boolean;
}) {
  return Boolean(params.eventId) && params.includeEventFee === true;
}

function shouldWaiveEventFee(params: { waiveEventPayment?: boolean }) {
  return Boolean(params.waiveEventPayment);
}

function createEventFeeItem(startDate?: string): CampaignItem {
  return {
    id: createId(),
    placementType: "event_fee",
    startDate: startDate || toInputDate(new Date()),
    quantity: 1,
    durationDays: null,
    availability: "available",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
    isLocked: true,
  };
}

function isEventFeePlacement(type: PlacementType) {
  return type === "event_fee";
}

function isOrgSubscriptionPlacement(type: PlacementType) {
  return type === "org_subscription";
}

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function getPlacementMeta(type: PlacementType) {
  return PLACEMENT_OPTIONS.find((option) => option.value === type)!;
}

function isDurationPlacement(type: PlacementType) {
  return getPlacementMeta(type).billingModel === "duration";
}

function isWeeklyPlacement(type: PlacementType) {
  return getPlacementMeta(type).billingModel === "weekly";
}

function isOfficialFlyerPlacement(type: PlacementType) {
  return type === "official_flyer";
}

function getDefaultDurationDays(type: PlacementType): number | null {
  const meta = getPlacementMeta(type);
  return meta.billingModel === "duration"
    ? meta.defaultDurationDays ?? null
    : null;
}

function toWeekStart(date: string) {
  if (!date) return "";
  const parsed = parseDate(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const day = parsed.getDay();
  parsed.setDate(parsed.getDate() - day);

  return toInputDate(parsed);
}

function getUnitPrice(
  type: PlacementType,
  options?: {
    isOrgFlow?: boolean;
    orgSubscriptionActive?: boolean;
    regionCode?: RegionCode;
  }
) {
  const orgFlow = Boolean(options?.isOrgFlow);
  const useOrgRates = orgFlow;
  const regionCode = String(options?.regionCode || "USA").trim().toUpperCase() as RegionCode;
  const useAfricaOrgRates = useOrgRates && regionCode === "AFRICA";

  switch (type) {
    case "event_fee":
      return EVENT_FEE_DOLLARS;
    case "official_flyer":
      return OFFICIAL_FLYER_DOLLARS;
    case "org_subscription":
      return ORG_SUBSCRIPTION_DOLLARS;
    case "major_events":
      return useAfricaOrgRates ? 159 : useOrgRates ? MAJOR_EVENTS_ORG_DOLLARS : MAJOR_EVENTS_PUBLIC_DOLLARS;
    case "featured_badge":
      return useAfricaOrgRates ? 89 : useOrgRates ? FEATURED_BADGE_ORG_DOLLARS : FEATURED_BADGE_PUBLIC_DOLLARS;
    case "hero":
      return useAfricaOrgRates ? 329 : useOrgRates ? HOMEPAGE_HERO_ORG_DOLLARS : HOMEPAGE_HERO_PUBLIC_DOLLARS;
    case "homepage_top":
    case "homepage_top_row":
      return useAfricaOrgRates ? 229 : useOrgRates ? HOMEPAGE_TOP_ORG_DOLLARS : HOMEPAGE_TOP_PUBLIC_DOLLARS;
    case "discovery_top":
    case "discovery_top_row":
      return useAfricaOrgRates ? 179 : useOrgRates ? DISCOVERY_TOP_ORG_DOLLARS : DISCOVERY_TOP_PUBLIC_DOLLARS;
    default:
      return 0;
  }
}

function getItemQuantity(item: CampaignItem) {
  if (
    isEventFeePlacement(item.placementType) ||
    isOfficialFlyerPlacement(item.placementType) ||
    isOrgSubscriptionPlacement(item.placementType) ||
    isDurationPlacement(item.placementType)
  ) {
    return 1;
  }

  return Math.max(1, item.quantity);
}

function getLineTotal(
  item: CampaignItem,
  options?: {
    isOrgFlow?: boolean;
    orgSubscriptionActive?: boolean;
    waiveEventPayment?: boolean;
    regionCode?: RegionCode;
  }
) {
  if (
    isEventFeePlacement(item.placementType) &&
    shouldWaiveEventFee({ waiveEventPayment: options?.waiveEventPayment })
  ) {
    return 0;
  }

  return (
    getUnitPrice(item.placementType, {
      isOrgFlow: options?.isOrgFlow,
      orgSubscriptionActive: options?.orgSubscriptionActive,
      regionCode: options?.regionCode,
    }) * getItemQuantity(item)
  );
}

function getItemScheduleLabel(item: CampaignItem) {
  if (item.placementType === "event_fee") {
    return "Required one-time event submission fee";
  }

  if (item.placementType === "official_flyer") {
    return "One-time placement · lives until linked event expires";
  }

  if (item.placementType === "org_subscription") {
    return `Annual subscription starting ${formatDate(item.startDate)}`;
  }

  if (isDurationPlacement(item.placementType)) {
    return `${formatDate(item.startDate)} · ${
      item.durationDays ?? 21
    }-day activation`;
  }

  if (item.quantity <= 1) {
    return `Week of ${formatDate(item.startDate)}`;
  }

  return `${item.quantity} weeks starting ${formatDate(item.startDate)}`;
}

function createDefaultWeeklyItem(
  placementType: PlacementType,
  startDate?: string
): CampaignItem {
  const safePlacement = isWeeklyPlacement(placementType)
    ? placementType
    : "homepage_top";

  const nextStart = toWeekStart(
    startDate || addDays(toInputDate(new Date()), 7)
  );

  return {
    id: createId(),
    placementType: safePlacement,
    startDate: nextStart,
    quantity: 1,
    durationDays: null,
    availability: "unknown",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
  };
}

function createDefaultDurationItem(
  placementType: PlacementType,
  startDate?: string
): CampaignItem {
  const safePlacement = isDurationPlacement(placementType)
    ? placementType
    : "featured_badge";

    const today = toInputDate(new Date());
  return {
    id: createId(),
    placementType: safePlacement,
    startDate: startDate && startDate !== "" ? startDate : today,
    quantity: 1,
    durationDays: getDefaultDurationDays(safePlacement),
    availability: "available",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
  };
}

function createOfficialFlyerItem(startDate?: string): CampaignItem {
  return {
    id: createId(),
    placementType: "official_flyer",
    startDate: startDate || toInputDate(new Date()),
    quantity: 1,
    durationDays: null,
    availability: "available",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
  };
}

function createOrgSubscriptionItem(startDate?: string): CampaignItem {
  return {
    id: createId(),
    placementType: "org_subscription",
    startDate: startDate || toInputDate(new Date()),
    quantity: 1,
    durationDays: null,
    availability: "available",
    hasLocalMedia: false,
    localMediaFile: null,
    localMediaFileName: "",
    localMediaPreviewUrl: null,
    mediaStatus: "no_media",
  };
}

function mapToPreviewPlacementType(type: PlacementType): PreviewPlacementType {
  switch (type) {
    case "hero":
      return "homepage_hero";
    case "homepage_top":
      return "homepage_top_row";
    case "discovery_top":
      return "discovery_top_row";
    case "major_events":
    case "featured_badge":
    case "official_flyer":
    case "org_subscription":
      return "major_event";
    case "event_fee":
    default:
      return "homepage_top_row";
  }
}

export default function CampaignBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as BuilderLocationState;

  const eventId = state.eventId || "";
  const orgUuid = state.orgUuid || "";
  const source = state.source || "";
  const includeEventFee = Boolean(state.includeEventFee);
  const builderDraft = state.builderDraft || null;

  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(
    builderDraft?.region || state.region || "USA"
  );

  const isOrgFlow =
    Boolean(orgUuid) || source === "org-submit-event-monetization";

  const orgSubscriptionActive = Boolean(
    builderDraft?.orgSubscriptionActive ?? state.orgSubscriptionActive
  );

  const waiveEventPayment = Boolean(
    builderDraft?.waiveEventPayment ?? state.waiveEventPayment
  );

  const defaultForm: CampaignFormState = {
    campaignName: "",
    organization: "",
    contactEmail: "",
    goal: "",
    notes: "",
  };

  const seededItems: CampaignItem[] = shouldAutoIncludeEventFee({
    eventId,
    includeEventFee,
  })
    ? [createEventFeeItem()]
    : [];

  const [form, setForm] = useState<CampaignFormState>(
    builderDraft?.form || defaultForm
  );

  const [items, setItems] = useState<CampaignItem[]>(() => {
    if (builderDraft?.items && builderDraft.items.length > 0) {
      const alreadyHasEventFee = builderDraft.items.some(
        (item) => item.placementType === "event_fee"
      );

      if (
        shouldAutoIncludeEventFee({ eventId, includeEventFee }) &&
        !alreadyHasEventFee
      ) {
        return [createEventFeeItem(), ...builderDraft.items];
      }

      return builderDraft.items;
    }

    return seededItems;
  });

  const [calendarPlacementType, setCalendarPlacementType] =
    useState<PlacementType>(builderDraft?.calendarPlacementType || "homepage_top");

  const [calendarAnchorDate, setCalendarAnchorDate] = useState<string>(
    builderDraft?.calendarAnchorDate ||
      toWeekStart(addDays(toInputDate(new Date()), 7))
  );

  const [calendarWeeks, setCalendarWeeks] = useState<CalendarWeek[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  const [quickBuilderPlacementType, setQuickBuilderPlacementType] =
    useState<PlacementType>(
      builderDraft?.quickBuilderPlacementType || "homepage_top"
    );

  const [quickBuilderWeeks, setQuickBuilderWeeks] = useState<number>(
    builderDraft?.quickBuilderWeeks || 4
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    builderDraft?.selectedItemId || null
  );

  const [statusMessage, setStatusMessage] = useState(
    builderDraft?.statusMessage || ""
  );

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const weeklyPlacementOptions = PLACEMENT_OPTIONS.filter(
    (option) => option.billingModel === "weekly"
  );

  const editablePlacementOptions = PLACEMENT_OPTIONS.filter(
    (option) => option.value !== "event_fee"
  );

const campaignSubtotal = useMemo(() => {
  return items.reduce((total, item) => {
    return (
      total +
      getLineTotal(item, {
        isOrgFlow,
        orgSubscriptionActive,
        waiveEventPayment,
        regionCode: selectedRegion,
      })
    );
  }, 0);
}, [items, isOrgFlow, orgSubscriptionActive, waiveEventPayment, selectedRegion]);

  const previewSourceItem = useMemo(() => {
    const selectedMatch = items.find((item) => item.id === selectedItemId);
    if (selectedMatch) return selectedMatch;

    const calendarMatch = items.find(
      (item) => item.placementType === calendarPlacementType
    );

    return calendarMatch ?? items[0] ?? null;
  }, [items, selectedItemId, calendarPlacementType]);

  const previewPlacementType: PreviewPlacementType = useMemo(() => {
    return mapToPreviewPlacementType(
      previewSourceItem?.placementType ?? calendarPlacementType
    );
  }, [previewSourceItem, calendarPlacementType]);

  const previewState: PromoPreviewState =
    previewSourceItem?.mediaStatus || "no_media";

  const previewImageUrl = previewSourceItem?.localMediaPreviewUrl || null;

  const previewKey = `${previewSourceItem?.id || "none"}-${
    previewSourceItem?.localMediaFileName || "no-file"
  }-${previewState}`;

  const previewDateLabel = useMemo(() => {
    if (!previewSourceItem) return formatDate(calendarAnchorDate);

    if (previewSourceItem.placementType === "official_flyer") {
      return "Lives until event expires";
    }

    if (previewSourceItem.placementType === "event_fee") {
      return "Required one-time event submission fee";
    }

    if (previewSourceItem.placementType === "org_subscription") {
      return "Annual subscription";
    }

    if (isWeeklyPlacement(previewSourceItem.placementType)) {
      return `Week of ${formatDate(previewSourceItem.startDate)}`;
    }

    return `${formatDate(previewSourceItem.startDate)} · ${
      previewSourceItem.durationDays ?? 21
    } days`;
  }, [previewSourceItem, calendarAnchorDate]);

  const previewTitle = useMemo(() => {
    if (previewSourceItem?.placementType === "event_fee") {
      return "Event Submission Fee";
    }

    if (previewSourceItem?.placementType === "org_subscription") {
      return "Organization Annual Subscription";
    }

    if (form.campaignName?.trim()) return form.campaignName.trim();
    return "Your Event Promotion";
  }, [form.campaignName, previewSourceItem]);

  const previewSponsorName = useMemo(() => {
    if (form.organization?.trim()) return form.organization.trim();
    return "Organization Name";
  }, [form.organization]);

  const previewDescription = useMemo(() => {
    if (previewSourceItem?.placementType === "official_flyer") {
      return "Official full-page flyer placement on the event detail page.";
    }

    if (previewSourceItem?.placementType === "event_fee") {
      return "Required one-time event submission fee for linked event flow.";
    }

    if (previewSourceItem?.placementType === "org_subscription") {
      return "Annual organization subscription with org pricing and benefits.";
    }

    const goal = form.goal?.trim();
    if (goal) return goal;

    return "Your promotional creative will render here after media upload and approval.";
  }, [form.goal, previewSourceItem]);

  useEffect(() => {
    async function loadCalendarAvailability() {
      if (!isWeeklyPlacement(calendarPlacementType) || !calendarAnchorDate) {
        setCalendarWeeks([]);
        return;
      }

      setIsLoadingCalendar(true);

      try {
        const token = localStorage.getItem("auth_token");

        const response = await fetch(`${API_BASE}/calendar-availability`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            placementType: calendarPlacementType,
            regionCode: selectedRegion,
            startDate: toWeekStart(calendarAnchorDate),
            weeks: 12,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load calendar availability.");
        }

        setCalendarWeeks(Array.isArray(data?.calendarWeeks) ? data.calendarWeeks : []);
      } catch (error) {
        console.error("calendar availability error:", error);
        setCalendarWeeks([]);
      } finally {
        setIsLoadingCalendar(false);
      }
    }

    loadCalendarAvailability();
  }, [calendarPlacementType, calendarAnchorDate, selectedRegion]);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.localMediaPreviewUrl) {
          URL.revokeObjectURL(item.localMediaPreviewUrl);
        }
      });
    };
  }, [items]);

  useEffect(() => {
    if (!selectedItemId && items.length > 0) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  function updateForm<K extends keyof CampaignFormState>(
    key: K,
    value: CampaignFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleRegionChange(nextRegion: RegionCode) {
    setSelectedRegion(nextRegion);
    setCalendarWeeks([]);

    setItems((prev) =>
      prev.map((item) =>
        isWeeklyPlacement(item.placementType)
          ? { ...item, availability: "unknown" }
          : item
      )
    );

    setStatusMessage(
      `Campaign region changed to ${getRegionLabel(
        nextRegion
      )}. Please re-check availability before continuing.`
    );
  }

  function updateItem(id: string, updates: Partial<CampaignItem>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.placementType === "event_fee") return item;

        const nextPlacementType = updates.placementType ?? item.placementType;
        const nextIsDuration = isDurationPlacement(nextPlacementType);
        const rawStartDate = updates.startDate ?? item.startDate;

        const next: CampaignItem = {
          ...item,
          ...updates,
          placementType: nextPlacementType,
          startDate:
            nextPlacementType === "event_fee"
              ? item.startDate
              : nextIsDuration
              ? rawStartDate
              : isWeeklyPlacement(nextPlacementType)
              ? toWeekStart(rawStartDate)
              : rawStartDate,
          durationDays:
            nextPlacementType === "official_flyer" ||
            nextPlacementType === "event_fee" ||
            nextPlacementType === "org_subscription"
              ? null
              : nextIsDuration
              ? updates.durationDays ??
                item.durationDays ??
                getDefaultDurationDays(nextPlacementType)
              : null,
          quantity:
            nextPlacementType === "official_flyer" ||
            nextPlacementType === "event_fee" ||
            nextPlacementType === "org_subscription"
              ? 1
              : updates.quantity !== undefined
              ? Math.max(1, updates.quantity)
              : Math.max(1, item.quantity),
        };

        return {
          ...next,
          availability: nextIsDuration ? "available" : "unknown",
        };
      })
    );
  }

  function updateItemMedia(
    id: string,
    updates: Pick<
      CampaignItem,
      | "hasLocalMedia"
      | "localMediaFile"
      | "localMediaFileName"
      | "localMediaPreviewUrl"
      | "mediaStatus"
    >
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  function addWeeklyItemFromCalendar() {
    if (!isWeeklyPlacement(calendarPlacementType)) return;

    const newItem = createDefaultWeeklyItem(
      calendarPlacementType,
      calendarAnchorDate
    );
    newItem.regionCode = selectedRegion;

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setStatusMessage(
      `${getPlacementMeta(calendarPlacementType).label} added for ${
        getRegionLabel(selectedRegion)
      }, week of ${formatDate(newItem.startDate)}.`
    );
  }

  function addDurationItem(type: PlacementType) {
    if (type === "event_fee") return;

    const item =
      type === "official_flyer"
        ? createOfficialFlyerItem()
        : type === "org_subscription"
        ? createOrgSubscriptionItem()
        : createDefaultDurationItem(type);

    setItems((prev) => [...prev, item]);
    setSelectedItemId(item.id);
    setStatusMessage(`${getPlacementMeta(type).label} added.`);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);

      if (!itemToRemove) return prev;

      if (itemToRemove.placementType === "event_fee" || itemToRemove.isLocked) {
        return prev;
      }

      if (itemToRemove.localMediaPreviewUrl) {
        URL.revokeObjectURL(itemToRemove.localMediaPreviewUrl);
      }

      return prev.filter((item) => item.id !== id);
    });

    setSelectedItemId((prev) => (prev === id ? null : prev));
    setStatusMessage("Campaign item removed.");
  }

  function selectCalendarWeek(weekStartDate: string) {
    setCalendarAnchorDate(weekStartDate);
    setStatusMessage(
      `Selected ${getRegionLabel(selectedRegion)} promo week of ${formatDate(
        weekStartDate
      )}.`
    );
  }

  function generateWeeklyItems() {
    if (!quickBuilderWeeks || quickBuilderWeeks < 1) {
      setStatusMessage("Please enter a valid number of weeks.");
      return;
    }

    if (!isWeeklyPlacement(quickBuilderPlacementType) || !calendarAnchorDate) {
      setStatusMessage(
        "Please choose a weekly placement and an available week first."
      );
      return;
    }

    const generated = Array.from({ length: quickBuilderWeeks }).map((_, index) =>
      createDefaultWeeklyItem(
        quickBuilderPlacementType,
        addDays(toWeekStart(calendarAnchorDate), index * 7)
      )
    );

    setItems((prev) => [...prev, ...generated]);
    if (generated[0]) setSelectedItemId(generated[0].id);

    setStatusMessage(
      `${generated.length} ${getRegionLabel(
        selectedRegion
      )} weekly placements added to your campaign.`
    );
  }

  function handlePromoMediaChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    if (!previewSourceItem) {
      setStatusMessage("Please add or select a campaign item first.");
      event.target.value = "";
      return;
    }

    if (
      previewSourceItem.placementType === "event_fee" ||
      previewSourceItem.placementType === "org_subscription"
    ) {
      setStatusMessage("No media is required for this item.");
      event.target.value = "";
      return;
    }

    if (previewSourceItem.localMediaPreviewUrl) {
      URL.revokeObjectURL(previewSourceItem.localMediaPreviewUrl);
    }

    if (!file) {
      updateItemMedia(previewSourceItem.id, {
        hasLocalMedia: false,
        localMediaFile: null,
        localMediaFileName: "",
        localMediaPreviewUrl: null,
        mediaStatus: "no_media",
      });
      event.target.value = "";
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    updateItemMedia(previewSourceItem.id, {
      hasLocalMedia: true,
      localMediaFile: file,
      localMediaFileName: file.name,
      localMediaPreviewUrl: nextPreviewUrl,
      mediaStatus: "pending",
    });

    setSelectedItemId(previewSourceItem.id);
    setStatusMessage(
      `${
        isOfficialFlyerPlacement(previewSourceItem.placementType)
          ? "Official flyer"
          : "Promo media"
      } selected for ${getPlacementMeta(previewSourceItem.placementType).label}.`
    );

    event.target.value = "";
  }

  function clearPromoMediaSelection() {
    if (!previewSourceItem) {
      setStatusMessage("Please select a campaign item first.");
      return;
    }

    if (
      previewSourceItem.placementType === "event_fee" ||
      previewSourceItem.placementType === "org_subscription"
    ) {
      setStatusMessage("No media is attached to this item.");
      return;
    }

    if (previewSourceItem.localMediaPreviewUrl) {
      URL.revokeObjectURL(previewSourceItem.localMediaPreviewUrl);
    }

    updateItemMedia(previewSourceItem.id, {
      hasLocalMedia: false,
      localMediaFile: null,
      localMediaFileName: "",
      localMediaPreviewUrl: null,
      mediaStatus: "no_media",
    });

    setStatusMessage("Promo media selection removed.");
  }

  async function checkAvailability() {
    setIsCheckingAvailability(true);
    setStatusMessage("");

    try {
      const token = localStorage.getItem("auth_token");

      const payloadItems = items
        .filter(
          (item) =>
            item.placementType !== "official_flyer" &&
            item.placementType !== "event_fee" &&
            item.placementType !== "org_subscription"
        )
        .map((item) => ({
          placementType: item.placementType,
          startDate: isDurationPlacement(item.placementType)
            ? item.startDate
            : toWeekStart(item.startDate),
          quantity: item.quantity,
          durationDays: item.durationDays,
        }));

      if (payloadItems.length === 0) {
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            availability:
              item.placementType === "official_flyer" ||
              item.placementType === "event_fee" ||
              item.placementType === "org_subscription"
                ? "available"
                : item.availability,
          }))
        );
        setStatusMessage("Availability refreshed.");
        return;
      }

      const response = await fetch(`${API_BASE}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          region: selectedRegion,
          items: payloadItems,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to check availability.");
      }

      const availabilityMap = new Map<string, string>(
        (data?.results || []).map((result: any) => [
          result.clientKey,
          result.availability,
        ])
      );

      setItems((prev) =>
        prev.map((item) => {
          if (
            item.placementType === "official_flyer" ||
            item.placementType === "event_fee" ||
            item.placementType === "org_subscription"
          ) {
            return { ...item, availability: "available" };
          }

          const normalizedStartDate = isDurationPlacement(item.placementType)
            ? item.startDate
            : toWeekStart(item.startDate);

          const clientKey = `${item.placementType}|${normalizedStartDate}|${
            item.quantity
          }|${item.durationDays ?? "none"}`;

          return {
            ...item,
            availability: (
              availabilityMap.get(clientKey) ||
              (isDurationPlacement(item.placementType) ? "available" : "unknown")
            ) as AvailabilityStatus,
          };
        })
      );

      setStatusMessage(
        `Availability refreshed for ${getRegionLabel(selectedRegion)}.`
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Availability check failed."
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  }

  async function uploadPromoMediaForCreatedItems(
    campaignId: string,
    createdItems: Array<{
      id: string;
      placement_type: PlacementType;
      placement_date?: string;
      quantity: number;
      duration_days?: number | null;
    }>
  ) {
    const token = localStorage.getItem("auth_token");

    for (let index = 0; index < items.length; index += 1) {
      const builderItem = items[index];
      const createdItem = createdItems[index];

      if (!builderItem?.localMediaFile || !createdItem?.id) continue;

      const formData = new FormData();
      formData.append("campaignId", campaignId);
      formData.append("campaignItemId", createdItem.id);
      formData.append("placementType", createdItem.placement_type);
      formData.append("upload_type", "campaign_promo");
      formData.append("region", selectedRegion);
      if (orgUuid) formData.append("orgUuid", orgUuid);
      if (source) formData.append("source", source);
      formData.append("promoMedia", builderItem.localMediaFile);

      const response = await fetch(`${API_BASE}/promo-media/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to upload promo media for ${
              getPlacementMeta(builderItem.placementType).label
            }.`
        );
      }
    }
  }
function validateCampaignForm() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.campaignName.trim()) return "Campaign Name is required.";
  if (!form.organization.trim()) return "Organization is required.";
  if (!form.contactEmail.trim()) return "Contact Email is required.";
  if (!emailPattern.test(form.contactEmail.trim())) {
    return "Please enter a valid Contact Email.";
  }
  if (!form.goal.trim()) return "Goal is required.";

  return "";
}
  async function continueToReview() {

    setStatusMessage("");

    const validationMessage = validateCampaignForm();

if (validationMessage) {
  setStatusMessage(validationMessage);
  setIsContinuing(false);
  return;
}
    setIsContinuing(true);

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          campaignName: form.campaignName,
          organization: form.organization,
          contactEmail: form.contactEmail,
          goal: form.goal,
          notes: form.notes,
          eventId: eventId || null,
          orgUuid: orgUuid || null,
          source: source || null,
          regionCode: selectedRegion,
          items: items.map((item) => ({
            placementType: item.placementType,
            regionCode: selectedRegion,
            startDate:
              item.placementType === "official_flyer" ||
              item.placementType === "event_fee" ||
              item.placementType === "org_subscription"
                ? item.startDate
                : isDurationPlacement(item.placementType)
                ? item.startDate
                : toWeekStart(item.startDate),
            quantity:
              item.placementType === "official_flyer" ||
              item.placementType === "event_fee" ||
              item.placementType === "org_subscription"
                ? 1
                : item.quantity,
            durationDays:
              item.placementType === "official_flyer" ||
              item.placementType === "event_fee" ||
              item.placementType === "org_subscription"
                ? null
                : item.durationDays,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to continue to review.");
      }

      const createdCampaignId = data?.campaign?.id;
      const createdCampaignCode = data?.campaign?.campaign_code || null;
      const createdItems = Array.isArray(data?.items) ? data.items : [];

      if (!createdCampaignId) {
        throw new Error("Campaign ID was not returned.");
      }

      await uploadPromoMediaForCreatedItems(createdCampaignId, createdItems);

      navigate("/campaign-review", {
        state: {
          campaignId: createdCampaignId,
          campaignCode: createdCampaignCode,
          eventId: eventId || null,
          orgUuid: orgUuid || null,
          source: source || null,
          region: selectedRegion,
          orgSubscriptionActive,
          waiveEventPayment,
          builderDraft: {
            form,
            items,
            calendarPlacementType,
            calendarAnchorDate,
            quickBuilderPlacementType,
            quickBuilderWeeks,
            selectedItemId,
            statusMessage: "Campaign saved and promo media uploaded.",
            orgSubscriptionActive,
            waiveEventPayment,
            region: selectedRegion,
          },
        },
      });
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to continue right now."
      );
    } finally {
      setIsContinuing(false);
    }
  }

  const pageShell: React.CSSProperties = {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 24px 64px",
    color: "#101828",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 1220,
    margin: "0 auto",
  };

  const topMetaStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#b69240",
    marginBottom: 10,
    fontWeight: 700,
  };

  const pageTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "3rem",
    lineHeight: 1.05,
    fontWeight: 800,
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

  const topButtonRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: "#ffffff",
    color: "#101828",
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
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

  const accentButton = (bg: string): React.CSSProperties => ({
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    color: "#ffffff",
    background: bg,
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
  });

  const mainGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.85fr",
    gap: 24,
    alignItems: "start",
    marginTop: 32,
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 24,
    background: "#ffffff",
    boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 18,
    fontSize: 18,
    fontWeight: 800,
    color: "#101828",
  };

  const fieldLabelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 700,
    marginBottom: 8,
    color: "#101828",
    fontSize: 14,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#ffffff",
    color: "#101828",
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: "0.96rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 110,
    resize: "vertical",
    fontFamily: "inherit",
  };

  const availabilityPillStyle = (
    status: AvailabilityStatus
  ): React.CSSProperties => ({
    borderRadius: 999,
    padding: "8px 12px",
    fontWeight: 700,
    border:
      status === "available"
        ? "1px solid #abefc6"
        : status === "unavailable"
        ? "1px solid #fecdca"
        : "1px solid #e5e7eb",
    background:
      status === "available"
        ? "#ecfdf3"
        : status === "unavailable"
        ? "#fef3f2"
        : "#fafafa",
    color:
      status === "available"
        ? "#027a48"
        : status === "unavailable"
        ? "#b42318"
        : "#475467",
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const hasHero = items.some((item) => item.placementType === "hero");
  const hasOfficialFlyer = items.some(
    (item) => item.placementType === "official_flyer"
  );

  return (
    <div style={pageShell}>
      <div style={containerStyle}>
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: "28px 28px 24px",
          paddingTop: 12,
          boxShadow: "0 18px 40px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={topMetaStyle}>Judah Global Monetization</div>

            <h1 style={pageTitleStyle}>Campaign Builder</h1>

            <p style={pageDescStyle}>
              Build one campaign across multiple placements, dates, and promotional
              products in a single workflow.
            </p>

            {(eventId || orgUuid) && (
              <div
                style={{
                  marginTop: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(200,169,107,0.16), rgba(200,169,107,0.08))",
                  border: "1px solid rgba(200,169,107,0.22)",
                  color: "#b69240",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Linked Event Flow Active
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fafafa",
                  color: "#475467",
                }}
              >
                Region: {getRegionLabel(selectedRegion)}
              </div>

              <div
                style={{
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fafafa",
                  color: "#475467",
                }}
              >
                Org Subscription: {orgSubscriptionActive ? "Active" : "Inactive"}
              </div>

              <div
                style={{
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fafafa",
                  color: "#475467",
                }}
              >
                Event Fee: {waiveEventPayment ? "Waived" : "Standard"}
              </div>
            </div>

            <div style={{ marginTop: 18, maxWidth: 430 }}>
              <label style={fieldLabelStyle}>Promotion Region</label>

              <select
                style={inputStyle}
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value as RegionCode)}
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>

              <div
                style={{
                  marginTop: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 12,
                  background: "#fafafa",
                  color: "#475467",
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                Selected inventory region: {getRegionLabel(selectedRegion)}. Promo
                availability is checked only against this region.
              </div>
            </div>

            <div style={topButtonRow}>
              <button type="button" style={secondaryButtonStyle}>
                Save Draft
              </button>

              <button
                type="button"
                style={primaryButtonStyle}
                onClick={continueToReview}
                disabled={isContinuing}
              >
                {isContinuing ? "Continuing..." : "Continue to Review"}
              </button>
            </div>
          </div>

          {eventId && (
            <div
              style={{
                width: 300,
                padding: "16px 18px",
                borderRadius: 18,
                border: "1px solid rgba(200,169,107,0.28)",
                background:
                  "linear-gradient(135deg, rgba(200,169,107,0.12), rgba(255,255,255,0.7))",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#b69240",
                }}
              >
                Linked Event
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Event ID
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "#475467",
                  whiteSpace: "nowrap",       // 👈 prevents wrapping
                  overflow: "hidden",
                  textOverflow: "ellipsis",   // 👈 optional (adds "..." if too long)
                }}
              >
                {eventId}
              </div>
            </div>
          )}
        </div>
      </section>

        {statusMessage ? (
          <div
            style={{
              marginTop: 18,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#475467",
              borderRadius: 14,
              padding: 14,
              fontWeight: 700,
            }}
          >
            {statusMessage}
          </div>
        ) : null}

        <section style={mainGridStyle}>
          <div style={{ display: "grid", gap: 24 }}>
            <section style={cardStyle}>
              <div style={topMetaStyle}>Campaign Details</div>
              <h3 style={sectionTitleStyle}>
                Basic campaign identity and buyer information.
              </h3>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(200,169,107,0.16), rgba(200,169,107,0.08))",
                  border: "1px solid rgba(200,169,107,0.22)",
                  color: "#b69240",
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                Draft in Progress
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                <div>
                  <label style={fieldLabelStyle}>Campaign Name</label>
                  <input
                    style={inputStyle}
                    value={form.campaignName}
                    onChange={(e) => updateForm("campaignName", e.target.value)}
                  />
                </div>

                <div>
                  <label style={fieldLabelStyle}>Organization</label>
                  <input
                    style={inputStyle}
                    value={form.organization}
                    onChange={(e) => updateForm("organization", e.target.value)}
                  />
                </div>

                <div>
                  <label style={fieldLabelStyle}>Contact Email</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.contactEmail}
                    onChange={(e) => updateForm("contactEmail", e.target.value)}
                  />
                </div>

                <div>
                  <label style={fieldLabelStyle}>Goal</label>
                  <input
                    style={inputStyle}
                    value={form.goal}
                    onChange={(e) => updateForm("goal", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
              <label style={fieldLabelStyle}>
                Notes <span style={{ color: "#667085", fontWeight: 500 }}>(optional)</span>
              </label>                
                <textarea
                  style={textareaStyle}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  placeholder="Optional notes for scheduling or campaign strategy"
                />
              </div>
            </section>

            <section style={cardStyle}>
              <div style={topMetaStyle}>Placement Calendar</div>
              <h3 style={sectionTitleStyle}>
                Select a region, promo type, then choose a promo start date.
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.05fr 0.95fr",
                  gap: 20,
                  alignItems: "start",
                }}
                >

                <div>
                <label style={fieldLabelStyle}>Region</label>
                <select
                  style={inputStyle}
                  value={selectedRegion}
                  onChange={(e) =>
                    handleRegionChange(e.target.value as RegionCode)
                  }
              >
                  {REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
              
                <div>
                  <label style={fieldLabelStyle}>Placement Type</label>
                  <select
                    style={inputStyle}
                    value={calendarPlacementType}
                    onChange={(e) =>
                      setCalendarPlacementType(e.target.value as PlacementType)
                    }
                  >
                    {weeklyPlacementOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div
                    style={{
                      marginTop: 18,
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 16,
                      background: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#101828",
                        marginBottom: 6,
                      }}
                    >
                      {getPlacementMeta(calendarPlacementType).label}
                    </div>

                    <div
                      style={{
                        color: "#475467",
                        lineHeight: 1.65,
                        fontSize: 14,
                      }}
                    >
                      {getPlacementMeta(calendarPlacementType).description}
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        display: "inline-flex",
                        borderRadius: 999,
                        background: "#fff7e6",
                        border: "1px solid rgba(182,146,64,0.25)",
                        color: "#b69240",
                        fontWeight: 800,
                        padding: "8px 12px",
                        fontSize: 13,
                      }}
                    >
                      {formatMoney(
                        getUnitPrice(calendarPlacementType, {
                          isOrgFlow,
                          orgSubscriptionActive,
                          regionCode: selectedRegion,
                        })
                      )}{" "}
                      per week · {getRegionLabel(selectedRegion)}
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <label style={fieldLabelStyle}>Choose Event Start Date</label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={calendarAnchorDate}
                      onChange={(e) =>
                        setCalendarAnchorDate(toWeekStart(e.target.value))
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() =>
                        setCalendarAnchorDate(
                          toWeekStart(
                            addDays(
                              calendarAnchorDate || toInputDate(new Date()),
                              -28
                            )
                          )
                        )
                      }
                    >
                      View Earlier Weeks
                    </button>

                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() =>
                        setCalendarAnchorDate(
                          toWeekStart(
                            addDays(
                              calendarAnchorDate || toInputDate(new Date()),
                              28
                            )
                          )
                        )
                      }
                    >
                      View Later Weeks
                    </button>

                    <button
                      type="button"
                      style={primaryButtonStyle}
                      onClick={addWeeklyItemFromCalendar}
                    >
                      Add Selected Week
                    </button>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 18,
                      padding: 18,
                      background: "#fafafa",
                      marginTop: -418,
                    }}
                  >
                    <div
                      style={{
                        color: "#475467",
                        fontSize: 14,
                        marginBottom: 14,
                        fontWeight: 700,
                      }}
                    >
                      Available {getRegionLabel(selectedRegion)} weeks appear in
                      green.
                    </div>

                    {isLoadingCalendar ? (
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 14,
                          padding: 16,
                          background: "#ffffff",
                          color: "#475467",
                          fontWeight: 600,
                        }}
                      >
                        Loading calendar availability...
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 12,
                        }}
                      >
                        {calendarWeeks.map((week) => {
                          const isSelected =
                            calendarAnchorDate === week.weekStartDate;

                          return (
                            <button
                              key={`${week.placementType}-${week.weekStartDate}`}
                              type="button"
                              disabled={!week.available}
                              onClick={() => selectCalendarWeek(week.weekStartDate)}
                              style={{
                                border: isSelected
                                  ? "2px solid #b69240"
                                  : week.available
                                  ? "1px solid #abefc6"
                                  : "1px solid #eef2f6",
                                borderRadius: 14,
                                padding: "14px 12px",
                                background: isSelected
                                  ? "#fff7e6"
                                  : week.available
                                  ? "#ecfdf3"
                                  : "#f8fafc",
                                color: week.available ? "#101828" : "#98a2b3",
                                cursor: week.available ? "pointer" : "not-allowed",
                                textAlign: "left",
                                minHeight: 88,
                              }}
                            >
                              <div style={{ fontWeight: 800, fontSize: 14 }}>
                                {formatDate(week.weekStartDate)}
                              </div>
                              <div
                                style={{
                                  marginTop: 8,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: week.available ? "#027a48" : "#98a2b3",
                                }}
                              >
                                {week.available
                                  ? `Available · ${week.availableCount ?? 0} left`
                                  : ""}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={topMetaStyle}>Placement Planner</div>
              <h3 style={sectionTitleStyle}>
                Review, edit, or remove the campaign items you have added.
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 18,
                }}
              >
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={checkAvailability}
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability ? "Checking..." : "Check Availability"}
                </button>

                <button
                  type="button"
                  style={accentButton("#7F56D9")}
                  onClick={() => addDurationItem("featured_badge")}
                >
                  + Add Featured Badge
                </button>

                <button
                  type="button"
                  style={accentButton("#B69240")}
                  onClick={() => addDurationItem("major_events")}
                >
                  + Add Major Events
                </button>

                <button
                  type="button"
                  style={accentButton("#0F172A")}
                  onClick={() => addDurationItem("official_flyer")}
                >
                  + Add Official Flyer
                </button>

                <button
                  type="button"
                  style={accentButton("#175CD3")}
                  onClick={() => addDurationItem("org_subscription")}
                >
                  + Add Org Subscription
                </button>
              </div>

              {hasHero && !hasOfficialFlyer ? (
                <div
                  style={{
                    marginBottom: 18,
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                    background: "#fffaf0",
                    color: "#7c5e10",
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  Add an Official Flyer to increase conversions on the event
                  detail page.
                  <button
                    type="button"
                    onClick={() => addDurationItem("official_flyer")}
                    style={{
                      marginLeft: 12,
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 12px",
                      background: "#0f172a",
                      color: "#ffffff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    +$49 Add Flyer
                  </button>
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 14 }}>
                {items.map((item, index) => {
                  const meta = getPlacementMeta(item.placementType);
                  const isDuration = meta.billingModel === "duration";
                  const isFlyer = item.placementType === "official_flyer";
                  const isEventFee = item.placementType === "event_fee";
                  const isOrgSubscription =
                    item.placementType === "org_subscription";
                  const isWaivedEventFee =
                    isEventFee && shouldWaiveEventFee({ waiveEventPayment });

                  const lineTotal = getLineTotal(item, {
                    isOrgFlow,
                    orgSubscriptionActive,
                    waiveEventPayment,
                  });

                  return (
                    <div
                      key={item.id}
                      style={{
                        border:
                          selectedItemId === item.id
                            ? "1px solid #b69240"
                            : "1px solid #e5e7eb",
                        borderRadius: 18,
                        padding: 18,
                        background:
                          selectedItemId === item.id ? "#fffdfa" : "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 16,
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 16,
                              color: "#101828",
                            }}
                          >
                            Campaign Item #{index + 1}
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              color: "#475467",
                              fontSize: 14,
                            }}
                          >
                            {isWaivedEventFee
                              ? "Event Submission Fee (Waived)"
                              : meta.label}{" "}
                            · {getRegionLabel(selectedRegion)} ·{" "}
                            {getItemScheduleLabel(item)}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedItemId(item.id)}
                            style={{
                              borderRadius: 999,
                              padding: "8px 12px",
                              fontWeight: 700,
                              fontSize: 12,
                              border:
                                selectedItemId === item.id
                                  ? "1px solid #b69240"
                                  : "1px solid #e5e7eb",
                              background:
                                selectedItemId === item.id
                                  ? "#fff7e6"
                                  : "#fafafa",
                              color:
                                selectedItemId === item.id
                                  ? "#b69240"
                                  : "#475467",
                              cursor: "pointer",
                            }}
                          >
                            {selectedItemId === item.id ? "Selected" : "Select"}
                          </button>

                          <div style={availabilityPillStyle(item.availability)}>
                            {item.availability === "available" && "Available"}
                            {item.availability === "unavailable" && "Unavailable"}
                            {item.availability === "unknown" && "Unknown"}
                          </div>

                          <div
                            style={{
                              borderRadius: 999,
                              padding: "8px 12px",
                              fontWeight: 700,
                              fontSize: 12,
                              border: item.hasLocalMedia
                                ? "1px solid #abefc6"
                                : "1px solid #e5e7eb",
                              background: item.hasLocalMedia
                                ? "#ecfdf3"
                                : "#fafafa",
                              color: item.hasLocalMedia ? "#027a48" : "#475467",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {isEventFee || isOrgSubscription
                              ? "No Media Needed"
                              : item.hasLocalMedia
                              ? isFlyer
                                ? "✓ Flyer Attached"
                                : "✓ Image Attached"
                              : isFlyer
                              ? "No Flyer"
                              : "No Image"}
                          </div>

                          {!isEventFee && !item.isLocked ? (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                color: "#475467",
                                fontSize: 13,
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Remove
                            </button>
                          ) : (
                            <div
                              style={{
                                color: "#98a2b3",
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              Locked
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            isFlyer || isEventFee || isOrgSubscription
                              ? "1.2fr 1fr 1fr"
                              : "1.2fr 1fr 0.9fr 1fr",
                          gap: 14,
                        }}
                      >
                        <div>
                          <label style={fieldLabelStyle}>Placement</label>
                          {isEventFee ? (
                            <div
                              style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 14,
                                padding: 14,
                                background: "#fafafa",
                                minHeight: 50,
                                color: "#475467",
                                fontWeight: 700,
                                lineHeight: 1.5,
                              }}
                            >
                              {isWaivedEventFee
                                ? "Event Submission Fee (Waived)"
                                : "Event Submission Fee"}
                            </div>
                          ) : (
                            <select
                              style={inputStyle}
                              value={item.placementType}
                              onChange={(e) => {
                                const nextPlacementType =
                                  e.target.value as PlacementType;

                                updateItem(item.id, {
                                  placementType: nextPlacementType,
                                  durationDays:
                                    getDefaultDurationDays(nextPlacementType),
                                  quantity: 1,
                                  startDate: isWeeklyPlacement(nextPlacementType)
                                    ? toWeekStart(
                                        item.startDate || calendarAnchorDate
                                      )
                                    : item.startDate,
                                });
                              }}
                            >
                              {editablePlacementOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label style={fieldLabelStyle}>
                            {isFlyer || isEventFee || isOrgSubscription
                              ? "Activation"
                              : isDuration
                              ? "Start Date"
                              : "Week Starting"}
                          </label>

                          {isFlyer || isEventFee || isOrgSubscription ? (
                            <div
                              style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 14,
                                padding: 14,
                                background: "#fafafa",
                                minHeight: 50,
                                color: "#475467",
                                fontWeight: 700,
                                lineHeight: 1.5,
                              }}
                            >
                              {isEventFee
                                ? isWaivedEventFee
                                  ? "Required fee waived"
                                  : "Required one-time event fee"
                                : isOrgSubscription
                                ? "Annual subscription"
                                : "Lives until linked event expires"}
                            </div>
                          ) : (
                            <input
                              type="date"
                              style={inputStyle}
                              value={item.startDate}
                              onChange={(e) =>
                                updateItem(item.id, { startDate: e.target.value })
                              }
                            />
                          )}
                        </div>

                        {!isFlyer && !isEventFee && !isOrgSubscription ? (
                          <div>
                            <label style={fieldLabelStyle}>
                              {isDuration ? "Quantity" : "Weeks"}
                            </label>
                            <input
                              type="number"
                              min={1}
                              style={inputStyle}
                              value={String(item.quantity)}
                              onChange={(e) =>
                                updateItem(item.id, {
                                  quantity: Math.max(
                                    1,
                                    Number(e.target.value) || 1
                                  ),
                                })
                              }
                            />
                          </div>
                        ) : null}

                        <div>
                          <label style={fieldLabelStyle}>Line Total</label>
                          <div
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 14,
                              padding: 14,
                              background: "#fafafa",
                              minHeight: 50,
                            }}
                          >
                            <div style={{ fontWeight: 800, color: "#101828" }}>
                              {formatMoney(lineTotal)}
                            </div>
                            <div
                              style={{
                                marginTop: 4,
                                color: "#475467",
                                fontSize: 12,
                              }}
                            >
                              {isEventFee
                                ? isWaivedEventFee
                                  ? `Standard price ${formatMoney(
                                      getUnitPrice(item.placementType, {
                                        isOrgFlow,
                                        orgSubscriptionActive,
                                        regionCode: selectedRegion,
                                      })
                                    )}`
                                  : "Required one-time fee"
                                : isFlyer
                                ? "One-time flyer placement"
                                : isOrgSubscription
                                ? "One annual subscription"
                                : `Unit price ${formatMoney(
                                    getUnitPrice(item.placementType, {
                                      isOrgFlow,
                                      orgSubscriptionActive,
                                      regionCode: selectedRegion,
                                    })
                                  )}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      {isDuration || isEventFee || isOrgSubscription ? (
                        <div style={{ marginTop: 14 }}>
                          <label style={fieldLabelStyle}>
                            {isEventFee
                              ? "Fee Rule"
                              : isFlyer
                              ? "Flyer Rule"
                              : isOrgSubscription
                              ? "Subscription Rule"
                              : "Activation Window"}
                          </label>
                          <div
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 14,
                              padding: 14,
                              background: "#fafafa",
                              color: "#475467",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {isEventFee
                              ? waiveEventPayment
                                ? "Required fee for the linked event submission. This fee has been waived and will not be charged at checkout."
                                : "Required fee for the linked event submission. This fee is automatically included and cannot be removed."
                              : isFlyer
                              ? "Official Flyer remains active until the linked event expires."
                              : isOrgSubscription
                              ? "Annual organization subscription with org pricing and benefits once active."
                              : `Auto expires after ${
                                  item.durationDays ?? 21
                                }-day activation period unless renewed.`}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "260px 350px",
                alignItems: "start",                
                gap: 24,
              }}
            >
              <section style={cardStyle}>
                <div style={topMetaStyle}>Quick Builder</div>
                <h3 style={sectionTitleStyle}>
                  Generate consecutive weekly placements.
                </h3>

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={fieldLabelStyle}>Placement Type</label>
                    <select
                      style={inputStyle}
                      value={quickBuilderPlacementType}
                      onChange={(e) => {
                        const nextPlacementType = e.target.value as PlacementType;
                        setQuickBuilderPlacementType(nextPlacementType);
                        setCalendarPlacementType(nextPlacementType);
                      }}
                    >
                      {weeklyPlacementOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Starting Week</label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={calendarAnchorDate}
                      onChange={(e) =>
                        setCalendarAnchorDate(toWeekStart(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Number of Weeks</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      style={inputStyle}
                      value={String(quickBuilderWeeks)}
                      onChange={(e) =>
                        setQuickBuilderWeeks(
                          Math.min(24, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  style={{ ...primaryButtonStyle, width: "100%", marginTop: 18 }}
                  onClick={generateWeeklyItems}
                >
                  Generate Weekly Campaign Items
                </button>
              </section>


              <section style={{ ...cardStyle, maxWidth: 390}}>
                <div style={topMetaStyle}>Recurring Available Dates</div>
                <h3 style={sectionTitleStyle}>
                  Available {getRegionLabel(selectedRegion)} weeks appear in green.
                </h3>

                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    background: "#fafafa",
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      color: "#475467",
                      fontSize: 11,
                      marginBottom: 14,
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    Select a green week to set the Quick Builder starting week.
                    Grey weeks are unavailable and cannot be selected.
                  </div>

                  {isLoadingCalendar ? (
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 18,
                        background: "#ffffff",
                        color: "#475467",
                        fontWeight: 600,
                      }}
                    >
                      Loading recurring availability...
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 130px)",
                        justifyContent: "start",
                        gap: 8,
                      }}
                    >
                      {calendarWeeks.map((week) => {
                        const isSelected = calendarAnchorDate === week.weekStartDate;

                        return (
                          <button
                            key={`recurring-${week.placementType}-${week.weekStartDate}`}
                            type="button"
                            disabled={!week.available}
                            onClick={() => selectCalendarWeek(week.weekStartDate)}
                            style={{
                              border: isSelected
                                ? "2px solid #b69240"
                                : week.available
                                ? "1px solid #abefc6"
                                : "1px solid #eef2f6",
                              borderRadius: 14,
                              padding: "8px 6px",
                              background: isSelected
                                ? "#fff7e6"
                                : week.available
                                ? "#ecfdf3"
                                : "#f8fafc",
                              color: week.available ? "#101828" : "#98a2b3",
                              cursor: week.available ? "pointer" : "not-allowed",
                              textAlign: "left",
                              minHeight: 62,
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: 10, lineHeight: 1.2 }}>
                              {formatDate(week.weekStartDate)}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                color: week.available ? "#027a48" : "#98a2b3",
                              }}
                            >
                              {week.available
                                ? `Available · ${week.availableCount ?? 0} left`
                                : "Unavailable"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
              </section>
          </div>

          <aside
            style={{
              position: "sticky",
              top: 24,
              display: "grid",
              gap: 24,
            }}
          >
            <section style={cardStyle}>
              <div style={topMetaStyle}>Live Placement Preview</div>
              <h3 style={sectionTitleStyle}>
                Preview follows your selected placement type and campaign details.
              </h3>

              <PlacementPreview
                key={previewKey}
                placementType={previewPlacementType}
                state={previewState}
                imageUrl={previewImageUrl}
                title={previewTitle}
                sponsorName={previewSponsorName}
                description={previewDescription}
                dateLabel={previewDateLabel}
                locationLabel={
                  previewSourceItem?.placementType === "event_fee"
                    ? "Required fee item"
                    : previewSourceItem?.placementType === "org_subscription"
                    ? "Subscription item"
                    : `${getRegionLabel(selectedRegion)} event destination`
                }
              />

              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>

                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px dashed #e5e7eb",
                    background: "transparent",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/media-placement-guide")}
                >
                    View Media Placement Guide →
                </button>

                <label
                  htmlFor="promo-media-upload"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      previewSourceItem?.placementType === "event_fee" ||
                      previewSourceItem?.placementType === "org_subscription"
                        ? "#98a2b3"
                        : "#111827",
                    color: "#ffffff",
                    borderRadius: 14,
                    padding: "12px 18px",
                    fontWeight: 800,
                    cursor:
                      previewSourceItem?.placementType === "event_fee" ||
                      previewSourceItem?.placementType === "org_subscription"
                        ? "not-allowed"
                        : "pointer",
                    width: "100%",
                    opacity:
                      previewSourceItem?.placementType === "event_fee" ||
                      previewSourceItem?.placementType === "org_subscription"
                        ? 0.7
                        : 1,
                  }}
                >
                  {previewSourceItem?.placementType === "event_fee" ||
                  previewSourceItem?.placementType === "org_subscription"
                    ? "No Media Needed"
                    : previewSourceItem?.hasLocalMedia
                    ? previewSourceItem?.placementType === "official_flyer"
                      ? "Replace Official Flyer"
                      : "Replace Promo Media"
                    : previewSourceItem?.placementType === "official_flyer"
                    ? "Upload Official Flyer"
                    : "Upload Promo Media"}
                </label>

                {previewSourceItem?.hasLocalMedia ? (
                  <button
                    type="button"
                    style={{ ...secondaryButtonStyle, width: "100%" }}
                    onClick={clearPromoMediaSelection}
                  >
                    Remove Media
                  </button>
                ) : null}

                <input
                  id="promo-media-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePromoMediaChange}
                  disabled={
                    previewSourceItem?.placementType === "event_fee" ||
                    previewSourceItem?.placementType === "org_subscription"
                  }
                />

                <div
                  style={{
                    borderRadius: 12,
                    background: "#fafafa",
                    border: "1px solid #e5e7eb",
                    padding: 12,
                    color: "#475467",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {previewSourceItem?.placementType === "event_fee" ||
                  previewSourceItem?.placementType === "org_subscription"
                    ? "No media required for this item."
                    : previewSourceItem?.localMediaFileName
                    ? `Selected: ${previewSourceItem.localMediaFileName}`
                    : previewSourceItem?.placementType === "official_flyer"
                    ? "No official flyer uploaded yet."
                    : "No promo media uploaded yet."}
                </div>
              </div>
            </section>

            <section style={cardStyle}>
              <div style={topMetaStyle}>Campaign Summary</div>
              <h3 style={sectionTitleStyle}>Selected Region + Total</h3>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  color: "#475467",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <div>Region: {getRegionLabel(selectedRegion)}</div>
                <div>Total Items: {items.length}</div>
                <div>Subtotal: {formatMoney(campaignSubtotal)}</div>
              </div>

              <button
                type="button"
                style={{ ...primaryButtonStyle, width: "100%", marginTop: 18 }}
                onClick={continueToReview}
                disabled={isContinuing}
              >
                {isContinuing ? "Continuing..." : "Continue to Review"}
              </button>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
