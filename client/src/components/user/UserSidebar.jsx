import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
    {
        label: "Profile",
        path: "/dashboard",
        icon: "⌂",
    },
    {
        label: "Orders",
        path: "/dashboard/orders",
        icon: "▣",
    },
    {
        label: "Wishlist",
        path: "/dashboard/wishlist",
        icon: "♡",
    },
    {
        label: "Addresses",
        path: "/dashboard/addresses",
        icon: "⌖",
    },
    {
        label: "Settings",
        path: "/dashboard/settings",
        icon: "⚙",
    },
];
function Sidebar({ onClose }) {
    const { user, logout } = useAuth();
    return (
        <aside className="user-sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="zarr-logo-mark">Z</div>
                <div>
                    <strong>ZARR.</strong>
                    <span>TIMELESS ELEGANCE</span>
                </div>
            </div>
            {/* User */}
            <div className="sidebar-user">
                <div className="sidebar-avatar">ZA</div>
                <div>
                        <strong>{user?.name || "ZARR Customer"}</strong>
                    <span>Customer</span>
                </div>
            </div>
            {/* Navigation */}
            <nav className="sidebar-navigation">
                <p className="navigation-title">ACCOUNT</p>
                {menuItems.map((item) => (
                    <NavLink key={item.path} to={item.path} end={item.path === "/dashboard"} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        <span className="sidebar-link-icon"> {item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            {/* Bottom */}
            <div className="sidebar-bottom">
                <button className="sidebar-link logout-link" onClick={logout}>
                    <span className="sidebar-link-icon">↪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
export default Sidebar;