import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminOrgAccount } from '../../services/admin/adminOrgAccounts.api';

type CreateOrgAccountForm = {
  organization_name: string;
  organization_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  state_region: string;
  country: string;
  website_url: string;
  instagram_url: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  verification_status: 'unverified' | 'verified';
  notes: string;
};

const initialForm: CreateOrgAccountForm = {
  organization_name: '',
  organization_type: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  city: '',
  state_region: '',
  country: 'United States',
  website_url: '',
  instagram_url: '',
  status: 'pending',
  verification_status: 'unverified',
  notes: '',
};

export default function AdminOrgAccountCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateOrgAccountForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof CreateOrgAccountForm>(
    key: K,
    value: CreateOrgAccountForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.organization_name.trim()) {
      setError('Organization name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createAdminOrgAccount({
        organization_name: form.organization_name.trim(),
        organization_type: form.organization_type.trim() || null,
        contact_name: form.contact_name.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        city: form.city.trim() || null,
        state_region: form.state_region.trim() || null,
        country: form.country.trim() || null,
        website_url: form.website_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        status: form.status,
        verification_status: form.verification_status,
        notes: form.notes.trim() || null,
      });

      navigate('/admin/org-accounts');
    } catch (err: any) {
      setError(err?.message || 'Failed to create organization account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Create Organization Account</h1>

      <p style={{ marginBottom: 20 }}>
        Create a formal organization record for sponsor or host management, recurring
        participation, and future organization-level workflows.
      </p>

      <button
        type="button"
        className="btn-secondary"
        onClick={() => navigate('/admin/org-accounts')}
      >
        Back to Org Accounts
      </button>

      <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
        {error && <div className="field-error">{error}</div>}

        <h2 style={{ marginTop: 30 }}>Organization Identity</h2>

        <div className="form-grid two-col">
          <div className="form-row">
            <label htmlFor="organization_name">Organization Name *</label>
            <input
              id="organization_name"
              type="text"
              value={form.organization_name}
              onChange={(e) => updateField('organization_name', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="organization_type">Organization Type</label>
            <input
              id="organization_type"
              type="text"
              value={form.organization_type}
              onChange={(e) => updateField('organization_type', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="contact_name">Contact Name</label>
            <input
              id="contact_name"
              type="text"
              value={form.contact_name}
              onChange={(e) => updateField('contact_name', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="contact_email">Contact Email</label>
            <input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => updateField('contact_email', e.target.value)}
            />
          </div>

          <div className="form-row" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="contact_phone">Contact Phone</label>
            <input
              id="contact_phone"
              type="text"
              value={form.contact_phone}
              onChange={(e) => updateField('contact_phone', e.target.value)}
            />
          </div>
        </div>

        <h2 style={{ marginTop: 40 }}>Location</h2>

        <div className="form-grid two-col">
          <div className="form-row">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="state_region">State / Region</label>
            <input
              id="state_region"
              type="text"
              value={form.state_region}
              onChange={(e) => updateField('state_region', e.target.value)}
            />
          </div>

          <div className="form-row" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={form.country}
              onChange={(e) => updateField('country', e.target.value)}
            />
          </div>
        </div>

        <h2 style={{ marginTop: 40 }}>Digital Presence</h2>

        <div className="form-grid two-col">
          <div className="form-row">
            <label htmlFor="website_url">Website URL</label>
            <input
              id="website_url"
              type="url"
              value={form.website_url}
              onChange={(e) => updateField('website_url', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="instagram_url">Instagram URL</label>
            <input
              id="instagram_url"
              type="url"
              value={form.instagram_url}
              onChange={(e) => updateField('instagram_url', e.target.value)}
            />
          </div>
        </div>

        <h2 style={{ marginTop: 40 }}>Account Controls</h2>

        <div className="form-grid two-col">
          <div className="form-row">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                updateField('status', e.target.value as CreateOrgAccountForm['status'])
              }
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="verification_status">Verification Status</label>
            <select
              id="verification_status"
              value={form.verification_status}
              onChange={(e) =>
                updateField(
                  'verification_status',
                  e.target.value as CreateOrgAccountForm['verification_status']
                )
              }
            >
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
            </select>
          </div>

          <div className="form-row" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="notes">Internal Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/org-accounts')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Organization Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
