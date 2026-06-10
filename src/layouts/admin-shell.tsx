import { Outlet, NavLink } from "react-router-dom";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: isActive ? 700 : 500,
  color: isActive ? "#111827" : "#475569",
  background: isActive ? "#e2e8f0" : "transparent",
});

export default function AdminShell() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 260,
          borderRight: "1px solid #d4d4d8",
          padding: 24,
        }}
      >
        <h3 style={{ marginBottom: 20, fontSize: 24, fontWeight: 700 }}>Admin</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <NavLink to="/admin" end style={navLinkStyle}>
            Overview
          </NavLink>

          <NavLink to="/admin/pending-events" style={navLinkStyle}>
            Pending Review
          </NavLink>

          <NavLink to="/admin/media-review" style={navLinkStyle}>
            Media Review
          </NavLink>

          <NavLink to="/admin/approved-events" end style={navLinkStyle}>
            Approved Events
          </NavLink>

          <NavLink to="/admin/org-accounts" style={navLinkStyle}>
            Org Accounts
          </NavLink>

          <NavLink to="/admin/campaign-payments" style={navLinkStyle}>
            Payments
          </NavLink>

          <NavLink to="/" style={navLinkStyle}>
            Public Site
          </NavLink>

          <NavLink to="/admin/rejected-events" style={navLinkStyle}>
            Rejected Events
          </NavLink>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 40 }}>
        <Outlet />
      </main>
    </div>
  );
}
