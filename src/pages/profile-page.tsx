import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPlatformProfile } from "../services/auth.api";

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

  hasOrgAccount?: boolean;
  organizationId?: string | null;
  organizationUuid?: string | null;
  organizationName?: string | null;
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#C6A75E",
  marginBottom: 10,
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 24,
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  padding: "32px 28px",
};

const statCardStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: "18px 18px",
};

const itemLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: 6,
};

const itemValueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.35,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("Not authenticated.");
      return;
    }

    getMyPlatformProfile(token)
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
        } else {
          setError(res?.message || "Failed to load profile.");
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error loading profile.");
      });
  }, []);

  if (error) {
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

  if (!user) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ ...cardStyle, textAlign: "center", color: "#475569", fontWeight: 600 }}>
          Loading profile...
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const roleLabel =
    user.role === "execsysadmin"
      ? "Executive System Admin"
      : user.role === "sysadmin"
        ? "System Admin"
        : "User";

  const hasOrgAccount =
    user.hasOrgAccount === true || Boolean(user.organizationUuid || user.organizationId);

  const orgDashboardPath = user.organizationUuid ? `/org/${user.organizationUuid}` : "/org";

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={sectionLabelStyle}>Judah Global Account</div>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.05, color: "#0f172a", fontWeight: 800 }}>
          My Profile
        </h1>
        <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 17, lineHeight: 1.7, maxWidth: 700 }}>
          Manage your Judah Global identity, account details, and platform access.
        </p>
      </div>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <div style={sectionLabelStyle}>Account Overview</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginBottom: 8 }}>
              {fullName}
            </div>
            <div style={{ color: "#64748b", fontSize: 16, fontWeight: 600 }}>{user.email}</div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              <button
                onClick={() => navigate("/profile/edit")}
                style={darkButtonStyle}
              >
                Edit Profile
              </button>

              {hasOrgAccount && (
                <button
                  onClick={() => navigate(orgDashboardPath)}
                  style={goldButtonStyle}
                >
                  Org Dashboard
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                background: user.isEmailVerified ? "#ecfdf5" : "#fff7ed",
                border: user.isEmailVerified ? "1px solid #bbf7d0" : "1px solid #fed7aa",
                color: user.isEmailVerified ? "#166534" : "#9a3412",
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {user.isEmailVerified ? "Verified Account" : "Pending Verification"}
            </div>

            {hasOrgAccount && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  color: "#92400e",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Organization Access
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <div style={statCardStyle}>
            <div style={itemLabelStyle}>Role</div>
            <div style={itemValueStyle}>{roleLabel}</div>
          </div>
          <div style={statCardStyle}>
            <div style={itemLabelStyle}>City</div>
            <div style={itemValueStyle}>{user.city || "—"}</div>
          </div>
          <div style={statCardStyle}>
            <div style={itemLabelStyle}>State</div>
            <div style={itemValueStyle}>{user.stateRegion || "—"}</div>
          </div>
          <div style={statCardStyle}>
            <div style={itemLabelStyle}>Birth Date</div>
            <div style={itemValueStyle}>{user.dobMonth}/{user.dobYear}</div>
          </div>
        </div>
      </div>

      {hasOrgAccount && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={sectionLabelStyle}>Organization Access</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <div>
              <div style={itemLabelStyle}>Organization</div>
              <div style={itemValueStyle}>{user.organizationName || "Organization Account"}</div>
            </div>
            <div>
              <div style={itemLabelStyle}>Access Status</div>
              <div style={itemValueStyle}>Active</div>
            </div>
            <div>
              <div style={itemLabelStyle}>Dashboard</div>
              <button onClick={() => navigate(orgDashboardPath)} style={goldButtonStyle}>
                Open Org Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={sectionLabelStyle}>Profile Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <div>
            <div style={itemLabelStyle}>First Name</div>
            <div style={itemValueStyle}>{user.firstName}</div>
          </div>
          <div>
            <div style={itemLabelStyle}>Last Name</div>
            <div style={itemValueStyle}>{user.lastName}</div>
          </div>
          <div>
            <div style={itemLabelStyle}>Email Address</div>
            <div style={itemValueStyle}>{user.email}</div>
          </div>
          <div>
            <div style={itemLabelStyle}>Account Status</div>
            <div style={itemValueStyle}>{user.isEmailVerified ? "Verified" : "Not Verified"}</div>
          </div>
          <div>
            <div style={itemLabelStyle}>Last Login</div>
            <div style={itemValueStyle}>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—"}</div>
          </div>
          <div>
            <div style={itemLabelStyle}>Member Since</div>
            <div style={itemValueStyle}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const darkButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const goldButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#C6A75E",
  color: "#111827",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};