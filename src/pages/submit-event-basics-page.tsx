import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
  resetSubmitEventDraft,
} from "../lib/submit-event-draft";
import { EVENT_TYPES } from "../lib/event-options";

export default function SubmitEventBasicsPage() {
  const navigate = useNavigate();
  const draft = getSubmitEventDraft();

  const [title, setTitle] = useState(draft.basics.title || "");
  const [description, setDescription] = useState(draft.basics.description || "");
  const [category, setCategory] = useState(draft.basics.category || "");
  const [shortDescription, setShortDescription] = useState(
    draft.basics.shortDescription || ""
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const uploadEventMedia = async (eventId: string) => {
    if (!mediaFile) return;

    try {
      setUploadingMedia(true);

      const formData = new FormData();
      formData.append("media", mediaFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/${eventId}/media`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to upload media");
      }

      console.log("Event media uploaded successfully");
    } catch (err) {
      console.error("Media upload error:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  async function handleContinue() {
    const nextErrors: Record<string, string> = {};
    const existingDraft = getSubmitEventDraft();

    if (!title.trim()) nextErrors.title = "* Required field";
    if (!category.trim()) nextErrors.category = "* Required field";
    if (!shortDescription.trim()) {
      nextErrors.shortDescription = "* Required field";
    }
    if (!description.trim()) {
      nextErrors.description = "* Required field";
    }

    saveSubmitEventDraft({
      ...existingDraft,
      basics: {
        ...existingDraft.basics,
        title,
        description,
        category,
        shortDescription,
      },
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "${import.meta.env.VITE_API_BASE_URL}/api/v1/event-submissions/draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            short_description: shortDescription.trim(),
            event_type: category.trim(),
            submitter_email:
              getSubmitEventDraft().sponsor.contactEmail ||
              localStorage.getItem("judah_submitter_email") ||
              "pending@judahglobal.org",
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        throw new Error(data?.error || "Failed to create event draft");
      }

      const eventId =
        data.event_id ||
        data.id ||
        data.eventId ||
        data.event?.id ||
        data.event?.event_id ||
        "";

      if (!eventId) {
        throw new Error("Missing event ID after draft creation");
      }

      const freshDraft = resetSubmitEventDraft(eventId);

      saveSubmitEventDraft({
        ...freshDraft,
        eventId,
        basics: {
          ...freshDraft.basics,
          title,
          description,
          category,
          shortDescription,
        },
      });

      if (mediaFile) {
        await uploadEventMedia(eventId);
      }

      navigate(`/submit-event/${eventId}/schedule`);
    } catch (error) {
      console.error("Draft creation failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save event basics right now.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SubmitEventLayout
      title="Event Basics"
      description="Start with the core details users will first see when discovering your event."
    >
      <div className="form-grid">
        <div className="form-row">
          <label>Event Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleMediaChange} />

          {mediaPreview && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={mediaPreview}
                alt="Preview"
                style={{
                  width: "200px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <p className="helper-text">
            This image will appear on the event page after admin approval.
          </p>
        </div>

        <div className="form-row">
          <label htmlFor="event-title">Event Title</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="form-row">
          <label htmlFor="event-category">Event Category</label>
          <select
            id="event-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {EVENT_TYPES.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>

        <div className="form-row">
          <label>Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
          />
          {errors.shortDescription && (
            <p className="field-error">{errors.shortDescription}</p>
          )}
        </div>

        <div className="form-row">
          <label>Full Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
          {errors.description && (
            <p className="field-error">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="submit-event-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/events")}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleContinue}
          disabled={saving || uploadingMedia}
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </SubmitEventLayout>
  );
}
