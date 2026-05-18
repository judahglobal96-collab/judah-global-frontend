import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function OrgSubmitEventVerifyPage() {
  const { orgUuid, eventId } = useParams();
  const navigate = useNavigate();

  const baseOrgPath = orgUuid ? `/org/${orgUuid}` : "/org";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const isCodeComplete = useMemo(() => /^\d{6}$/.test(code.trim()), [code]);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing. Please return to the review page.");
      return;
    }

    setOtpSent(true);
    setMessage("A verification code has been sent. Enter the 6-digit code below.");
  }, [eventId]);

  const handleCodeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setCode(digitsOnly);
    setError(null);
  };

 const handleVerify = async () => {
  if (!eventId) {
    setError("Event ID is missing.");
    return;
  }

  if (!isCodeComplete) {
    setError("Please enter the 6-digit verification code.");
    return;
  }

  setIsVerifying(true);
  setError(null);
  setMessage(null);

  try {
    const res = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/v1/events/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
        code: code.trim(),
      }),
    });

    const raw = await res.text();
    const data = raw ? JSON.parse(raw) : null;

    if (!res.ok) {
      throw new Error(data?.error || "OTP verification failed");
    }

    setMessage("Email verified. Event submitted for review.");

    setTimeout(() => {
      navigate(baseOrgPath);
    }, 1200);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OTP verification failed";
    setError(message);
  } finally {
    setIsVerifying(false);
  }
};

  const handleResend = async () => {
  if (!eventId) {
    setError("Event ID is missing.");
    return;
  }

  setIsResending(true);
  setError(null);
  setMessage(null);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/events/${eventId}/send-otp`, {
      method: "POST",
    });

    const raw = await res.text();
    const data = raw ? JSON.parse(raw) : null;

    if (!res.ok) {
      throw new Error(data?.error || "Failed to resend OTP");
    }

    setOtpSent(true);
    setCode("");
    setMessage("A new verification code has been sent.");

    if (data?.dev_otp) {
      console.log("Resent OTP:", data.dev_otp);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to resend OTP";
    setError(message);
  } finally {
    setIsResending(false);
  }
};

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.76rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#c8a96b",
    marginBottom: "10px",
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
          Verify Event Submission
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: "760px",
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.7,
            fontSize: "0.98rem",
          }}
        >
          Enter the verification code sent for this event submission to complete
          the Judah Global review workflow.
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
            to={`${baseOrgPath}/submit-event/review`}
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
            Back to Review
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
            Verification Required
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "24px",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Verification Code</div>

            <div
              style={{
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.7,
                marginBottom: "18px",
              }}
            >
              Enter the 6-digit code to confirm this event submission and move it
              into the pending review queue.
            </div>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              maxLength={6}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                color: "#fffaf0",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "16px 18px",
                fontSize: "1.1rem",
                letterSpacing: "0.24em",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={handleVerify}
                disabled={!isCodeComplete || isVerifying}
                style={{
                  background: "#c8a96b",
                  color: "#111318",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  fontWeight: 800,
                  border: "none",
                  cursor:
                    !isCodeComplete || isVerifying ? "not-allowed" : "pointer",
                  opacity: !isCodeComplete || isVerifying ? 0.65 : 1,
                }}
              >
                {isVerifying ? "Verifying..." : "Verify Submission"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#fffaf0",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  fontWeight: 700,
                  cursor: isResending ? "wait" : "pointer",
                  opacity: isResending ? 0.8 : 1,
                }}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>

            {message && (
              <div
                style={{
                  marginTop: "18px",
                  background: "rgba(85, 140, 102, 0.16)",
                  border: "1px solid rgba(85, 140, 102, 0.32)",
                  color: "#d8f3dc",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </div>
            )}

            {error && (
              <div
                style={{
                  marginTop: "18px",
                  background: "rgba(160, 66, 66, 0.16)",
                  border: "1px solid rgba(160, 66, 66, 0.32)",
                  color: "#ffd7d7",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Submission Status</div>

            <div
              style={{
                display: "grid",
                gap: "14px",
                color: "#fffaf0",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Event ID
                </div>
                <div style={{ fontWeight: 700, lineHeight: 1.6 }}>
                  {eventId || "Missing"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Current Step
                </div>
                <div style={{ fontWeight: 700, lineHeight: 1.6 }}>
                  {otpSent ? "Email verification in progress" : "Waiting to send code"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(245, 241, 232, 0.58)",
                    fontSize: "0.84rem",
                  }}
                >
                  Next Status
                </div>
                <div style={{ fontWeight: 700, lineHeight: 1.6 }}>
                  Pending review
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(200,169,107,0.14), rgba(200,169,107,0.06))",
              border: "1px solid rgba(200,169,107,0.24)",
              borderRadius: "22px",
              padding: "24px",
            }}
          >
            <div style={labelStyle}>What Happens Next</div>

            <h3
              style={{
                margin: "0 0 10px",
                color: "#fffaf0",
                fontSize: "1.2rem",
              }}
            >
              Verification completes submission
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(245, 241, 232, 0.82)",
                lineHeight: 1.65,
              }}
            >
              Once the code is verified, this event moves into Judah Global’s
              pending admin review workflow for approval.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
