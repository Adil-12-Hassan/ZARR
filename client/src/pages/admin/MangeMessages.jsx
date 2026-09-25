import { useMemo, useState } from "react";
import Modal from "../../components/admin/Modal";
import "../../styles/components/admin-ui.css";

// TODO: replace with data fetched from your API (e.g. GET /api/messages)
const SEED_MESSAGES = [
  {
    id: "M-101",
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    subject: "Warranty question",
    body: "Hi, does the ZARR Heritage Automatic come with international warranty coverage if I travel to the UK?",
    date: "2026-08-27",
    read: false,
  },
  {
    id: "M-100",
    name: "Usman Tariq",
    email: "usman.t@example.com",
    subject: "Bulk order for corporate gifts",
    body: "We're looking to order 25 units of the Classic Moonphase as year-end gifts. Could you share pricing for bulk orders?",
    date: "2026-08-26",
    read: false,
  },
  {
    id: "M-099",
    name: "Sana Malik",
    email: "sana.malik@example.com",
    subject: "Order not received",
    body: "My order ZR-1035 was marked delivered but I haven't received it yet. Can someone look into this?",
    date: "2026-08-24",
    read: true,
  },
  {
    id: "M-098",
    name: "Daniyal Aziz",
    email: "daniyal.a@example.com",
    subject: "Strap replacement",
    body: "Is it possible to buy just a replacement leather strap for the Vanguard Black Edition?",
    date: "2026-08-20",
    read: true,
  },
];

export default function ManageMessages() {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "Unread") return messages.filter((m) => !m.read);
    if (filter === "Read") return messages.filter((m) => m.read);
    return messages;
  }, [messages, filter]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const openMessage = (msg) => {
    setOpen(msg);
    if (!msg.read) {
      // TODO: api.patch(`/api/messages/${msg.id}`, { read: true })
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      );
    }
  };

  const handleDelete = (id) => {
    // TODO: api.delete(`/api/messages/${id}`)
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setOpen(null);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>Contact form messages</h2>
          <p>
            {unreadCount} unread of {messages.length} total
          </p>
        </div>
      </div>   <div className="admin-toolbar">
        <select
          className="admin-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Unread</option>
          <option>Read</option>
        </select>
      </div>   <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  No messages here.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr
                key={m.id}
                style={{ cursor: "pointer" }}
                onClick={() => openMessage(m)}
              >
                <td>
                  <span
                    className={`badge ${m.read ? "badge-read" : "badge-unread"}`}
                  >
                    {m.read ? "Read" : "New"}
                  </span>
                </td>
                <td>
                  <span className="admin-table__primary">{m.name}</span>
                  <div className="admin-table__muted">{m.email}</div>
                </td>
                <td>{m.subject}</td>
                <td>{m.date}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>   {open && (
        <Modal title={open.subject} onClose={() => setOpen(null)}>
          <div
            style={{
              marginBottom: 14,
              fontSize: 13,
              color: "var(--color-text-dim)",
            }}
          >
            <strong style={{ color: "var(--color-text-cream)" }}>
              {open.name}
            </strong>{" "}
            · {open.email} · {open.date}
          </div>
          <p
            style={{
              color: "var(--color-text-soft)",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {open.body}
          </p>
          <div className="form-actions">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(open.id)}
            >
              Delete
            </button>
            <a
              className="btn btn-gold"
              href={`mailto:${open.email}?subject=Re: ${open.subject}`}
            >
              Reply by email
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
