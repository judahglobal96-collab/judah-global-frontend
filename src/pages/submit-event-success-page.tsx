import { Link } from "react-router-dom";

export default function SubmitEventSuccessPage() {
  return (
    <div className="container">
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: 36,
          maxWidth: 760,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Event Submitted</h1>

        <p style={{ color: "#555", lineHeight: 1.7 }}>
          Your event has been submitted successfully and is now pending admin
          review. Once approved, it will become discoverable on JUDAH GLOBAL.
        </p>

        <div className="form-actions">
          <Link className="btn-primary" to="/account/my-events">
            Go to My Events
          </Link>
          <Link className="btn-secondary" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
