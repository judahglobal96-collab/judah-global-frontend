import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicShell from "../../layouts/public-shell";
import AuthShell from "../../layouts/auth-shell";
import AdminShell from "../../layouts/admin-shell";
import ProtectedRoute from "../../components/ProtectedRoute";

import HomePage from "../../pages/home-page";
import EventsDiscoveryPage from "../../pages/EventsDiscoveryPage";
import EventDetailPage from "../../pages/event-detail-page";
import SubmitEventPage from "../../pages/submit-event-page";
import SubmitEventBasicsPage from "../../pages/submit-event-basics-page";
import SubmitEventSchedulePage from "../../pages/submit-event-schedule-page";
import SubmitEventLocationPage from "../../pages/submit-event-location-page";
import SubmitEventSponsorPage from "../../pages/submit-event-sponsor-page";
import SubmitEventMonetizationPage from "../../pages/submit-event-monetization-page";
import SubmitEventReviewPage from "../../pages/submit-event-review-page";
import SubmitEventVerifyEmailPage from "../../pages/submit-event-verify-email-page";
import SubmitEventSuccessPage from "../../pages/submit-event-success-page";
import NotFoundPage from "../../pages/not-found-page";

import LoginPage from "../../pages/login-page";
import SignupPage from "../../pages/signup-page";
import VerifyOtpPage from "../../pages/verify-otp-page";
import ProfilePage from "../../pages/profile-page";
import EditProfilePage from "../../pages/edit-profile-page";

import AdminOverviewPage from "../../pages/admin-overview-page";
import AdminPendingEventsPage from "../../pages/admin-pending-events-page";
import AdminEventReviewPage from "../../pages/admin-event-review-page";
import AdminMediaReviewPage from "../../pages/admin/AdminMediaReviewPage";
import AdminApprovedEventsPage from "../../pages/admin/AdminApprovedEventsPage";
import AdminOrgAccountsPage from "../../pages/admin/admin-org-accounts-page";
import AdminOrgAccountCreatePage from "../../pages/admin/admin-org-account-create-page";
import AdminRejectedEventsPage from "../../pages/admin/admin-rejected-events-page";
import AdminEventLogsPage from "../../pages/admin/admin-event-logs-page";

import RegisterOrganizationPage from "../../pages/register-organization-page";

import OrgShell from "../../components/layout/org-shell";
import ActivatedOrgPage from "../../pages/org/activated-org-page";
import OrgSubmitEventPage from "../../pages/org/org-submit-event-page";
import OrgPromoteEventPage from "../../pages/org/org-promote-event-page";
import OrgApprovedEventsPage from "../../pages/org/org-approved-events-page";
import OrgBuildPresencePage from "../../pages/org/org-build-presence-page";
import OrgUploadMediaPage from "../../pages/org/org-upload-media-page";
import OrgSubmitEventBasicsPage from "../../pages/org/org-submit-event-basics-page";
import OrgSubmitEventSchedulePage from "../../pages/org/org-submit-event-schedule-page";
import OrgSubmitEventLocationPage from "../../pages/org/org-submit-event-location-page";
import OrgSubmitEventSponsorPage from "../../pages/org/org-submit-event-sponsor-page";
import OrgSubmitEventMonetizationPage from "../../pages/org/org-submit-event-monetization-page";
import OrgSubmitEventReviewPage from "../../pages/org/org-submit-event-review-page";
import OrgSubmitEventVerifyPage from "../../pages/org/org-submit-event-verify-page";
import OrgEditEventMetadataPage from "../../pages/org/org-edit-event-metadata-page";

