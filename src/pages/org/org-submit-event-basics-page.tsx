import { useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrgEventDraft } from "../../lib/org.api";
import { EVENT_TYPES } from "../../lib/event-options";
import {
  getSubmitEventDraft,
  saveSubmitEventDraft,
  resetSubmitEventDraft,
} from "../../lib/submit-event-draft";
import OrgSubmitEventFaqCard from "../../components/org/OrgSubmitEventFaqCard";

export default function OrgSubmitEventBasicsPage() {
  const { orgUuid } = useParams();
  const navigate = useNavigate();

  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";
  const draft = useMemo(() => getSubmitEventDraft(), []);

  const [title, setTitle] = useState(draft.basics.title || "");
  const [description, setDescription] = useState(draft.basics.description || "");
  const [category, setCategory] = useState(draft.basics.category || "Conference");
  const [contactEmail, setContactEmail] = useState(draft.sponsor.contactEmail || "");
  const [contactName, setContactName] = useState(draft.sponsor.contactName || "");
  const [contactPhone, setContactPhone] = useState(draft.sponsor.contactPhone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    contactEmail?: string;
  }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!title.trim()) {
      nextErrors.title = "Event title is required.";
    }

    if (!description.trim()) {
      nextErrors.description = "Event description is required.";
    }

    if (!category.trim()) {
      nextErrors.category = "Event type is required.";
    }

    if (!contactEmail.trim()) {
      nextErrors.contactEmail = "Sponsor contact email is required.";
    } else if (!/\S+@\S+\.\S+/.test(contactEmail.trim())) {
      nextErrors.contactEmail = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBlurSave = () => {
    const existingDraft = getSubmitEventDraft();

    saveSubmitEventDraft({
      ...existingDraft,
      basics: {
        ...existingDraft.basics,
        title,
        description,
        category,
      },
      sponsor: {
        ...existingDraft.sponsor,
        contactEmail,
        contactName,
        contactPhone,
      },
    });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || data?.error || "Failed to upload media");
      }

      console.log("[ORG MEDIA] upload success");
    } catch (err) {
      console.error("[ORG MEDIA] upload error:", err);
      alert("Draft created, but event image upload failed.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    if (!orgUuid) {
      alert("Organization UUID is missing.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const existingDraft = getSubmitEventDraft();

      saveSubmitEventDraft({
        ...existingDraft,
        basics: {
          ...existingDraft.basics,
          title,
          description,
          category,
        },
        sponsor: {
          ...existingDraft.sponsor,
          contactEmail,
          contactName,
          contactPhone,
        },
      });

      const res = await createOrgEventDraft(orgUuid, {
        title: title.trim(),
        description: description.trim(),
        event_type: category.trim(),
        submitter_email: contactEmail.trim(),
        submitter_name: contactName.trim(),
        submitter_phone: contactPhone.trim(),
      });

      const eventId =
        res?.event_id ||
        res?.id ||
        res?.eventId ||
        res?.event?.id ||
        res?.event?.event_id ||
        "";

      if (!eventId) {
        throw new Error("Draft created but no event ID was returned.");
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
        },
        sponsor: {
          ...freshDraft.sponsor,
          contactEmail,
          contactName,
          contactPhone,
        },
      });

      if (mediaFile) {
        await uploadEventMedia(eventId);
      }

      navigate(`${baseOrgPath}/submit-event/schedule`);
    } catch (error) {
      console.error("Org basics draft creation error:", error);
      alert("Failed to create event draft.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (hasError?: boolean): CSSProperties => ({
    width: "100%",
    background: "#1a1a1a",
    color: "#fffaf0",
    border: hasError
      ? "1px solid rgba(248,113,113,0.8)"
      : "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "13px 14px",
    fontSize: "0.96rem",
    outline: "none",
    boxSizing: "border-box",
  });

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "8px",
    color: "#fffaf0",
    fontWeight: 700,
    fontSize: "0.92rem",
  };

  const helperStyle: CSSProperties = {
    marginTop: "6px",
    color: "rgba(245, 241, 232, 0.65)",
    fontSize: "0.84rem",
    lineHeight: 1.45,
  };

  const errorStyle: CSSProperties = {
    marginTop: "6px",
    color: "#fca5a5",
    fontSize: "0.84rem",
    lineHeight: 1.4,
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
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
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
          Event Basics
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
          Start by entering the basic event information required to create the
          draft event and continue through Judah Global’s submission workflow.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to={`${baseOrgPath}/submit-event`}
            style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
              color: "#fffaf0",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Back to Submit Event
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 18px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.18), rgba(200,169,107,0.08))",
              border: "1px solid rgba(200,169,107,0.28)",
              color: "#f3d89b",
              fontWeight: 700,
            }}
          >
            Step 1 of 5
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
        <form
          onSubmit={handleContinue}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "22px",
            padding: "24px",
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
            Basics Form
          </div>

          <h3
            style={{
              margin: "0 0 18px",
              fontSize: "1.35rem",
              color: "#fffaf0",
            }}
          >
            Enter required event information
          </h3>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Event Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                style={{
                  ...inputStyle(),
                  padding: "10px",
                }}
              />
              {mediaPreview && (
                <div style={{ marginTop: "12px" }}>
                  <img
                    src={mediaPreview}
                    alt="Event image preview"
                    style={{
                      width: "180px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              )}
              <div style={helperStyle}>
                This image will appear on the event page after admin approval.
              </div>
            </div>

            <div>
              <label style={labelStyle}>Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                onBlur={handleBlurSave}
                style={inputStyle(Boolean(errors.title))}
                placeholder="Example: Chicago Gospel Festival"
              />
              {errors.title && <div style={errorStyle}>{errors.title}</div>}
            </div>

            <div>
              <label style={labelStyle}>Event Description</label>
              <textarea
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                onBlur={handleBlurSave}
                style={{
                  ...inputStyle(Boolean(errors.description)),
                  minHeight: "140px",
                  resize: "vertical",
                }}
                placeholder="Describe the event, audience, purpose, and key details."
              />
              {errors.description && (
                <div style={errorStyle}>{errors.description}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Event Type</label>
              <select
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCategory(e.target.value)
                }
                onBlur={handleBlurSave}
                style={inputStyle(Boolean(errors.category))}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.category && <div style={errorStyle}>{errors.category}</div>}
            </div>

            <div>
              <label style={labelStyle}>Sponsor Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setContactEmail(e.target.value)
                }
                onBlur={handleBlurSave}
                style={inputStyle(Boolean(errors.contactEmail))}
                placeholder="contact@organization.org"
              />
              {errors.contactEmail && (
                <div style={errorStyle}>{errors.contactEmail}</div>
              )}
              <div style={helperStyle}>
                This email is required to create the draft and continue through
                Judah Global’s verification and review flow.
              </div>
            </div>

            <div>
              <label style={labelStyle}>Sponsor Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setContactName(e.target.value)
                }
                onBlur={handleBlurSave}
                style={inputStyle()}
                placeholder="Primary event contact"
              />
            </div>

            <div>
              <label style={labelStyle}>Sponsor Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setContactPhone(e.target.value)
                }
                onBlur={handleBlurSave}
                style={inputStyle()}
                placeholder="Optional phone number"
              />
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
              disabled={isSubmitting || uploadingMedia}
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,169,107,0.28), rgba(200,169,107,0.14))",
                color: "#fffaf0",
                border: "1px solid rgba(200,169,107,0.34)",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 700,
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                cursor: isSubmitting || uploadingMedia ? "wait" : "pointer",
                opacity: isSubmitting || uploadingMedia ? 0.8 : 1,
              }}
            >
              {isSubmitting
                ? "Creating Draft..."
                : uploadingMedia
                ? "Uploading Image..."
                : "Continue to Schedule"}
            </button>

            <Link
              to={`${baseOrgPath}/submit-event`}
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.04)",
                color: "#fffaf0",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "12px 18px",
                fontWeight: 700,
              }}
            >
              Cancel
            </Link>
          </div>
        </form>

        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          <OrgSubmitEventFaqCard />
        </div>
        
      </div>
    </section>
    </div>
  );
}
