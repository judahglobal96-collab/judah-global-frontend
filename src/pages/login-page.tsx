import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPlatformUser } from "../services/auth.api";

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

export default function LoginPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginPlatformUser({ email, password });

    if (res?.requiresOtp) {
      sessionStorage.setItem("auth_email", email);
      sessionStorage.setItem("auth_redirect", redirect);
      navigate(`/verify-otp?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
      setError(res?.message || "Login failed.");
    } catch {
      setError("Login error.");
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
          Welcome back
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Sign in to access your Judah Global account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
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
          {loading ? "Signing in..." : "Login"}
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
        New to Judah Global?{" "}
        <a
          href={`https://app.judahglobal.com/signup${
            redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
          }`}
          style={{
            color: "#0f172a",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Create an account
        </a>      
        </div>
    </div>
  );
}
