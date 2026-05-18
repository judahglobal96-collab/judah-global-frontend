import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPlatformUser } from "../services/auth.api";

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

export default function SignupPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await registerPlatformUser({
        firstName,
        lastName,
        dobMonth: Number(dobMonth),
        dobYear: Number(dobYear),
        city,
        stateRegion,
        email,
        password,
      });

      if (res?.requiresOtp) {
        sessionStorage.setItem("auth_email", email);
        navigate("/verify-otp");
        return;
      }

      setError(res?.message || "Signup failed.");
    } catch {
      setError("Signup error.");
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
          Create your account
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Join Judah Global to follow events and manage your account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Birth Month</label>
            <input
              type="number"
              placeholder="1-12"
              value={dobMonth}
              onChange={(e) => setDobMonth(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Birth Year</label>
            <input
              type="number"
              placeholder="YYYY"
              value={dobYear}
              onChange={(e) => setDobYear(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>State</label>
            <input
              type="text"
              placeholder="State"
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

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
            placeholder="Create a password"
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
          {loading ? "Creating account..." : "Sign Up"}
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
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#0f172a",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
