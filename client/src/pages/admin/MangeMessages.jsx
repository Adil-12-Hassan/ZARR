import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/admin/Modal";
import { messageAPI } from "../../api/api";
import "../../styles/components/admin-ui.css";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageAPI.getAll();
        setMessages(data.map((m) => ({
          id: m._id,
          name: m.name,
          email: m.email,
          subject: m.subject || "No subject",
          body: m.message,
          date: new Date(m.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          read: Boolean(m.isRead),
        })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Unread") return messages.filter((m) => !m.read);
    if (filter === "Read") return messages.filter((m) => m.read);
    return messages;
  }, [messages, filter]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const openMessage = async (msg) => {
    setOpen(msg);
    if (!msg.read) {
      try {
        await messageAPI.markRead(msg.id);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await messageAPI.remove(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setOpen(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>Contact form messages</h2>
          <p>{unreadCount} unread of {messages.length} total</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Unread</option>
          <option>Read</option>
        </select>
      </div>

      <div className="table-wrap">
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
                <td colSpan={5} className="table-empty">No messages here.</td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => openMessage(m)}>
                <td>
                  <span className={`badge ${m.read ? "badge-read" : "badge-unread"}`}>{m.read ? "Read" : "New"}</span>
                </td>
                <td>
                  <span className="admin-table__primary">{m.name}</span>
                  <div className="admin-table__muted">{m.email}</div>
                </td>
                <td>{m.subject}</td>
                <td>{m.date}</td>
                <td>
                  <div className="admin-table__actions">
                    <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={open.subject} onClose={() => setOpen(null)}>
          <div style={{ marginBottom: 14, fontSize: 13, color: "var(--color-text-dim)" }}>
            <strong style={{ color: "var(--color-text-cream)" }}>{open.name}</strong> · {open.email} · {open.date}
          </div>
          <p style={{ color: "var(--color-text-soft)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{open.body}</p>
          <div className="form-actions">
            <button className="btn btn-danger" onClick={() => handleDelete(open.id)}>Delete</button>
            <a className="btn btn-gold" href={`mailto:${open.email}?subject=Re: ${open.subject}`}>Reply by email</a>
          </div>
        </Modal>
      )}
    </div>
  );
}
