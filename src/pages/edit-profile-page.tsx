import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyPlatformProfile,
  updateMyPlatformProfile,
} from "../services/auth.api";

type ProfileUser = {
  id: string;
  firstName: string;
  lastName: string;
  dobMonth: number;
  dobYear: number;
  city: string;
  stateRegion: string;
  email: string;
  role: "user" | "sysadmin" | "execsysadmin";
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
};

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
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.04em",
  color: "#334155",
  textTransform: "uppercase",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 24,
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  padding: "32px 28px",
};

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dobMonth: "",
    dobYear: "",
    city: "",
    stateRegion: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    getMyPlatformProfile(token)
      .then((res) => {
        if (res?.user) {
          const user: ProfileUser = res.user;

          setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            dobMonth: String(user.dobMonth || ""),
            dobYear: String(user.dobYear || ""),
            city: user.city || "",
            stateRegion: user.stateRegion || "",
            email: user.email || "",
          });
        } else {
          setError(res?.message || "Failed to load profile.");
        }
      })
      .catch(() => {
        setError("Error loading profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("Not authenticated.");
        setSaving(false);
        return;
      }

      const res = await updateMyPlatformProfile(token, {
        firstName: form.firstName,
        lastName: form.lastName,
        dobMonth: Number(form.dobMonth),
        dobYear: Number(form.dobYear),
        city: form.city,
        stateRegion: form.stateRegion,
      });

      if (res?.user) {
        const existingUserRaw = localStorage.getItem("auth_user");
        const existingUser = existingUserRaw ? JSON.parse(existingUserRaw) : {};

        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            ...existingUser,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            email: res.user.email,
            role: res.user.role,
            isEmailVerified: res.user.isEmailVerified,
          })
        );

        setSuccess("Profile updated successfully.");

        setTimeout(() => {
          navigate("/profile");
        }, 800);

        return;
      }

      setError(res?.message || "Failed to update profile.");
    } catch {
      setError("Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            color: "#475569",
            fontWeight: 600,
          }}
        >
          Loading profile editor...
        </div>
      </div>
    );
  }

  if (error && !form.email) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: 18,
            padding: "18px 20px",
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#C6A75E",
            marginBottom: 10,
          }}
        >
          Judah Global Account
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 40,
            lineHeight: 1.05,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          Edit Profile
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#64748b",
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          Update your personal details and keep your Judah Global account current.
        </p>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
              marginBottom: 18,
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Birth Month</label>
              <input
                type="number"
                value={form.dobMonth}
                onChange={(e) => updateField("dobMonth", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Birth Year</label>
              <input
                type="number"
                value={form.dobYear}
                onChange={(e) => updateField("dobYear", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>State</label>
              <input
                type="text"
                value={form.stateRegion}
                onChange={(e) => updateField("stateRegion", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={form.email}
              disabled
              style={{
                ...inputStyle,
                background: "#f8fafc",
                color: "#64748b",
                cursor: "not-allowed",
              }}
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

          {success && (
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
              {success}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "14px 18px",
                minWidth: 160,
                borderRadius: 12,
                border: "none",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                padding: "14px 18px",
                minWidth: 140,
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}