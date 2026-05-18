import { Outlet } from "react-router-dom";
import judahLogo from "../assets/judah2-logo.png";

export default function AuthShell() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src={judahLogo}
              alt="Judah Global"
              style={{
                height: 68,
                width: "auto",
                display: "block",
              }}
            />

            <div style={{ lineHeight: 1.08 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Judah Global
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Global Faith-Based Event Discovery Network
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px 72px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
            padding: "36px 32px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
