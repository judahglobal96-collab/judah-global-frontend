import { Link } from "react-router-dom";
import SubmitEventLayout from "../components/submit-event/submit-event-layout";

export default function SubmitEventPage() {
  return (
      <SubmitEventLayout
        title="Submit Event Portal"
        description="Add your faith-based event here. Ensure you have all your media ready to 
        upload. Once approved, your event becomes discoverable worldwide."
      >
        <Link to="/submit-event/basics" className="primary-action">
            Start Submission
          </Link>
        </SubmitEventLayout>
      );
    }        
