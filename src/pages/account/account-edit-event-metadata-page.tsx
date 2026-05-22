import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

type FormState = {
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  venue_name: string;
  address_line_1: string;
  city: string;
  state_region: string;
  country: string;
  country_code: string;
  is_virtual: boolean;
  sponsor_name: string;
  contact_email: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  event_type: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  timezone: "",
  venue_name: "",
  address_line_1: "",
  city: "",
  state_region: "",
  country: "",
  country_code: "",
  is_virtual: false,
  sponsor_name: "",
  contact_email: "",
};

const pageText = "#1C1D1F";
const mutedText = "#475569";
const border = "#e5e7eb";
const gold = "#c8a96b";

function normalizeDate(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function normalizeTime(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

export default function AccountEditEventMetadataPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      if (!eventId) {
        setError("Missing event ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("auth_token");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/account/events/${eventId}/edit`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load event metadata");
        }

        const event = data?.event || {};

        if (!isMounted) return;

        setForm({
          title: event.title || "",
          description: event.description || "",
          event_type: event.event_type || "",
          start_date: normalizeDate(event.start_date),
          end_date: normalizeDate(event.end_date),
          start_time: normalizeTime(event.start_time),
          end_time: normalizeTime(event.end_time),
          timezone: event.timezone || "",
          venue_name: event.venue_name || "",
          address_line_1: event.address_line_1 || "",
          city: event.city || "",
          state_region: event.state_region || "",
          country: event.country || "",
          country_code: event.country_code || "",
          is_virtual: Boolean(event.is_virtual),
          sponsor_name: event.sponsor_name || "",
          contact_email: event.contact_email || "",
        });
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load event metadata");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!eventId) return;

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/account/events/${eventId}/metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update event metadata");
      }

      setNotice(data?.message || "Event metadata updated and returned to pending review.");

      window.setTimeout(() => {
        navigate("/account/my-events");
      }, 900);
    } catch (err: any) {
      setError(err?.message || "Failed to update event metadata");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px", color: pageText }}>
        Loading event metadata...
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px", color: pageText }}>
      <section
        style={{
          background: "#ffffff",
          border: `1px solid ${border}`,
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.10)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "0.76rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#7a5a10",
            marginBottom: "10px",
            fontWeight: 800,
          }}
        >
          Account Event Editor
        </div>

        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1, color: pageText }}>
          Edit Event Information
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: 820,
            color: mutedText,
            lineHeight: 1.7,
          }}
        >
          Update event details only. Media, flyers, logos, and promo creatives are not editable in
          this release. Approved or rejected events return to pending review after saving.
        </p>

        <div style={{ marginTop: 18 }}>
          <button type="button" onClick={() => navigate("/account/my-events")} style={secondaryButton}>
            Back to My Events
          </button>
        </div>
      </section>

      {error && (
        <div
          style={{
            border: "1px solid rgba(220,38,38,0.25)",
            background: "#fef2f2",
            color: "#991b1b",
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          style={{
            border: "1px solid rgba(22,163,74,0.25)",
            background: "#f0fdf4",
            color: "#166534",
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            fontWeight: 700,
          }}
        >
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: `1px solid ${border}`,
          borderRadius: "22px",
          padding: "24px",
          display: "grid",
          gap: "22px",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
        }}
      >
        <FieldGroup title="Core Event Details">
          <TextInput label="Event Title" value={form.title} onChange={(v) => updateField("title", v)} required />
          <TextInput label="Event Type" value={form.event_type} onChange={(v) => updateField("event_type", v)} required />
          <TextArea label="Description" value={form.description} onChange={(v) => updateField("description", v)} required />
        </FieldGroup>

        <FieldGroup title="Schedule">
          <TextInput label="Start Date" type="date" value={form.start_date} onChange={(v) => updateField("start_date", v)} required />
          <TextInput label="End Date" type="date" value={form.end_date} onChange={(v) => updateField("end_date", v)} />
          <TextInput label="Start Time" type="time" value={form.start_time} onChange={(v) => updateField("start_time", v)} required />
          <TextInput label="End Time" type="time" value={form.end_time} onChange={(v) => updateField("end_time", v)} />
          <SelectInput
            label="Timezone"
            value={form.timezone}
            onChange={(v) => updateField("timezone", v)}
            required
            options={[
              "",
              "America/New_York",
              "America/Chicago",
              "America/Denver",
              "America/Los_Angeles",
              "America/Toronto",
              "America/Vancouver",
              "Europe/London",
              "Africa/Lagos",
              "Africa/Accra",
              "Africa/Johannesburg",
              "Africa/Nairobi",
            ]}
          />
        </FieldGroup>

        <FieldGroup title="Location">
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 800, color: pageText }}>
            <input
              type="checkbox"
              checked={form.is_virtual}
              onChange={(e) => updateField("is_virtual", e.target.checked)}
            />
            Virtual Event
          </label>

          <TextInput label="Venue Name" value={form.venue_name} onChange={(v) => updateField("venue_name", v)} />
          <TextInput label="Address Line 1" value={form.address_line_1} onChange={(v) => updateField("address_line_1", v)} />
          <TextInput label="City" value={form.city} onChange={(v) => updateField("city", v)} required={!form.is_virtual} />
          <TextInput label="State / Region" value={form.state_region} onChange={(v) => updateField("state_region", v)} />
          <TextInput label="Country" value={form.country} onChange={(v) => updateField("country", v)} required={!form.is_virtual} />
          <TextInput label="Country Code" value={form.country_code} onChange={(v) => updateField("country_code", v)} />
        </FieldGroup>

        <FieldGroup title="Sponsor / Contact">
          <TextInput label="Sponsor Name" value={form.sponsor_name} onChange={(v) => updateField("sponsor_name", v)} />
          <TextInput label="Contact Email" type="email" value={form.contact_email} onChange={(v) => updateField("contact_email", v)} />
        </FieldGroup>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: gold,
              color: "#111318",
              border: "none",
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 900,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Metadata"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/account/my-events")}
            disabled={saving}
            style={secondaryButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: 18,
        display: "grid",
        gap: 14,
        background: "#f8fafc",
      }}
    >
      <h2 style={{ margin: 0, color: pageText, fontSize: "1.1rem" }}>{title}</h2>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span style={{ fontSize: 13, color: "#334155", fontWeight: 800 }}>{label}</span>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span style={{ fontSize: 13, color: "#334155", fontWeight: 800 }}>{label}</span>
      <textarea
        value={value}
        required={required}
        rows={6}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, resize: "vertical" }}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span style={{ fontSize: 13, color: "#334155", fontWeight: 800 }}>{label}</span>
      <select value={value} required={required} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((option) => (
          <option key={option || "blank"} value={option}>
            {option || "Select timezone"}
          </option>
        ))}
      </select>
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: "#ffffff",
  color: pageText,
  padding: "12px 14px",
  outline: "none",
};

const secondaryButton: React.CSSProperties = {
  background: "#f8fafc",
  color: pageText,
  border: `1px solid ${border}`,
  borderRadius: "14px",
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
};
