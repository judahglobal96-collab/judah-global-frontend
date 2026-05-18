import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

type VerifyState = {
  submissionId?: string;
  email?: string;
  sponsorEmail?: string;
};

type VerifyOtpResponse = {
  success?: boolean;
  message?: string;
  verified?: boolean;
  event?: unknown;
  error?: string;
};

type ResendOtpResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function SubmitEventVerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();

  const locationState = (location.state || {}) as VerifyState;

const submissionId =
  locationState?.submissionId ||
  searchParams.get("submissionId") ||
  sessionStorage.getItem("pendingSubmissionId") ||
  localStorage.getItem("judah_submission_id") ||
  eventId ||
  "";

const sponsorEmail =
  locationState?.sponsorEmail ||
  locationState?.email ||
  searchParams.get("sponsorEmail") ||
  searchParams.get("email") ||
  sessionStorage.getItem("pendingSubmissionEmail") ||
  localStorage.getItem("judah_sponsor_email") ||
  "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);
  const isComplete =
    code.length === OTP_LENGTH && digits.every((d) => /^\d$/.test(d));

  useEffect(() => {
  if (submissionId) {
    sessionStorage.setItem("pendingSubmissionId", submissionId);
  }

  if (sponsorEmail) {
    sessionStorage.setItem("pendingSubmissionEmail", sponsorEmail);
  }
}, [submissionId, sponsorEmail]);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const maskedEmail = useMemo(() => {
    if (!sponsorEmail || !sponsorEmail.includes("@")) return sponsorEmail;
    const [name, domain] = sponsorEmail.split("@");
    if (name.length <= 2) return `${name[0] || ""}*@${domain}`;
    return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
  }, [sponsorEmail]);

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(0, 1);

    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  }

  function handleChange(index: number, value: string) {
    setError("");
    setSuccessMessage("");
    updateDigit(index, value);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "Enter" && isComplete && !isVerifying) {
      void handleVerify();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });

    setDigits(next);
    setError("");
    setSuccessMessage("");

    const lastIndex = Math.min(pasted.length - 1, OTP_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
  }

 async function handleVerify() {
  if (!submissionId) {
    setError("Missing submission ID. Please go back to the review page and resubmit.");
    return;
  }

  if (!sponsorEmail) {
    setError("Missing email address. Please go back to the review page and resubmit.");
    return;
  }

  if (!isComplete) {
    setError("Please enter the full 6-digit code.");
    return;
  }

  const code = digits.join("");

  try {
    setIsVerifying(true);
    setError("");

    console.log("VERIFY REQUEST:", {
      submissionId,
      code,
    });

    const res = await fetch("http://localhost:4000/api/v1/event-submissions/verify-email-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId,
        code,
      }),
    });

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    console.log("VERIFY STATUS:", res.status);
    console.log("VERIFY CONTENT TYPE:", contentType);
    console.log("VERIFY RAW RESPONSE:", raw);

    if (!contentType.includes("application/json")) {
      throw new Error(
        `Server returned non-JSON response (${res.status}). Check backend route or server error.`
      );
    }

    const data: VerifyOtpResponse = JSON.parse(raw);
    console.log("VERIFY RESPONSE:", data);
    
    if (!res.ok || !data.verified) {
    throw new Error(data?.error || data?.message || "Verification failed");
    }

    sessionStorage.removeItem("pendingSubmissionId");
    sessionStorage.removeItem("pendingSubmissionEmail");

    localStorage.removeItem("judah_submission_id");
    localStorage.removeItem("judah_sponsor_email");

    navigate("/submit-event/success");
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    setError(err instanceof Error ? err.message : "Verification failed");
  } finally {
    setIsVerifying(false);
  }
}

  async function handleResend() {
    if (!submissionId) {
      setError("Missing submission ID. Please go back and resubmit the event.");
      return;
    }

    if (!sponsorEmail) {
      setError("Missing email address. Please go back and resubmit the event.");
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE}/api/v1/event-submissions/events/resend-email-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissionId,
            sponsorEmail,
          }),
        }
      );

      const data: ResendOtpResponse = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Unable to resend code.");
      }

      setSuccessMessage(data.message || "A new code has been sent.");
      setResendCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to resend code.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="submit-event-page">
      <div className="submit-event-shell">
        <div className="verify-email-card">
          <div className="verify-email-header">
            <p className="verify-email-eyebrow">Judah Global</p>
            <h1>Verify your email</h1>
            <p className="verify-email-subtext">
              We sent a 6-digit verification code to{" "}
              <strong>{maskedEmail || "your email address"}</strong>.
            </p>
          </div>

          {!submissionId || !sponsorEmail ? (
            <div className="verify-email-alert verify-email-alert--error">
              We could not find your submission details. Please go back to the review page and
              submit your event again.
            </div>
          ) : null}

          {error ? (
            <div className="verify-email-alert verify-email-alert--error">{error}</div>
          ) : null}

          {successMessage ? (
            <div className="verify-email-alert verify-email-alert--success">
              {successMessage}
            </div>
          ) : null}

          <div className="verify-email-otp-group" aria-label="One-time password input">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                className="verify-email-otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${index + 1}`}
                disabled={isVerifying}
              />
            ))}
          </div>

          <button
            type="button"
            className="verify-email-primary-btn"
            onClick={handleVerify}
            disabled={!isComplete || isVerifying || !submissionId || !sponsorEmail}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>

          <div className="verify-email-footer-actions">
            <p className="verify-email-resend-text">Didn’t receive the code?</p>

            <button
              type="button"
              className="verify-email-link-btn"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isResending || !submissionId || !sponsorEmail}
            >
              {isResending
                ? "Sending..."
                : resendCountdown > 0
                ? `Resend code in ${resendCountdown}s`
                : "Resend code"}
            </button>
          </div>

          <div className="verify-email-meta">
            <Link
              to={eventId ? `/submit-event/${eventId}/review` : "/submit-event/review"}
              className="verify-email-back-link"
            >
              ← Back to Review
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .submit-event-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(37, 99, 235, 0.10), transparent 35%),
            linear-gradient(180deg, #08111f 0%, #0b1728 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
        }

        .submit-event-shell {
          width: 100%;
          max-width: 560px;
        }

        .verify-email-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .verify-email-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .verify-email-eyebrow {
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
        }

        .verify-email-header h1 {
          margin: 0 0 10px;
          font-size: 32px;
          line-height: 1.1;
          color: #0f172a;
        }

        .verify-email-subtext {
          margin: 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
        }

        .verify-email-alert {
          border-radius: 14px;
          padding: 12px 14px;
          margin-bottom: 18px;
          font-size: 14px;
          line-height: 1.5;
        }

        .verify-email-alert--error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .verify-email-alert--success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

          .verify-email-otp-group {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin: 22px 0 24px;
          width: 100%;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        .verify-email-otp-input {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          height: 60px;
          padding: 0;
          box-sizing: border-box;
          border-radius: 16px;
          border: 1.5px solid #cbd5e1;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          outline: none;
          transition: all 0.18s ease;
          background: #fff;
        }

        .verify-email-otp-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .verify-email-primary-btn {
          width: 100%;
          height: 52px;
          border: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.18s ease, opacity 0.18s ease;
        }

        .verify-email-primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .verify-email-primary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .verify-email-footer-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
        }

        .verify-email-resend-text {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .verify-email-link-btn {
          border: 0;
          background: transparent;
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .verify-email-link-btn:disabled {
          color: #94a3b8;
          cursor: not-allowed;
        }

        .verify-email-meta {
          margin-top: 22px;
          text-align: center;
        }

        .verify-email-back-link {
          color: #334155;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .verify-email-back-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 560px) {
          .verify-email-card {
            padding: 24px 18px;
            border-radius: 20px;
          }

          .verify-email-header h1 {
            font-size: 28px;
          }

          .verify-email-otp-group {
            gap: 8px;
          }

          .verify-email-otp-input {
            height: 52px;
            font-size: 22px;
            border-radius: 14px;
          }
        }
      `}</style>
    </main>
  );
}