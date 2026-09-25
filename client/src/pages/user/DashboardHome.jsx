import React from "react";
import { Link } from "react-router-dom";

const stats = [
    {
        label: "Total Orders",
        value: "08",
        icon: "▣",
    },
    {
        label: "Wishlist",
        value: "12",
        icon: "♡",
    },
    {
        label: "Pending Orders",
        value: "02",
        icon: "◷",
    },
    {
        label: "Delivered",
        value: "06",
        icon: "✓",
    },
];

const recentOrders = [
    {
        id: "#ZR-10482",
        date: "24 Aug 2026",
        items: "ZARR Heritage Automatic",
        amount: "PKR 89,500",
        status: "Delivered",
    },
    {
        id: "#ZR-10471",
        date: "18 Aug 2026",
        items: "ZARR Chrono Elegance",
        amount: "PKR 95,000",
        status: "Processing",
    },
    {
        id: "#ZR-10456",
        date: "12 Aug 2026",
        items: "ZARR Classic Moonphase",
        amount: "PKR 87,000",
        status: "Delivered",
    },
];

function DashboardHome() {
    return (
        <div className="dashboard-home">         {/* Welcome */}
            <section className="dashboard-welcome">             <div>
                    <span>WELCOME BACK</span>                 <h2>
                        Good evening, Zain.
                    </h2>                 <p>
                        Here's what's happening with your ZARR account.
                    </p>
                </div>             <Link
                    to="/collection"
                    className="dashboard-primary-button"
                >
                    Explore Collection
                    <span>→</span>
                </Link>         </section>         {/* Stats */}
            <section className="dashboard-stats">             {stats.map((stat) => (
                    <div
                        className="dashboard-stat"
                        key={stat.label}
                    >                     <div className="stat-icon">
                            {stat.icon}
                        </div>                     <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                        </div>                 </div>
                ))}         </section>         {/* Recent Orders */}
            <section className="dashboard-panel">             <div className="panel-header">                 <div>
                        <span>ORDER HISTORY</span>
                        <h2>Recent Orders</h2>
                    </div>                 <Link to="/dashboard/orders">
                        View All →
                    </Link>             </div>             <div className="orders-table">                 <div className="orders-table-head">
                        <span>ORDER</span>
                        <span>DATE</span>
                        <span>PRODUCT</span>
                        <span>AMOUNT</span>
                        <span>STATUS</span>
                    </div>                 {recentOrders.map((order) => (
                        <div
                            className="order-row"
                            key={order.id}
                        >
                            <strong>{order.id}</strong>                         <span>{order.date}</span>                         <span>{order.items}</span>                         <strong>{order.amount}</strong>                         <span
                                className={`order-status ${order.status
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                            >
                                {order.status}
                            </span>
                        </div>
                    ))}             </div>         </section>         {/* Account shortcuts */}
            <section className="dashboard-shortcuts">             <DashboardShortcut
                    icon="♡"
                    title="Your Wishlist"
                    text="View watches you've saved."
                    link="/dashboard/wishlist"
                />             <DashboardShortcut
                    icon="⌖"
                    title="Saved Addresses"
                    text="Manage your delivery addresses."
                    link="/dashboard/addresses"
                />             <DashboardShortcut
                    icon="⚙"
                    title="Account Settings"
                    text="Manage your account preferences."
                    link="/dashboard/settings"
                />         </section>     </div>
    );
}

function DashboardShortcut({
    icon,
    title,
    text,
    link,
}) {
    return (
        <Link
            to={link}
            className="dashboard-shortcut"
        >
            <div className="shortcut-icon">
                {icon}
            </div>         <div>
                <h3>{title}</h3>
                <p>{text}</p>
            </div>         <span>→</span>
        </Link>
    );
}

export default DashboardHome;