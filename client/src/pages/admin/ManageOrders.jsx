import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import "../../styles/components/admin-ui.css";

const STATUSES = ["Received", "Processing", "Delivered", "Cancelled"];
const STATUS_BADGE = {
  Received: "badge-received",
  Processing: "badge-processing",
  Delivered: "badge-delivered",
  Cancelled: "badge-cancelled",
};

const money = (n) => `PKR ${n.toLocaleString()}`;

export default function ManageOrders() {
  const { orders, updateStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>All orders</h2>
          <p>Status changes here reflect on the customer's dashboard immediately</p>
        </div>
      </div>   <div className="admin-toolbar">
        <div className="admin-search">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <input
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>   <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="table-empty">No orders match your search.</td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="admin-table__primary">{o.id}</td>
                <td>
                  {o.customer}
                  <div className="admin-table__muted">{o.email}</div>
                </td>
                <td>{o.items}</td>
                <td>{money(o.total)}</td>
                <td>{o.date}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={`badge ${STATUS_BADGE[o.status]}`}>{o.status}</span>
                    <select
                      className="admin-select"
                      style={{ padding: "5px 8px", fontSize: 12 }}
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
