import { useMemo, useState } from "react";
import "../../styles/components/admin-ui.css";

// TODO: replace with data fetched from your API (e.g. GET /api/users)
const SEED_USERS = [
  {
    id: "U-201",
    name: "Ayesha Raza",
    email: "ayesha.raza@example.com",
    joined: "2026-02-11",
    orders: 3,
    spent: 268500,
    status: "Active",
  },
  {
    id: "U-202",
    name: "Bilal Farooq",
    email: "bilal.f@example.com",
    joined: "2026-03-04",
    orders: 1,
    spent: 95000,
    status: "Active",
  },
  {
    id: "U-203",
    name: "Hina Shah",
    email: "hina.shah@example.com",
    joined: "2025-11-20",
    orders: 5,
    spent: 412000,
    status: "Active",
  },
  {
    id: "U-204",
    name: "Omar Sheikh",
    email: "omar.sheikh@example.com",
    joined: "2026-01-15",
    orders: 1,
    spent: 0,
    status: "Blocked",
  },
  {
    id: "U-205",
    name: "Mahnoor Iqbal",
    email: "mahnoor.i@example.com",
    joined: "2025-09-02",
    orders: 4,
    spent: 356000,
    status: "Active",
  },
];

const money = (n) => `PKR ${n.toLocaleString()}`;

export default function ManageUsers() {
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const toggleStatus = (id) => {
    // TODO: api.patch(`/api/users/${id}`, { status })
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
          : u,
      ),
    );
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>Customers</h2>
          <p>{users.length} registered accounts</p>
        </div>
      </div>   <div className="admin-toolbar">
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
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty">
                  No customers match your search.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="admin-table__primary">{u.name}</span>
                  <div className="admin-table__muted">{u.email}</div>
                </td>
                <td>{u.joined}</td>
                <td>{u.orders}</td>
                <td>{money(u.spent)}</td>
                <td>
                  <span
                    className={`badge ${u.status === "Active" ? "badge-active" : "badge-blocked"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === "Active" ? "Block" : "Unblock"}
                    </button>
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
