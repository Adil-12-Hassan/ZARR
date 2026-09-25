import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/user/UserSidebar";
import Topbar from "../../components/user/UserTopbar";
import "../../styles/pages/userDashboard.css";
function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="user-dashboard">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar onClose={() => setSidebarOpen(false)} />
            <div className="dashboard-content">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="dashboard-main"><Outlet /></main>
            </div>
        </div>
    );
}
export default UserDashboard;