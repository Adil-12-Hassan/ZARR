import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/adminLayout.css";

/**
 * Left navigation for the admin panel.
 * Uses react-router-dom's NavLink so the active route gets the gold
 * indicator automatically  - no manual "which page am I on" state needed.
 *
 * Swap the `to` paths below to match wherever these routes are mounted
 * in your router (e.g. nested under "/admin/*").
 */

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M20 7 12 3 4 7v10l8 4 8-4V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M4 7l8 4 8-4M12 11v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/admin/articles",
    label: "Articles",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 3.5h9l3 3V20H6V3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 10h6M9 13.5h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3h9l3 3v15H6V3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 9h6M9 13h6M9 17h3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/admin/messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5h16v13H8l-4 4V5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h8M8 12.5h5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/admin/users",
    label: "Customers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3.5 20c.7-3.4 3-5.2 5.5-5.2s4.8 1.8 5.5 5.2M15.5 8.4a3 3 0 1 1 3.6 3M14.5 14.6c2.3.2 4.2 1.9 4.8 5.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2.1 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.6a7 7 0 0 0 2.1-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar({ collapsed = false, onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__mark">Z</span>
        {!collapsed && (
          <div className="admin-sidebar__brand-text">
            <strong>ZARR</strong>
            <span>Admin Panel</span>
          </div>
        )}
      </div>   <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>   <div className="admin-sidebar__footer">
        <div className="admin-sidebar__admin-chip">
          <span className="admin-sidebar__avatar">A</span>
          {!collapsed && (
            <div className="admin-sidebar__admin-meta">
              <strong>Admin</strong>
              <span>Store owner</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={handleLogout}
          aria-label="Logout from admin account"
          title={collapsed ? "Logout" : undefined}
        >
          <span className="admin-sidebar__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M15 8l4 4-4 4M19 12H9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
