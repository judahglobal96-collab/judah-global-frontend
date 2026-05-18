export type SubmitEventDraft = {
  eventId: string;

  basics: {
    title: string;
    description: string;
    shortDescription: string;
    category: string;
  };

  schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    timezone: string;
    recurrence: string;
  };

  location: {
    venueName: string;
    addressLine1: string;
    city: string;
    stateRegion: string;
    country: string;
    isVirtual: boolean;
  };

  sponsor: {
    sponsorName: string;
    sponsorType: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
  };

  media: {
    fileName: string | null;
    previewUrl: string | null;
  };

  monetization: {
    hasFeaturedBadge: boolean;
    hasMajorEventAccess: boolean;
    selectedPlacementInventoryIds: string[];
    estimatedTotalCents: number;

    placementHoldSessionId?: string;
    reservedPlacementLabel?: string;
    placementProductCode?: string;
    holdExpiresAt?: string;

    promoType?: string;
    durationDays?: number;
    startDate?: string;
    endDate?: string;
    promoPriceCents?: number;
  };

  payment_status?: string;
  status?: string;
};

const STORAGE_KEY = "judah_submit_event_draft";

const emptyDraft: SubmitEventDraft = {
  eventId: "",
  basics: {
    title: "",
    description: "",
    shortDescription: "",
    category: "Conference",
  },
  schedule: {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: "",
    recurrence: "One-Time Event",
  },
  location: {
    venueName: "",
    addressLine1: "",
    city: "",
    stateRegion: "",
    country: "",
    isVirtual: false,
  },
  sponsor: {
    sponsorName: "",
    sponsorType: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    logoUrl: "",
  },
  media: {
    fileName: null,
    previewUrl: null,
  },
  monetization: {
    hasFeaturedBadge: false,
    hasMajorEventAccess: false,
    selectedPlacementInventoryIds: [],
    estimatedTotalCents: 0,

    placementHoldSessionId: "",
    reservedPlacementLabel: "",
    placementProductCode: "",
    holdExpiresAt: "",

    promoType: "",
    durationDays: 7,
    startDate: "",
    endDate: "",
    promoPriceCents: 0,
    },
};

declare global {
  interface Window {
    __eventMediaFile?: File;
  }
}

export function getEmptySubmitEventDraft(): SubmitEventDraft {
  return JSON.parse(JSON.stringify(emptyDraft));
}

export function getSubmitEventDraft(): SubmitEventDraft {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getEmptySubmitEventDraft();

  try {
    const parsed = JSON.parse(raw);

    return {
      ...getEmptySubmitEventDraft(),
      ...parsed,
      basics: {
        ...getEmptySubmitEventDraft().basics,
        ...(parsed.basics ?? {}),
      },
      schedule: {
        ...getEmptySubmitEventDraft().schedule,
        ...(parsed.schedule ?? {}),
      },
      location: {
        ...getEmptySubmitEventDraft().location,
        ...(parsed.location ?? {}),
      },
      sponsor: {
        ...getEmptySubmitEventDraft().sponsor,
        ...(parsed.sponsor ?? {}),
      },
      media: {
        ...getEmptySubmitEventDraft().media,
        ...(parsed.media ?? {}),
      },
      monetization: {
        ...getEmptySubmitEventDraft().monetization,
        ...(parsed.monetization ?? {}),
        selectedPlacementInventoryIds: Array.isArray(
          parsed?.monetization?.selectedPlacementInventoryIds
        )
          ? parsed.monetization.selectedPlacementInventoryIds
          : [],
      },
    };
  } catch {
    return getEmptySubmitEventDraft();
  }
}

export function saveSubmitEventDraft(
  partial: Partial<SubmitEventDraft>
): SubmitEventDraft {
  const current = getSubmitEventDraft();

  const next: SubmitEventDraft = {
    ...current,
    ...partial,
    basics: {
      ...current.basics,
      ...(partial.basics ?? {}),
    },
    schedule: {
      ...current.schedule,
      ...(partial.schedule ?? {}),
    },
    location: {
      ...current.location,
      ...(partial.location ?? {}),
    },
    sponsor: {
      ...current.sponsor,
      ...(partial.sponsor ?? {}),
    },
    media: {
      ...current.media,
      ...(partial.media ?? {}),
    },
    monetization: {
      ...current.monetization,
      ...(partial.monetization ?? {}),
      selectedPlacementInventoryIds: Array.isArray(
        partial?.monetization?.selectedPlacementInventoryIds
      )
        ? partial.monetization!.selectedPlacementInventoryIds
        : current.monetization.selectedPlacementInventoryIds,
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearSubmitEventDraft() {
  localStorage.removeItem(STORAGE_KEY);

  if (typeof window !== "undefined") {
    window.__eventMediaFile = undefined;
  }
}

export function resetSubmitEventDraft(eventId: string): SubmitEventDraft {
  const fresh = getEmptySubmitEventDraft();
  fresh.eventId = eventId;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));

  if (typeof window !== "undefined") {
    window.__eventMediaFile = undefined;
  }

  return fresh;
}