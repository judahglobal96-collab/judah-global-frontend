import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminOrgAccounts,
  updateAdminOrgAccountStatus,
  type OrgAccount,
} from '../../services/admin/adminOrgAccounts.api';
import './admin-org-accounts-page.css';

type ActivationType = 'paid' | 'waived';

function formatDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
}

function buildLocation(org: OrgAccount) {
  const parts = [org.city, org.state_region, org.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

function getInitials(name?: string | null) {
  if (!name) return '—';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AdminOrgAccountsPage() {
  const navigate = useNavigate();

  const [orgAccounts, setOrgAccounts] = useState<OrgAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [activationOrg, setActivationOrg] = useState<OrgAccount | null>(null);
  const [activationType, setActivationType] = useState<ActivationType>('paid');
  const [waiverReason, setWaiverReason] = useState('Founder onboarding');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const rows = await fetchAdminOrgAccounts({
        status: statusFilter === 'all' ? '' : statusFilter,
        search: search.trim(),
      });

      setOrgAccounts(rows);
    } catch (err: any) {
      setError(err?.message || 'Failed to load organization accounts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const filteredCountLabel = useMemo(() => {
    return `${orgAccounts.length} account${orgAccounts.length === 1 ? '' : 's'}`;
  }, [orgAccounts.length]);

  async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loadData();
  }

  function openActivationModal(org: OrgAccount) {
    setActivationOrg(org);
    setActivationType('paid');
    setWaiverReason('Founder onboarding');
  }

  function closeActivationModal() {
    if (actionLoadingId) return;
    setActivationOrg(null);
    setActivationType('paid');
    setWaiverReason('Founder onboarding');
  }

  async function handleActivateOrganization() {
    if (!activationOrg) return;

    if (activationType === 'waived' && !waiverReason.trim()) {
      alert('Please enter a waiver reason.');
      return;
    }

    try {
      setActionLoadingId(activationOrg.id);

      const updated = await updateAdminOrgAccountStatus(activationOrg.id, 'active', {
        activation_type: activationType,
        billing_type: activationType,
        waiver_reason: activationType === 'waived' ? waiverReason.trim() : null,
      });
    
      setOrgAccounts((prev) =>
        prev.map((org) =>
          org.id === activationOrg.id
            ? {
                ...org,
                status: updated.status,
                billing_type: activationType,
              }
            : org
        )
      );

      closeActivationModal();
    } catch (err: any) {
      alert(err?.message || 'Failed to activate organization account');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleStatusChange(orgId: number, nextStatus: 'active' | 'suspended') {
    try {
      setActionLoadingId(orgId);

      const updated = await updateAdminOrgAccountStatus(orgId, nextStatus);

      setOrgAccounts((prev) =>
        prev.map((org) => (org.id === orgId ? { ...org, status: updated.status } : org))
      );
    } catch (err: any) {
      alert(err?.message || 'Failed to update org account status');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="admin-org-page">
      <div className="admin-org-hero">
        <div className="admin-org-hero-top">
          <div>
            <div className="admin-org-kicker">Judah Global Admin</div>
            <h1 className="admin-org-title">Organization Accounts</h1>
            <p className="admin-org-subtitle">
              Admin-managed sponsor and host entities for recurring platform participation.
              This area supports formal organization identity, operational review, and future
              organization-level access.
            </p>
          </div>

          <div className="admin-org-hero-actions">
            <div className="admin-org-count">{filteredCountLabel}</div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/admin/org-accounts/new')}
            >
              Create Organization Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="admin-org-toolbar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, contact, email, city, or state..."
            className="admin-org-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-org-select"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="admin-org-card">
        {loading ? (
          <div className="admin-org-loading">
            <div>
              <div className="admin-org-spinner" />
              <p className="admin-org-muted" style={{ marginTop: 16 }}>
                Loading organization accounts...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="admin-org-error">{error}</div>
        ) : orgAccounts.length === 0 ? (
          <div className="admin-org-empty">
            <div className="admin-org-empty-inner">
              <div className="admin-org-empty-badge">OA</div>
              <h2>No organization accounts found</h2>
              <p>
                No results matched your current search or filter. Try adjusting the status
                filter or search terms.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/admin/org-accounts/new')}
              >
                Create First Organization Account
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-org-table-wrap">
            <table className="admin-org-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orgAccounts.map((org) => (
                  <tr key={org.id}>
                    <td>
                      <div className="admin-org-orgcell">
                        <div className="admin-org-avatar">
                          {org.logo_url ? (
                            <img src={org.logo_url} alt={org.organization_name} />
                          ) : (
                            getInitials(org.organization_name)
                          )}
                        </div>

                        <div>
                          <div className="admin-org-orgname">{org.organization_name}</div>
                          <div className="admin-org-orgmeta">UUID: {org.org_uuid}</div>
                        </div>
                      </div>
                    </td>

                    <td>{org.organization_type || '—'}</td>

                    <td>
                      <div className="admin-org-contact-name">{org.contact_name || '—'}</div>
                      <div className="admin-org-contact-email">{org.contact_email || '—'}</div>
                    </td>

                    <td>{buildLocation(org)}</td>

                    <td>
                      <span className={`admin-org-pill ${org.status}`}>{org.status}</span>
                    </td>

                    <td>{formatDate(org.created_at)}</td>

                    <td>
                      <div className="admin-org-actions vertical">
                        {org.status !== 'active' && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => openActivationModal(org)}
                            disabled={actionLoadingId === org.id}
                          >
                            {actionLoadingId === org.id ? 'Updating...' : 'Activate'}
                          </button>
                        )}

                        {org.status === 'active' && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleStatusChange(org.id, 'suspended')}
                            disabled={actionLoadingId === org.id}
                          >
                            {actionLoadingId === org.id ? 'Updating...' : 'Suspend'}
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => navigate(`/org/${org.org_uuid}`)}
                        >
                          View Portal
                        </button>

                        <button type="button" className="btn-secondary">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activationOrg && (
        <div className="admin-org-modal-backdrop" role="presentation">
          <div className="admin-org-modal" role="dialog" aria-modal="true">
            <div className="admin-org-kicker">Organization Activation</div>
            <h2>Activate Organization</h2>

            <p className="admin-org-muted">
              Choose how to activate <strong>{activationOrg.organization_name}</strong>.
            </p>

            <div className="admin-org-modal-options">
              <label className="admin-org-radio-row">
                <input
                  type="radio"
                  name="activationType"
                  value="paid"
                  checked={activationType === 'paid'}
                  onChange={() => setActivationType('paid')}
                />
                <span>
                  <strong>Paid Subscription</strong>
                  <small>Activate as a standard paid organization.</small>
                </span>
              </label>

              <label className="admin-org-radio-row">
                <input
                  type="radio"
                  name="activationType"
                  value="waived"
                  checked={activationType === 'waived'}
                  onChange={() => setActivationType('waived')}
                />
                <span>
                  <strong>Waived Subscription</strong>
                  <small>Activate without Stripe payment.</small>
                </span>
              </label>
            </div>

            {activationType === 'waived' && (
              <div className="admin-org-field">
                <label>Waiver Reason</label>
                <select
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  className="admin-org-select"
                >
                  <option value="Founder onboarding">Founder onboarding</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <div className="admin-org-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeActivationModal}
                disabled={actionLoadingId === activationOrg.id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleActivateOrganization}
                disabled={actionLoadingId === activationOrg.id}
              >
                {actionLoadingId === activationOrg.id ? 'Activating...' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}