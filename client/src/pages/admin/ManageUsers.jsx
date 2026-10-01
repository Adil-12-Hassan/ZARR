import { useEffect, useMemo, useState } from "react";
import { userAPI } from "../../api/api";
import { useOrders } from "../../context/OrdersContext";
import "../../styles/components/admin-ui.css";

const money = (n) => `PKR ${Number(n || 0).toLocaleString()}`;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { orders } = useOrders();

  useEffect(() => {
    let active = true;
    userAPI.getAll()
      .then((data) => { if (active) setUsers(data); })
      .catch((err) => { if (active) setError(err.message || "Unable to load customers."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const orderTotals = useMemo(() => {
    const totals = new Map();
    orders.forEach((order) => {
      const userId = String(order.user?._id || order.user || "");
      if (!userId) return;
      const current = totals.get(userId) || { count: 0, spent: 0 };
      current.count += 1;
      current.spent += Number(order.total || 0);
      totals.set(userId, current);
    });
    return totals;
  }, [orders]);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>Customers</h2>
          <p>{users.length} registered accounts</p>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="admin-toolbar">
        <div className="admin-search">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m20 20-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>   <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="table-empty">Loading customers…</td></tr>
            ) : filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  No customers match your search.
                </td>
              </tr>
            )}
            {!loading && filtered.map((u) => {
              const totals = orderTotals.get(String(u._id)) || { count: 0, spent: 0 };
              return <tr key={u._id}>
                <td>
                  <span className="admin-table__primary">{u.username}</span>
                  <div className="admin-table__muted">{u.email}</div>
                </td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "—"}</td>
                <td>{totals.count}</td>
                <td>{money(totals.spent)}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
