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

function normalizeDate(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function normalizeTime(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

export default function OrgEditEventMetadataPage() {
  const { orgUuid, eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      if (!orgUuid || !eventId) {
        setError("Missing organization or event ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("auth_token");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/org/${orgUuid}/events/${eventId}/edit`,
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
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [orgUuid, eventId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!orgUuid || !eventId) return;

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/org/${orgUuid}/events/${eventId}/metadata`,
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

      setNotice(
        data?.message ||
          "Event metadata updated and returned to pending review."
      );

      window.setTimeout(() => {
        navigate(`/org/${orgUuid}/approved-events`);
      }, 900);
    } catch (err: any) {
      setError(err?.message || "Failed to update event metadata");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ color: "#f5f1e8", padding: "24px" }}>
        Loading event metadata...
      </div>
    );
  }

  return (
    <div style={{ color: "#f5f1e8", display: "grid", gap: "24px" }}>
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
          Organization Event Editor
        </div>

        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1, color: "#fffaf0" }}>
          Edit Event Metadata
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: 820,
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.7,
          }}
        >
          Update event details only. Media, flyers, logos, and promo creatives are not editable in
          this release. Approved or rejected events return to pending review after saving.
        </p>

        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            onClick={() => navigate(`/org/${orgUuid}/approved-events`)}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Approved Events
          </button>
        </div>
      </section>

      {error && (
        <div
          style={{
            border: "1px solid rgba(248,113,113,0.35)",
            background: "rgba(248,113,113,0.12)",
            color: "#fecaca",
            borderRadius: 16,
            padding: 16,
          }}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          style={{
            border: "1px solid rgba(34,197,94,0.35)",
            background: "rgba(34,197,94,0.12)",
            color: "#bbf7d0",
            borderRadius: 16,
            padding: 16,
          }}
        >
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "22px",
          padding: "24px",
          display: "grid",
          gap: "22px",
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
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
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
              background: "#c8a96b",
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
            onClick={() => navigate(`/org/${orgUuid}/approved-events`)}
            disabled={saving}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 18,
        display: "grid",
        gap: 14,
      }}
    >
      <h2 style={{ margin: 0, color: "#fffaf0", fontSize: "1.1rem" }}>{title}</h2>
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
      <span style={{ fontSize: 13, color: "rgba(245,241,232,0.72)", fontWeight: 700 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "#fffaf0",
          padding: "12px 14px",
          outline: "none",
        }}
      />
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
      <span style={{ fontSize: 13, color: "rgba(245,241,232,0.72)", fontWeight: 700 }}>
        {label}
      </span>
      <textarea
        value={value}
        required={required}
        rows={6}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "#fffaf0",
          padding: "12px 14px",
          outline: "none",
          resize: "vertical",
        }}
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
      <span style={{ fontSize: 13, color: "rgba(245,241,232,0.72)", fontWeight: 700 }}>
        {label}
      </span>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "#fffaf0",
          padding: "12px 14px",
          outline: "none",
        }}
      >
        {options.map((option) => (
          <option key={option || "blank"} value={option}>
            {option || "Select timezone"}
          </option>
        ))}
      </select>
    </label>
  );
}
