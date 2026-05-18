import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyPlatformUserOtp } from "../services/auth.api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 22,
  letterSpacing: "0.18em",
  textAlign: "center",
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

export default function VerifyOtpPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);

  const redirect =
    params.get("redirect") ||
    sessionStorage.getItem("auth_redirect") ||
    "/profile";

  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("auth_email") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyPlatformUserOtp({
        email,
        otpCode,
      });

      if (res?.token) {
        localStorage.setItem("auth_token", res.token);
        localStorage.setItem("auth_user", JSON.stringify(res.user));

        sessionStorage.removeItem("auth_email");
        sessionStorage.removeItem("auth_redirect");

        navigate(redirect);
        return;
      }

      setError(res?.message || "OTP verification failed.");
    } catch {
      setError("Verification error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#947b31",
            marginBottom: 10,
          }}
        >
          Judah Global Access
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1.05,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          Verify your code
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Enter the 6-digit verification code sent to your email.
        </p>

        {email && (
          <p
            style={{
              margin: "8px 0 0",
              color: "#0f172a",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {email}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <input
            type="text"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            style={inputStyle}
            maxLength={6}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div
        style={{
          marginTop: 22,
          textAlign: "center",
          color: "#64748b",
          fontSize: 15,
        }}
      >
        Need to return?{" "}
        <Link
          to={`/login?redirect=${encodeURIComponent(redirect)}`}
          style={{
            color: "#0f172a",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}