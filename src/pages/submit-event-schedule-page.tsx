import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../lib/submit-event-draft";

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "USA — Eastern (America/New_York)" },
  { value: "America/Chicago", label: "USA — Central (America/Chicago)" },
  { value: "America/Denver", label: "USA — Mountain (America/Denver)" },
  { value: "America/Los_Angeles", label: "USA — Pacific (America/Los_Angeles)" },

  { value: "America/Toronto", label: "Canada — Eastern (America/Toronto)" },
  { value: "America/Winnipeg", label: "Canada — Central (America/Winnipeg)" },
  { value: "America/Edmonton", label: "Canada — Mountain (America/Edmonton)" },
  { value: "America/Vancouver", label: "Canada — Pacific (America/Vancouver)" },

  { value: "Europe/London", label: "United Kingdom — London (Europe/London)" },

  { value: "Africa/Lagos", label: "Africa — West Africa Time / Lagos" },
  { value: "Africa/Accra", label: "Africa — Ghana / Accra" },
  { value: "Africa/Nairobi", label: "Africa — East Africa Time / Nairobi" },
  { value: "Africa/Johannesburg", label: "Africa — South Africa / Johannesburg" },

  { value: "UTC", label: "UTC" },
];

function getScheduleValidationMessage(args: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}) {
  const { startDate, endDate, startTime, endTime } = args;

  if (endDate < startDate) {
    return "End date cannot be earlier than start date.";
  }

  if (startDate === endDate && endTime < startTime) {
    return "End time cannot be earlier than start time on the same day.";
  }

  return "";
}

export default function SubmitEventSchedulePage() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const existingDraft = getSubmitEventDraft();

  const [eventType, setEventType] = useState("One-Time");
  const [startDate, setStartDate] = useState(
    existingDraft.schedule?.startDate || ""
  );
  const [startTime, setStartTime] = useState(
    existingDraft.schedule?.startTime || ""
  );
  const [endDate, setEndDate] = useState(existingDraft.schedule?.endDate || "");
  const [endTime, setEndTime] = useState(existingDraft.schedule?.endTime || "");
  const [scheduleTimezone, setScheduleTimezone] = useState(
    existingDraft.schedule?.timezone || "America/New_York"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reviewSummary = useMemo(() => {
    if (eventType === "One-Time") return "One-time event";
    return eventType;
  }, [eventType]);

  async function handleSaveAndContinue() {
    if (!eventId) {
      setError("Missing event ID.");
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime || !scheduleTimezone) {
      setError("Please complete all required schedule fields.");
      return;
    }

    const validationMessage = getScheduleValidationMessage({
      startDate,
      endDate,
      startTime,
      endTime,
    });

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/event-submissions/events/${eventId}/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_type: "one_time",
            start_date: startDate,
            start_time: startTime,
            end_date: endDate,
            end_time: endTime,
            schedule_timezone: scheduleTimezone,
          }),
        }
      );

      const rawText = await response.text();

      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save schedule right now.");
      }

      const latestDraft = getSubmitEventDraft();

      saveSubmitEventDraft({
        ...latestDraft,
        eventId,
        schedule: {
          startDate,
          startTime,
          endDate,
          endTime,
          timezone: scheduleTimezone,
          recurrence: reviewSummary,
        },
      });

      navigate(`/submit-event/${eventId}/location`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save schedule right now.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    navigate("/submit-event/basics");
  }

  return (
    <SubmitEventLayout
      title="Event Schedule"
      description="Set your event dates and time. If you need 'recurring' event dates, you must set up org acct."
    >
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="event-type">Event Type</label>
          <select
            id="event-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="One-Time">One-Time</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="start-time">Start Time</label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="end-time">End Time</label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            value={scheduleTimezone}
            onChange={(e) => setScheduleTimezone(e.target.value)}
          >
            {TIMEZONE_OPTIONS.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <strong>Summary:</strong> {reviewSummary}
        </div>

        {error && <p className="field-error">{error}</p>}

        <div className="actions-row">
          <button type="button" onClick={handleBack} disabled={saving}>
            Back
          </button>
          <button
            type="button"
            className="primary-action"
            onClick={handleSaveAndContinue}
            disabled={saving}
          >
            {saving ? "Saving..." : "Continue to Location"}
          </button>
        </div>
      </div>
    </SubmitEventLayout>
  );
}
