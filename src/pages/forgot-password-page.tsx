import { useState } from "react";
import { requestPasswordReset } from "../services/auth.api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await requestPasswordReset({ email });

      setMessage(
        "If an account exists for that email, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Unable to request password reset. Please try again.");
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
          Reset password
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Enter your email and we’ll send you a secure password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#ecfdf5",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

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
          {loading ? "Sending..." : "Send Reset Link"}
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
        Remember your password?{" "}
        <a
          href="/login"
          style={{
            color: "#0f172a",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to login
        </a>
      </div>
    </div>
  );
}