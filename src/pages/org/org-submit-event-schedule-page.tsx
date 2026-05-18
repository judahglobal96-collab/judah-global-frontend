import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../../lib/submit-event-draft";
import OrgSubmitEventFaqCard from "../../components/org/OrgSubmitEventFaqCard";

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

export default function OrgSubmitEventSchedulePage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();
  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  const existingDraft = getSubmitEventDraft();
  const schedule = existingDraft.schedule || {};

  const [startDate, setStartDate] = useState(schedule.startDate || "");
  const [endDate, setEndDate] = useState(schedule.endDate || "");
  const [startTime, setStartTime] = useState(schedule.startTime || "");
  const [endTime, setEndTime] = useState(schedule.endTime || "");
  const [timezone, setTimezone] = useState(
    schedule.timezone || "America/Chicago"
  );
  const [recurrence, setRecurrence] = useState(
    schedule.recurrence || "One-Time Event"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !startTime || !endTime || !timezone) {
      setErrorMessage("Please complete all schedule fields.");
      return;
    }

    const validationMessage = getScheduleValidationMessage({
      startDate,
      endDate,
      startTime,
      endTime,
    });

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const draft = getSubmitEventDraft();

      if (!draft?.eventId) {
        throw new Error("Missing event ID. Please restart submission.");
      }

      const res = await fetch(
        `http://localhost:4000/api/v1/event-submissions/events/${draft.eventId}/schedule`,
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
            schedule_timezone: timezone,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to save schedule"
        );
      }

      saveSubmitEventDraft({
        ...draft,
        schedule: {
          ...draft.schedule,
          startDate,
          startTime,
          endDate,
          endTime,
          timezone,
          recurrence,
        },
      });

      navigate(`${baseOrgPath}/submit-event/location`);
    } catch (err) {
      console.error("Schedule save error:", err);
      setErrorMessage("Failed to save schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(20,22,30,0.96), rgba(13,15,22,0.96))",
    border: "1px solid rgba(200,169,107,0.16)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    color: "#fffaf0",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    padding: "13px 14px",
    fontSize: "0.96rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: "#1f222c",
    color: "#fffaf0",
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
              background: "rgba(255,255,255,0.06)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.14)",
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
            "linear-gradient(135deg, rgba(20,22,30,0.98), rgba(12,14,20,0.98))",
          border: "1px solid rgba(200,169,107,0.16)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.30)",
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
          Event Schedule
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
          Set the start and end timing for your event, including timezone and
          recurrence type, before continuing to the location step.
        </p>

        {errorMessage && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(220, 80, 80, 0.35)",
              background: "rgba(220, 80, 80, 0.12)",
              color: "#ffd6d6",
              fontWeight: 700,
            }}
          >
            {errorMessage}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to={`${baseOrgPath}/submit-event/basics`}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.06)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Back to Basics
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 18px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.22), rgba(200,169,107,0.10))",
              border: "1px solid rgba(200,169,107,0.30)",
              color: "#f3d89b",
              fontWeight: 700,
            }}
          >
            Step 2 of 5
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
            Schedule Form
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Enter event schedule details
          </h3>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={selectStyle}
              >
                {TIMEZONE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{
                      backgroundColor: "#1f222c",
                      color: "#fffaf0",
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Schedule Type / Recurrence</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                style={selectStyle}
              >
                <option
                  value="One-Time Event"
                  style={{ backgroundColor: "#1f222c", color: "#fffaf0" }}
                >
                  One-Time Event
                </option>
                <option
                  value="Recurring Event"
                  style={{ backgroundColor: "#1f222c", color: "#fffaf0" }}
                >
                  Recurring Event
                </option>
              </select>
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
                  "linear-gradient(135deg, rgba(200,169,107,0.34), rgba(200,169,107,0.16))",
                color: "#fffaf0",
                border: "1px solid rgba(200,169,107,0.38)",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 700,
                boxShadow: "0 12px 28px rgba(0,0,0,0.20)",
                cursor: isSubmitting ? "wait" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Continue to Location"}
            </button>

            <Link
              to={`${baseOrgPath}/submit-event/basics`}
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.06)",
                color: "#fffaf0",
                border: "1px solid rgba(255,255,255,0.14)",
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