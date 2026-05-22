import { useMemo, useState } from "react";
import "./register-organization-page.css";

const ORG_TYPE_OPTIONS = [
  "Organization",
  "Church/Ministry",
  "Synagogue",
  "Artist",
  "Individual",
  "Business",
] as const;

const REGION_OPTIONS = [
  {
    value: "usa",
    label: "United States",
    priceCents: 29900,
    displayPrice: "$299/year",
  },
  {
    value: "canada",
    label: "Canada",
    priceCents: 29900,
    displayPrice: "$299/year",
  },
  {
    value: "uk",
    label: "United Kingdom",
    priceCents: 29900,
    displayPrice: "$299/year",
  },
  {
    value: "africa",
    label: "Africa",
    priceCents: 14900,
    displayPrice: "$149/year",
  },
] as const;

type SubscriptionRegion = (typeof REGION_OPTIONS)[number]["value"];

export default function RegisterOrganizationPage() {
  const [form, setForm] = useState({
    organization_name: "",
    organization_type: "Organization",
    contact_name: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state_region: "",
    country: "",
    subscription_region: "usa" as SubscriptionRegion,
  });

  const [loading, setLoading] = useState(false);

  const selectedRegion = useMemo(() => {
    return (
      REGION_OPTIONS.find(
        (region) => region.value === form.subscription_region
      ) || REGION_OPTIONS[0]
    );
  }, [form.subscription_region]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/org-accounts/public-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const registerData = await registerRes.json().catch(() => ({}));

      if (!registerRes.ok) {
        throw new Error(
          registerData?.message || "Failed to register organization"
        );
      }

      const organization = registerData?.organization;

      if (!organization?.id || !organization?.org_uuid) {
        throw new Error(
          "Organization was created, but required payment data is missing."
        );
      }
      console.log("SUB REGION:", selectedRegion.value);
      
      const paymentRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/payments/org-subscription-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgAccountId: organization.id,
            orgUuid: organization.org_uuid,
            organizationName: organization.organization_name,
            contactEmail: organization.contact_email || form.email,

            subscriptionRegion: selectedRegion.value,
            subscriptionRegionLabel: selectedRegion.label,
            subscriptionPriceCents: selectedRegion.priceCents,
            subscriptionDisplayPrice: selectedRegion.displayPrice,
          }),
        }
      );

      const paymentData = await paymentRes.json().catch(() => ({}));

      if (!paymentRes.ok) {
        throw new Error(
          paymentData?.message ||
            "Organization registered, but failed to start subscription checkout."
        );
      }

      if (!paymentData?.url) {
        throw new Error(
          "Organization registered, but Stripe checkout URL was not returned."
        );
      }

      window.location.href = paymentData.url;
      return;
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-org-page">
      <div className="register-org-hero">
        <p className="register-org-eyebrow">Judah Global</p>
        <h1 className="register-org-title">Register Your Organization</h1>
        <p className="register-org-subtitle">
          Create your official presence on Judah Global. This allows your
          organization to host events, expand outreach, and access future
          platform tools.
        </p>
      </div>

      <div className="register-org-card">
        <form className="register-org-form" onSubmit={handleSubmit}>
          <div className="register-org-grid">
            <div className="register-org-field register-org-field--full">
              <label className="register-org-label" htmlFor="organization_name">
                Organization Name
              </label>
              <input
                id="organization_name"
                name="organization_name"
                type="text"
                className="register-org-input"
                placeholder="Enter organization name"
                value={form.organization_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="organization_type">
                Org Type
              </label>
              <select
                id="organization_type"
                name="organization_type"
                className="register-org-input"
                value={form.organization_type}
                onChange={handleChange}
                required
              >
                {ORG_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="subscription_region">
                Primary Region
              </label>
              <select
                id="subscription_region"
                name="subscription_region"
                className="register-org-input"
                value={form.subscription_region}
                onChange={handleChange}
                required
              >
                {REGION_OPTIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label} — {region.displayPrice}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-org-field register-org-field--full">
              <div
                style={{
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  borderRadius: "16px",
                  padding: "18px",
                  background: "rgba(15, 23, 42, 0.04)",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>
                  Annual Organization Subscription
                </p>
                <h3 style={{ margin: "8px 0 4px", fontSize: "26px" }}>
                  {selectedRegion.displayPrice}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.75 }}>
                  Region: {selectedRegion.label}. This subscription unlocks
                  organization portal access, approved event management, and
                  promotional tools.
                </p>
              </div>
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="contact_name">
                Contact Name
              </label>
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                className="register-org-input"
                placeholder="Enter contact name"
                value={form.contact_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="register-org-input"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="register-org-input"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="register-org-field register-org-field--full">
              <label className="register-org-label" htmlFor="street_address">
                Street Address
              </label>
              <input
                id="street_address"
                name="street_address"
                type="text"
                className="register-org-input"
                placeholder="Enter street address"
                value={form.street_address}
                onChange={handleChange}
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="register-org-input"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="state_region">
                State / Region
              </label>
              <input
                id="state_region"
                name="state_region"
                type="text"
                className="register-org-input"
                placeholder="Enter state or region"
                value={form.state_region}
                onChange={handleChange}
              />
            </div>

            <div className="register-org-field">
              <label className="register-org-label" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="register-org-input"
                placeholder="Enter country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-org-actions">
            <button
              type="submit"
              className="register-org-button"
              disabled={loading}
            >
              {loading
                ? "Redirecting to Payment..."
                : `Register Organization — ${selectedRegion.displayPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
