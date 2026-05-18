import { useEffect, useState } from "react";
import "./admin-event-payments-page.css";

type Payment = {
  id: string;
  event_code: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_type: string;
  customer_email: string;
  created_at: string;
};

export default function AdminEventPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/v1/admin/event-payments");
      const data = await res.json();
      setPayments(data || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="admin-payments-page">
      <h1 className="page-title">Event Payments</h1>

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>Event Code</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Email</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.event_code || "-"}</td>

                <td>
                  ${(p.amount / 100).toFixed(2)}{" "}
                  {p.currency?.toUpperCase()}
                </td>

                <td className={`type ${p.payment_type}`}>
                  {p.payment_type}
                </td>

                <td className={`status ${p.payment_status}`}>
                  {p.payment_status}
                </td>

                <td>{p.customer_email || "-"}</td>

                <td>
                  {new Date(p.created_at).toLocaleDateString()}{" "}
                  {new Date(p.created_at).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
