import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/pages/theme.css";
import "../styles/pages/adminLayout.css";

const TITLES = {
  "/admin": ["Dashboard", "Revenue and store activity at a glance"],
  "/admin/products": ["Products", "Add, edit and organize what's for sale"],
  "/admin/articles": ["Articles", "Write and publish stories for the ZARR Journal"],
  "/admin/orders": ["Orders", "Track and update every order's status"],
  "/admin/messages": ["Messages", "Enquiries submitted from the site's contact form"],
  "/admin/users": ["Customers", "Everyone who has created an account"],
  "/admin/settings": ["Settings", "Store, notification and account preferences"],
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] ?? ["Admin", ""];

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
      <div className={`admin-shell__scrim ${mobileOpen ? "is-visible" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`admin-shell__sidebar ${mobileOpen ? "is-open" : ""}`}>
        <AdminSidebar collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
      </div>   <div className="admin-shell__main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              className="admin-topbar__icon-btn admin-topbar__menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
            <button
              className="admin-topbar__icon-btn admin-topbar__collapse-btn"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Collapse sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 4v16M4 4h16v16H4V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </button>
            <div>
              <h1 className="admin-topbar__title">{title}</h1>
              {subtitle && <p className="admin-topbar__subtitle">{subtitle}</p>}
            </div>
          </div>       <div className="admin-topbar__right">
            <button className="admin-topbar__icon-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9.5 17.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              <span className="admin-topbar__dot" />
            </button>
            <div className="admin-topbar__profile">
              <span className="admin-topbar__avatar">A</span>
            </div>
          </div>
        </header>     <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
