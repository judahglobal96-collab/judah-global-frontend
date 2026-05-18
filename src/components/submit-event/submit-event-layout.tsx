import { Link, useLocation, useParams } from "react-router-dom";

type SubmitEventLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function SubmitEventLayout({
  title,
  description,
  children,
}: SubmitEventLayoutProps) {
  const location = useLocation();
  const { eventId } = useParams<{ eventId: string }>();

  const steps = [
    { label: "Basics", path: "/submit-event" },
    {
      label: "Schedule",
      path: eventId ? `/submit-event/${eventId}/schedule` : "/submit-event",
    },
    {
      label: "Location",
      path: eventId ? `/submit-event/${eventId}/location` : "/submit-event",
    },
    {
      label: "Sponsor",
      path: eventId ? `/submit-event/${eventId}/sponsor` : "/submit-event",
    },
    {
      label: "Monetization",
      path: eventId ? `/submit-event/${eventId}/monetization` : "/submit-event",
    },
    {
      label: "Review",
      path: eventId ? `/submit-event/${eventId}/review` : "/submit-event",
    },
    {
      label: "Verify Email",
      path: eventId
        ? `/submit-event/${eventId}/verify-email`
        : "/submit-event",
    },
  ];

  return (
    <div
      className="submit-event-shell"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 24px 64px",
      }}
    >
      <style>{`
        .submit-event-shell .submit-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .submit-event-shell .submit-form-area > * + * {
          margin-top: 18px;
        }

        .submit-event-shell label {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .submit-event-shell input[type="text"],
        .submit-event-shell input[type="email"],
        .submit-event-shell input[type="url"],
        .submit-event-shell input[type="date"],
        .submit-event-shell input[type="time"],
        .submit-event-shell select,
        .submit-event-shell textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #ffffff;
          color: #0f172a;
          font-size: 16px;
          padding: 12px 14px;
          outline: none;
        }

        .submit-event-shell input[type="text"],
        .submit-event-shell input[type="email"],
        .submit-event-shell input[type="url"],
        .submit-event-shell input[type="date"],
        .submit-event-shell input[type="time"],
        .submit-event-shell select {
          height: 48px;
        }

        .submit-event-shell textarea {
          min-height: 120px;
          resize: vertical;
        }

        .submit-event-shell input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #1d4ed8;
        }

        .submit-event-shell button {
          height: 48px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .submit-event-shell .primary-action,
        .submit-event-shell button[type="submit"] {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .submit-event-shell .actions-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .submit-event-shell .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .submit-event-shell .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0;
        }

        .submit-event-shell .checkbox-row span {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .submit-event-shell .field-error {
          margin: 8px 0 0;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        .submit-event-shell .sidebar-link {
          display: block;
          padding: 12px 14px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          color: #334155;
          transition: all 0.2s ease;
        }

        .submit-event-shell .sidebar-link.active {
          background: #eef2ff;
          color: #1d4ed8;
        }

        .submit-event-shell .sidebar-link:hover {
          background: #f8fafc;
        }

        @media (max-width: 960px) {
          .submit-event-shell .submit-grid {
            grid-template-columns: 1fr !important;
          }

          .submit-event-shell .two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: 0,
            marginBottom: 12,
            fontSize: "2.75rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "1.1rem",
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      <div
        className="submit-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        <aside className="submit-card" style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Submit Event</h3>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map((step) => {
              const isActive = location.pathname === step.path;

              return (
                <Link
                  key={step.label}
                  to={step.path}
                  className={`sidebar-link${isActive ? " active" : ""}`}
                >
                  {step.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="submit-card submit-form-area" style={{ padding: 32 }}>
          {children}
        </section>
      </div>
    </div>
  );
}