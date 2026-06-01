import { Link } from "react-router-dom";

export default function SubmitEventPage() {
  return (
    <div className="container">
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: 36,
          maxWidth: 860,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Submit Event Portal</h1>

        <p style={{ color: "#555", lineHeight: 1.7, maxWidth: 700 }}>
          Add your faith-based event here. Ensure you have all your media ready to upload
          (see the Media Placement Guide). Once approved your event becomes discoverable 
          worldwide.
        </p>

        <div className="form-actions">
          <Link className="btn-primary" to="/submit-event/basics">
            Start Submission
          </Link>
        </div>
      </div>
    </div>
  );
}
