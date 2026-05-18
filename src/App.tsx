import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicShell from "./layouts/public-shell";

import HomePage from "./pages/home-page";
import EventsPage from "./pages/events-page";
import EventsDiscoveryPage from "./pages/EventsDiscoveryPage";
import EventDetailPage from "./pages/event-detail-page";

import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import ProfilePage from "./pages/profile-page";
import EditProfilePage from "./pages/edit-profile-page";

import AdminPage from "./pages/admin-page";
import AdminOverviewPage from "./pages/admin-overview-page";
import AdminPendingEventsPage from "./pages/admin-pending-events-page";
import AdminEventReviewPage from "./pages/admin-event-review-page";

import SubmitEventPage from "./pages/submit-event-page";
import SubmitEventBasicsPage from "./pages/submit-event-basics-page";
import SubmitEventLocationPage from "./pages/submit-event-location-page";
import SubmitEventSchedulePage from "./pages/submit-event-schedule-page";
import SubmitEventSponsorPage from "./pages/submit-event-sponsor-page";
import SubmitEventMonetizationPage from "./pages/submit-event-monetization-page";
import SubmitEventReviewPage from "./pages/submit-event-review-page";
import SubmitEventVerifyEmailPage from "./pages/submit-event-verify-email-page";
import SubmitEventSuccessPage from "./pages/submit-event-success-page";

import AdminApprovedEventsPage from "./pages/admin/AdminApprovedEventsPage";
import AdminMediaReviewPage from "./pages/admin/AdminMediaReviewPage";
import AdminEventPaymentsPage from "./pages/admin/admin-event-payments-page";
import AdminRejectedEventsPage from "./pages/admin/admin-rejected-events-page";
import AdminOrgAccountsPage from "./pages/admin/admin-org-accounts-page";
import AdminOrgAccountCreatePage from "./pages/admin/admin-org-account-create-page";
import PaidPromosPage from "./pages/admin/paid-promos-page";
import SupportLookupPage from "./pages/admin/support-lookup-page";

import ActivatedOrgPage from "./pages/org/activated-org-page";
import OrgApprovedEventsPage from "./pages/org/org-approved-events-page";
import OrgBuildPresencePage from "./pages/org/org-build-presence-page";
import OrgSubmitEventPage from "./pages/org/org-submit-event-page";
import OrgSubmitEventBasicsPage from "./pages/org/org-submit-event-basics-page";
import OrgSubmitEventLocationPage from "./pages/org/org-submit-event-location-page";
import OrgSubmitEventSchedulePage from "./pages/org/org-submit-event-schedule-page";
import OrgSubmitEventSponsorPage from "./pages/org/org-submit-event-sponsor-page";
import OrgSubmitEventMonetizationPage from "./pages/org/org-submit-event-monetization-page";
import OrgSubmitEventReviewPage from "./pages/org/org-submit-event-review-page";
import OrgSubmitEventVerifyPage from "./pages/org/org-submit-event-verify-page";
import OrgUploadMediaPage from "./pages/org/org-upload-media-page";
import OrgPromoteEventPage from "./pages/org/org-promote-event-page";
import OrgEditEventMetadataPage from "./pages/org/org-edit-event-metadata-page";

import VerifyOtpPage from "./pages/verify-otp-page";
import NotFoundPage from "./pages/not-found-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicShell />}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/discover" element={<EventsDiscoveryPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/overview" element={<AdminOverviewPage />} />
          <Route path="/admin/pending-events" element={<AdminPendingEventsPage />} />
          <Route path="/admin/review/:eventId" element={<AdminEventReviewPage />} />
          <Route path="/admin/approved-events" element={<AdminApprovedEventsPage />} />
          <Route path="/admin/media-review" element={<AdminMediaReviewPage />} />
          <Route path="/admin/event-payments" element={<AdminEventPaymentsPage />} />
          <Route path="/admin/rejected-events" element={<AdminRejectedEventsPage />} />
          <Route path="/admin/org-accounts" element={<AdminOrgAccountsPage />} />
          <Route path="/admin/org-accounts/create" element={<AdminOrgAccountCreatePage />} />
          <Route path="/admin/paid-promos" element={<PaidPromosPage />} />
          <Route path="/admin/support-lookup" element={<SupportLookupPage />} />

          {/* Submit Event Flow */}
          <Route path="/submit-event" element={<SubmitEventPage />} />
          <Route path="/submit-event/basics" element={<SubmitEventBasicsPage />} />
          <Route path="/submit-event/location" element={<SubmitEventLocationPage />} />
          <Route path="/submit-event/schedule" element={<SubmitEventSchedulePage />} />
          <Route path="/submit-event/sponsor" element={<SubmitEventSponsorPage />} />
          <Route path="/submit-event/monetization" element={<SubmitEventMonetizationPage />} />
          <Route path="/submit-event/review" element={<SubmitEventReviewPage />} />
          <Route path="/submit-event/verify-email" element={<SubmitEventVerifyEmailPage />} />
          <Route path="/submit-event/success" element={<SubmitEventSuccessPage />} />

          {/* Organization */}
          <Route path="/org" element={<ActivatedOrgPage />} />
          <Route path="/org/approved-events" element={<OrgApprovedEventsPage />} />
          <Route path="/org/build-presence" element={<OrgBuildPresencePage />} />
          <Route path="/org/submit-event" element={<OrgSubmitEventPage />} />
          <Route path="/org/submit-event/basics" element={<OrgSubmitEventBasicsPage />} />
          <Route path="/org/submit-event/location" element={<OrgSubmitEventLocationPage />} />
          <Route path="/org/submit-event/schedule" element={<OrgSubmitEventSchedulePage />} />
          <Route path="/org/submit-event/sponsor" element={<OrgSubmitEventSponsorPage />} />
          <Route path="/org/submit-event/monetization" element={<OrgSubmitEventMonetizationPage />} />
          <Route path="/org/submit-event/review" element={<OrgSubmitEventReviewPage />} />
          <Route path="/org/submit-event/verify" element={<OrgSubmitEventVerifyPage />} />
          <Route path="/org/upload-media" element={<OrgUploadMediaPage />} />
          <Route path="/org/promote-event/:eventId" element={<OrgPromoteEventPage />} />
          <Route path="/org/edit-event/:eventId" element={<OrgEditEventMetadataPage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
