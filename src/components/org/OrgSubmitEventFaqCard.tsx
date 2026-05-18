export default function OrgSubmitEventFaqCard() {
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
  };

  const eyebrowStyle: React.CSSProperties = {
    fontSize: "0.76rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#c8a96b",
    marginBottom: "10px",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(245, 241, 232, 0.58)",
    fontSize: "0.84rem",
  };

  const valueStyle: React.CSSProperties = {
    color: "#fffaf0",
    fontWeight: 600,
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div style={cardStyle}>
        <div style={eyebrowStyle}>Required to Create Draft</div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div>
            <div style={labelStyle}>Event Title</div>
            <div style={valueStyle}>Public-facing event name</div>
          </div>

          <div>
            <div style={labelStyle}>Event Description</div>
            <div style={valueStyle}>
              Describe your event in detail for public view. Include special
              guest, unique event activities, etc.
            </div>
          </div>

          <div>
            <div style={labelStyle}>Event Type</div>
            <div style={valueStyle}>
              Required event classification: concert, service, conference,
              business, podcast, etc.
            </div>
          </div>

          <div>
            <div style={labelStyle}>Event Contact Email</div>
            <div style={valueStyle}>
              Required for event verification and contact.
            </div>
          </div>

          <div>
            <div style={labelStyle}>Event Image</div>
            <div style={valueStyle}>
              Optional event image for public display. Uploaded images will be
              displayed on the event detail page.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(200,169,107,0.14), rgba(200,169,107,0.06))",
          border: "1px solid rgba(200,169,107,0.24)",
          borderRadius: "22px",
          padding: "24px",
        }}
      >
        <div style={eyebrowStyle}>Event Submission FAQ</div>

        <h3
          style={{
            margin: "0 0 10px",
            color: "#fffaf0",
            fontSize: "1.2rem",
          }}
        >
          Additional to know items
        </h3>

        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            color: "rgba(245, 241, 232, 0.82)",
            lineHeight: 1.65,
          }}
        >
          <li>Events are never pending.</li>
          <li>
            Once submitted and approved, events can be seen immediately by the
            public.
          </li>
          <li>
            All approved events are saved to your dashboard Approved Events.
          </li>
          <li>
            Approved events can only be edited from the Approved Events link on
            the left side.
          </li>
          <li>
            Media uploaded cannot be replaced once approved. Make sure you
            upload the correct media.
          </li>
          <li>
            Major Event promos public display immediately and auto expire after
            21 days. To extend your Major Event, return to your Org Dashboard,
            Approved Events, and select the “Extend Major Event” button.
          </li>
          <li>
            All “Featured” event promos public display immediately and auto
            expire when the event expires.
          </li>
        </ul>
      </div>
    </div>
  );
}
