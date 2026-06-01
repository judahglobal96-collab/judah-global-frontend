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
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h1 
          style={{ 
            margin: 0,
            marginBottom: 12,
            fontSize: "2.4rem",
            lineHeight: 1.05,
            color: "#ffffff",

             }}
             >
              Submit Event Portal
              </h1>

        <p 
        style={{ 
            margin: 0,
            maxWidth: 760,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.8,
            color: "#e2e8f0",
            textAlign: "center",
          
          }}

          >
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
