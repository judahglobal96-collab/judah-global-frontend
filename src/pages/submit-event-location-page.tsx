import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../lib/submit-event-draft";

export default function SubmitEventLocationPage() {
  const navigate = useNavigate();
  const draft = getSubmitEventDraft();

  const [venueName, setVenueName] = useState(draft.location.venueName);
  const [addressLine1, setAddressLine1] = useState(draft.location.addressLine1);
  const [city, setCity] = useState(draft.location.city);
  const [stateRegion, setStateRegion] = useState(draft.location.stateRegion);
  const [country, setCountry] = useState(draft.location.country);
  const [isVirtual, setIsVirtual] = useState(draft.location.isVirtual);
  const [errors, setErrors] = useState<Record<string, string>>({});

  
  function handleBack() {
    const existingDraft = getSubmitEventDraft();

    saveSubmitEventDraft({
      ...existingDraft,
      location: {
        venueName,
        addressLine1,
        city,
        stateRegion,
        country,
        isVirtual,
      },
    });
      if (!existingDraft.eventId) {
    alert("Missing event ID.");
    return;
  }
     navigate(`/submit-event/${existingDraft.eventId}/schedule`);
  }

  async function handleContinue() {
    const nextErrors: Record<string, string> = {};
    const currentDraft = getSubmitEventDraft();
    const scheduleTimezone = currentDraft.schedule.timezone;
    const existingDraft = getSubmitEventDraft();

    saveSubmitEventDraft({
      ...existingDraft,
      location: {
        venueName,
        addressLine1,
        city,
        stateRegion,
        country,
        isVirtual,
      },
    });
    if (!country || country.trim().length < 3) {
    nextErrors.country = "* Please enter a valid country name";
  }

    if (!isVirtual) {
      if (!venueName.trim()) nextErrors.venueName = "* Required field";
      if (!addressLine1.trim()) nextErrors.addressLine1 = "* Required field";
      if (!city.trim()) nextErrors.city = "* Required field";
      if (!stateRegion.trim()) nextErrors.stateRegion = "* Required field";
    } else {
      if (!city.trim()) nextErrors.city = "* Required field";
    }

      if (isVirtual && !scheduleTimezone?.trim()) {
        nextErrors.timezone =
          "* Missing schedule timezone. Please go back to Schedule.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!currentDraft.eventId) {
      alert("Missing event draft ID. Please restart submission.");
      return;
    }

    const payload = {
      venue_name: isVirtual ? "Virtual Event" : venueName,
      address_line_1: isVirtual ? "Virtual" : addressLine1,
      city,
      state_region: stateRegion,
      country,
      timezone: scheduleTimezone,
      is_virtual: isVirtual,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/event-submissions/events/${currentDraft.eventId}/location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save location");
      }

      saveSubmitEventDraft({
        location: {
          venueName,
          addressLine1,
          city,
          stateRegion,
          country,
          isVirtual,
        },
      });

      navigate(`/submit-event/${currentDraft.eventId}/sponsor`);
    } catch (error) {
      console.error("Location save failed:", error);
      alert("Unable to save location right now.");
    }
  }

  return (
    <SubmitEventLayout
      title="Event Location"
      description="Tell attendees where this event will take place."
    >
      <div className="form-grid">
        <div className="form-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
            />
            <span>This is a virtual event</span>
          </label>
        </div>

        {!isVirtual && (
          <>
            <div className="form-row">
              <label>Venue Name</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
              />
              {errors.venueName && (
                <p className="field-error">{errors.venueName}</p>
              )}
            </div>

            <div className="form-row">
              <label>Address Line 1</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
              {errors.addressLine1 && (
                <p className="field-error">{errors.addressLine1}</p>
              )}
            </div>
          </>
        )}

        <div className="two-col">
          <div className="form-row">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <p className="field-error">{errors.city}</p>}
          </div>

          <div className="form-row">
            <label>State / Region</label>
            <input
              type="text"
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
            />
            {errors.stateRegion && (
              <p className="field-error">{errors.stateRegion}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {errors.country && <p className="field-error">{errors.country}</p>}
        </div>

        {errors.timezone && (
          <div className="form-row">
            <p className="field-error">{errors.timezone}</p>
          </div>
        )}

        <div className="actions-row">
            <button type="button" onClick={handleBack}>
              Back
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={handleContinue}
            >
              Continue to Sponsor
            </button>
        </div>
      </div>
    </SubmitEventLayout>
  );
}