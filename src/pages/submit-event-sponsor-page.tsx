import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
} from "../lib/submit-event-draft";
import { SPONSOR_TYPES } from "../lib/event-options";

declare global {
  interface Window {
    __eventMediaFile?: File;
  }
}

export default function SubmitEventSponsorPage() {
  const navigate = useNavigate();
  const draft = getSubmitEventDraft();

  const [sponsorName, setSponsorName] = useState(draft.sponsor.sponsorName || "");
  const [contactName, setContactName] = useState(draft.sponsor.contactName || "");
  const [contactEmail, setContactEmail] = useState(draft.sponsor.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(
    draft.sponsor.contactPhone || ""
  );
  const [website, setWebsite] = useState(draft.sponsor.website || "");
  const [sponsorType, setSponsorType] = useState(draft.sponsor.sponsorType || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function persistLocalDraft() {
    const currentDraft = getSubmitEventDraft();

    saveSubmitEventDraft({
      ...currentDraft,
      sponsor: {
        sponsorName,
        sponsorType,
        contactName,
        contactEmail,
        contactPhone,
        website,
        logoUrl: "",
      },
    });
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};

    if (!sponsorName.trim()) nextErrors.sponsorName = "* Required field";
    if (!sponsorType.trim()) nextErrors.sponsorType = "* Required field";
    if (!contactName.trim()) nextErrors.contactName = "* Required field";
    if (!contactEmail.trim()) nextErrors.contactEmail = "* Required field";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleBack() {
    persistLocalDraft();

    const currentDraft = getSubmitEventDraft();
    if (!currentDraft.eventId) {
      alert("Missing event ID.");
      return;
    }

    navigate(`/submit-event/${currentDraft.eventId}/location`);
  }

  async function handleContinue() {
    persistLocalDraft();

    if (!validateForm()) {
      return;
    }

    const currentDraft = getSubmitEventDraft();

    if (!currentDraft.eventId) {
      alert("Missing event ID.");
      return;
    }

    setSaving(true);

    try {
      const mediaFile = window.__eventMediaFile;

      if (mediaFile && currentDraft.eventId) {
        const formData = new FormData();
        formData.append("media", mediaFile);
        formData.append("event_id", currentDraft.eventId);
        formData.append("upload_type", "event_media");

        const uploadResponse = await fetch(
          `http://localhost:4000/api/events/${currentDraft.eventId}/media`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadRaw = await uploadResponse.text();

        let uploadData: any = null;
        try {
          uploadData = uploadRaw ? JSON.parse(uploadRaw) : null;
        } catch {
          uploadData = null;
        }

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData?.message ||
              uploadData?.error ||
              uploadRaw ||
              "Unable to upload event image."
          );
        }
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/event-submissions/events/${currentDraft.eventId}/sponsor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sponsor_name: sponsorName,
            sponsor_type: sponsorType,
            contact_name: contactName,
            contact_email: contactEmail,
            contact_phone: contactPhone || null,
            website_url: website || null,
            logo_url: "",
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
        throw new Error(
          data?.error || rawText || "Unable to save sponsor right now."
        );
      }

      saveSubmitEventDraft({
        ...currentDraft,
        sponsor: {
          sponsorName,
          sponsorType,
          contactName,
          contactEmail,
          contactPhone,
          website,
          logoUrl: "",
        },
        media: {
          ...currentDraft.media,
          previewUrl: draft.media?.previewUrl || "",
        },
      });

      window.__eventMediaFile = undefined;

      navigate(`/submit-event/${currentDraft.eventId}/monetization`);
    } catch (error) {
      console.error("Sponsor save failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save sponsor right now."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SubmitEventLayout
      title="Sponsor Information"
      description="Add the church, ministry, or organization responsible for the event."
    >
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="sponsor-name">Sponsor / Organization Name</label>
          <input
            id="sponsor-name"
            type="text"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
          />
          {errors.sponsorName && (
            <p className="field-error">{errors.sponsorName}</p>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="sponsor-type">Sponsor Type</label>
          <select
            id="sponsor-type"
            value={sponsorType}
            onChange={(e) => setSponsorType(e.target.value)}
          >
            <option value="">Select sponsor type</option>
            {SPONSOR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.sponsorType && (
            <p className="field-error">{errors.sponsorType}</p>
          )}
        </div>

        <div className="two-col">
          <div className="form-row">
            <label htmlFor="contact-name">Contact Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Pastor Michael Johnson"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            {errors.contactName && (
              <p className="field-error">{errors.contactName}</p>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              placeholder="events@revivalfire.org"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            {errors.contactEmail && (
              <p className="field-error">{errors.contactEmail}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="contact-phone">Phone (optional)</label>
          <input
            id="contact-phone"
            type="text"
            placeholder="(555) 555-5555"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="website">Website or Registration Link</label>
          <input
            id="website"
            type="url"
            placeholder="https://example.org/register"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Sponsor Logo section intentionally disabled for now */}

        <div className="form-row" style={{ marginTop: 24 }}>
          <label htmlFor="event-image">Event Image (optional)</label>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
            This image will appear on event cards and the event page.
          </p>

          <input
            id="event-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);

              saveSubmitEventDraft({
                ...getSubmitEventDraft(),
                media: {
                  ...getSubmitEventDraft().media,
                  fileName: file.name,
                  previewUrl,
                },
              });

              window.__eventMediaFile = file;
            }}
          />

          {draft.media?.previewUrl && (
            <img
              src={draft.media.previewUrl}
              alt="Event preview"
              style={{
                width: "100%",
                maxWidth: 420,
                height: 240,
                objectFit: "cover",
                marginTop: 12,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            />
          )}
        </div>

        <div className="actions-row">
          <button type="button" onClick={handleBack} disabled={saving}>
            Back
          </button>
          <button
            type="button"
            className="primary-action"
            onClick={handleContinue}
            disabled={saving}
          >
            {saving ? "Saving..." : "Continue to Monetization"}
          </button>
        </div>
      </div>
    </SubmitEventLayout>
  );
}