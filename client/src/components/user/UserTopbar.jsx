import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar({ onMenuClick }) {
    const { user } = useAuth();
    return (
        <header className="user-topbar">
            <div className="topbar-left">
                <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open menu">☰</button>             <div className="topbar-title">
                    <span>ACCOUNT</span>
                    <h1>Dashboard</h1>
                </div>
            </div>
            <div className="topbar-actions">
                {/* Search */}
                <button className="topbar-icon-button" title="Search">⌕</button>
                {/* Notifications */}
                <button className="topbar-icon-button notification-button"
                    title="Notifications">♧
                    <span className="notification-dot" />
                </button>
                {/* Store */}
                <Link to="/collection" className="visit-store-button">Visit Store</Link>
                {/* Profile */}
                <button className="topbar-profile">
                    <div className="topbar-avatar">ZA</div>
                    <div className="topbar-profile-info">
                        <strong>{user?.name || "ZARR Customer"}</strong>
                        <span>Customer</span>
                    </div>
                    <span className="profile-arrow">˅</span>
                </button>
            </div>
        </header>
    );
}

export default Topbar;