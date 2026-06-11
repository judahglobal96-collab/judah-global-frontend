import { useEffect, useState } from "react";
import "./admin-event-payments-page.css";

type CampaignPayment = {
  id: string;
  campaign_code?: string | null;
  campaign_name?: string | null;
  organization_name?: string | null;
  organization_uuid?: string | null;
  event_id?: string | null;
  amount?: number | null;
  amount_cents?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  status?: string | null;
  stripe_session_id?: string | null;
  checkout_session_id?: string | null;
  customer_email?: string | null;
  created_at?: string | null;
};

export default function AdminEventPaymentsPage() {
  const [payments, setPayments] = useState<CampaignPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/v1/event-payments`);

      if (!res.ok) {
        throw new Error(`Failed to load campaign payments: ${res.status}`);
      }

      const data = await res.json();
      setPayments(Array.isArray(data) ? data : data?.payments || []);
    } catch (error) {
      console.error("Failed to fetch campaign payments:", error);
      setError("Failed to load campaign payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="admin-payments-page">
      <h1 className="page-title">Campaign Payments</h1>

      {loading ? (
        <p className="payments-message">Loading campaign payments...</p>
      ) : error ? (
        <p className="payments-message payments-error">{error}</p>
      ) : payments.length === 0 ? (
        <p className="payments-message">No campaign payments found.</p>
      ) : (
        <div className="payments-table-wrap">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Campaign Code</th>
                <th>Campaign</th>
                <th>Organization</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Email</th>
                <th>Stripe Session</th>
                <th>Event ID</th>
                <th>Created Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => {
                const status = p.payment_status || p.status || "-";
                const createdAt = p.created_at ? new Date(p.created_at) : null;
                const amountCents = p.amount_cents ?? p.amount ?? 0;
                const stripeSession =
                  p.stripe_session_id || p.checkout_session_id || "-";

                return (
                  <tr key={p.id}>
                    <td>{p.campaign_code || "-"}</td>
                    <td>{p.campaign_name || "-"}</td>
                    <td>{p.organization_name || p.organization_uuid || "-"}</td>
                    <td>
                      ${(amountCents / 100).toFixed(2)}{" "}
                      {p.currency?.toUpperCase() || "USD"}
                    </td>
                    <td className={`status ${status}`}>{status}</td>
                    <td>{p.customer_email || "-"}</td>
                    <td className="mono-cell">{stripeSession}</td>
                    <td className="mono-cell">{p.event_id || "-"}</td>
                    <td>
                      {createdAt
                        ? `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}