import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth.api";

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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword({
        token,
        password,
      });

      if (res?.success === false) {
        setError(res?.message || "Password reset failed.");
        return;
      }

      setMessage("Your password has been updated. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to reset password. Please try again.");
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
          Create new password
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Enter and confirm your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Updating..." : "Update Password"}
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