import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import judahLogo from "../assets/judah2-logo.png";

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: active ? "#0f172a" : "#475569",
        fontWeight: active ? 700 : 600,
        padding: "10px 14px",
        borderRadius: 10,
        background: active ? "#eef2ff" : "transparent",
      }}
    >
      {label}
    </Link>
  );
}

type StoredAuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "user" | "sysadmin" | "execsysadmin";
  isEmailVerified?: boolean;
};

export default function PublicShell() {
  const navigate = useNavigate();

  let authUser: StoredAuthUser | null = null;

  try {
    const rawUser = localStorage.getItem("auth_user");
    authUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    authUser = null;
  }

  const canSeeAdmin =
    authUser?.role === "sysadmin" || authUser?.role === "execsysadmin";

  const isLoggedIn = Boolean(authUser);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_email");
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src={judahLogo}
              alt="Judah Global"
              style={{
                height: 65,
                width: "auto",
                display: "block",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800 }}>
                Judah Global
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Global Faith-based Event Discovery Network
              </span>
            </div>
          </Link>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <NavLink to="/" label="Home" />
            <NavLink to="/events" label="Events" />
            <NavLink to="/submit-event" label="Submit Event" />
            <NavLink to="/account/my-events" label="My Events" />

            {canSeeAdmin && <NavLink to="/admin" label="Admin" />}

            {!isLoggedIn && <NavLink to="/login" label="Login" />}
            {!isLoggedIn && <NavLink to="/signup" label="Sign Up" />}

            {isLoggedIn && <NavLink to="/profile" label="Profile" />}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: 700,
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "32px 24px 56px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}