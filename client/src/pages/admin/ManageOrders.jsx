import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import "../../styles/components/admin-ui.css";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const NEXT_STATUSES = {
  Pending: ["Confirmed", "Processing", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};
const STATUS_BADGE = {
  Pending: "badge-received",
  Confirmed: "badge-received",
  Processing: "badge-processing",
  Shipped: "badge-processing",
  Delivered: "badge-delivered",
  Cancelled: "badge-cancelled",
};

const money = (n) => `PKR ${Number(n || 0).toLocaleString()}`;

const orderId = (order) => String(order._id || order.id || "");
const customerName = (order) => order.shippingAddress?.fullName || order.user?.username || order.customer || "Customer";
const customerEmail = (order) => order.shippingAddress?.email || order.user?.email || order.email || "";
const itemSummary = (order) => Array.isArray(order.items)
  ? order.items.map((item) => item?.name).filter(Boolean).join(", ") || " -"
  : order.items || " -";

export default function ManageOrders() {
  const { orders, updateStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = [orderId(o), customerName(o), customerEmail(o)]
        .some((value) => value.toLowerCase().includes(query));
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
              <tr key={orderId(o)}>
                <td className="admin-table__primary">#{orderId(o).slice(-6).toUpperCase()}</td>
                <td>
                  {customerName(o)}
                  <div className="admin-table__muted">{customerEmail(o)}</div>
                </td>
                <td>{itemSummary(o)}</td>
                <td>{money(o.total)}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB") : o.date || " -"}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={`badge ${STATUS_BADGE[o.status] || "badge-received"}`}>{o.status || "Pending"}</span>
                    <select
                      className="admin-select"
                      style={{ padding: "5px 8px", fontSize: 12 }}
                      value={o.status || "Pending"}
                      onChange={(e) => updateStatus(orderId(o), e.target.value)}
                    >
                      {[o.status || "Pending", ...(NEXT_STATUSES[o.status || "Pending"] || [])].map((s) => <option key={s}>{s}</option>)}
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