import PaymentSuccessPage from "../../pages/payment-success-page";
import CampaignBuilderPage from "../../pages/campaign-builder-page";
import CampaignReviewPage from "../../pages/campaign-review-page";
import CampaignPaymentSuccessPage from "../../pages/campaign-payment-success-page";
import MajorEventsPage from "../../pages/majorEventsPage";
import MyEventsPage from "../../pages/account/my-events-page";
import AccountEditEventMetadataPage from "../../pages/account/account-edit-event-metadata-page";
import MediaPlacementGuidePage from "../../pages/media-placement-guide-page";
import AdminPaidPromosPage from "../../pages/admin/paid-promos-page";
import AdminSupportLookupPage from "../../pages/admin/support-lookup-page";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register-organization", element: <RegisterOrganizationPage /> },
      { path: "events", element: <EventsDiscoveryPage /> },
      { path: "event/:eventId", element: <EventDetailPage /> },

      {
        path: "account/my-events",
        element: (
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "account/events/:eventId/edit-metadata",
        element: (
          <ProtectedRoute>
            <AccountEditEventMetadataPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin", "sysadmin", "execsysadmin"]}>
            <AdminShell />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: "overview", element: <AdminOverviewPage /> },
          { path: "review", element: <AdminPendingEventsPage /> },
          { path: "events", element: <AdminApprovedEventsPage /> },
          { path: "events/pending", element: <AdminPendingEventsPage /> },
          { path: "events/:eventId", element: <AdminEventReviewPage /> },
          { path: "media-review", element: <AdminMediaReviewPage /> },
          { path: "org-accounts", element: <AdminOrgAccountsPage /> },
          { path: "org-accounts/new", element: <AdminOrgAccountCreatePage /> },
          { path: "events/rejected", element: <AdminRejectedEventsPage /> },
          { path: "events/:eventId/logs", element: <AdminEventLogsPage /> },
          { path: "/admin/events/:eventId/paid-promos", element: <AdminPaidPromosPage />},
          { path: "/admin/support-lookup", element: <AdminSupportLookupPage />},
        ],
      },

      { path: "submit-event", element: <SubmitEventPage /> },
      { path: "submit-event/basics", element: <SubmitEventBasicsPage /> },
      { path: "submit-event/:eventId/schedule", element: <SubmitEventSchedulePage /> },
      { path: "submit-event/:eventId/location", element: <SubmitEventLocationPage /> },
      { path: "submit-event/:eventId/sponsor", element: <SubmitEventSponsorPage /> },
      { path: "submit-event/:eventId/monetization", element: <SubmitEventMonetizationPage /> },
      { path: "submit-event/:eventId/review", element: <SubmitEventReviewPage /> },
      { path: "submit-event/:eventId/verify-email", element: <SubmitEventVerifyEmailPage /> },
      { path: "submit-event/success", element: <SubmitEventSuccessPage /> },

      { path: "payment-success", element: <PaymentSuccessPage /> },
      { path: "organization-registration-success", element: <PaymentSuccessPage /> },

      { path: "campaign-builder", element: <CampaignBuilderPage /> },
      { path: "campaign-review", element: <CampaignReviewPage /> },
      { path: "campaign-payment-success", element: <CampaignPaymentSuccessPage /> },
      { path: "major-events", element: <MajorEventsPage /> },
      { path: "media-placement-guide", element: <MediaPlacementGuidePage /> },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },

      // Safety redirect for old/broken literal orgUuid paths
      {
        path: "org/orgUuid/*",
        element: <Navigate to="/admin/org-accounts" replace />,
      },
    ],
  },

  {
    path: "/org/:orgUuid",
    element: (
      <ProtectedRoute>
        <OrgShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ActivatedOrgPage /> },
      { path: "submit-event", element: <OrgSubmitEventPage /> },
      { path: "promote-event", element: <OrgPromoteEventPage /> },
      { path: "approved-events", element: <OrgApprovedEventsPage /> },
      { path: "events/:eventId/edit-metadata", element: <OrgEditEventMetadataPage /> },
      { path: "build-presence", element: <OrgBuildPresencePage /> },
      { path: "upload-media", element: <OrgUploadMediaPage /> },

      { path: "submit-event/basics", element: <OrgSubmitEventBasicsPage /> },
      { path: "submit-event/schedule", element: <OrgSubmitEventSchedulePage /> },
      { path: "submit-event/location", element: <OrgSubmitEventLocationPage /> },
      { path: "submit-event/sponsor", element: <OrgSubmitEventSponsorPage /> },
      { path: "submit-event/monetization", element: <OrgSubmitEventMonetizationPage /> },
      { path: "submit-event/review", element: <OrgSubmitEventReviewPage /> },
      { path: "submit-event/verify/:eventId", element: <OrgSubmitEventVerifyPage /> },

      { path: "media-placement-guide", element: <MediaPlacementGuidePage /> },
    ],
  },

  {
    element: <AuthShell />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;