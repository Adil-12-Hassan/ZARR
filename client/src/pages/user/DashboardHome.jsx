import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";

function DashboardHome() {
    const { user } = useAuth();
    const { orders, loading, error } = useOrders();
    const authUser = user?.user ?? user ?? {};
    const recentOrders = orders.slice(0, 3).map((order) => ({
        id: `#${order._id?.slice(-6).toUpperCase() || "NEW"}`,
        date: new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        items: order.items?.map((item) => item.name).join(", ") || "Watch order",
        amount: `PKR ${Number(order.total || 0).toLocaleString()}`,
        status: order.status,
    }));

    const stats = [
        { label: "Total Orders", value: String(orders.length || 0), icon: "▣" },
        { label: "Pending Orders", value: String(orders.filter((o) => ["Pending", "Confirmed", "Processing", "Shipped"].includes(o.status)).length), icon: "◷" },
        { label: "Delivered", value: String(orders.filter((o) => o.status === "Delivered").length || 0), icon: "✓" },
    ];

    return (
        <div className="dashboard-home">
            <section className="dashboard-welcome">
                <div>
                    <span>WELCOME BACK</span>
                    <h2>Good evening, {authUser.username || authUser.name || "Customer"}.</h2>
                    <p>Here's what's happening with your ZARR account.</p>
                </div>
                <Link to="/collection" className="dashboard-primary-button">
                    Explore Collection
                    <span>→</span>
                </Link>
            </section>

            <section className="dashboard-stats">
                {stats.map((stat) => (
                    <div className="dashboard-stat" key={stat.label}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                        </div>
                    </div>
                ))}
            </section>

            <section className="dashboard-panel">
                <div className="panel-header">
                    <div>
                        <span>ORDER HISTORY</span>
                        <h2>Recent Orders</h2>
                    </div>
                    <Link to="/dashboard/orders">View All →</Link>
                </div>

                <div className="orders-table">
                    <div className="orders-table-head">
                        <span>ORDER</span>
                        <span>DATE</span>
                        <span>PRODUCT</span>
                        <span>AMOUNT</span>
                        <span>STATUS</span>
                    </div>

                    {loading ? (
                        <div className="order-row"><strong>Loading orders</strong><span> -</span><span>Fetching your order history.</span><strong> -</strong><span> -</span></div>
                    ) : error ? (
                        <div className="order-row" role="alert"><strong>Orders unavailable</strong><span> -</span><span>{error}</span><strong> -</strong><span> -</span></div>
                    ) : recentOrders.length === 0 ? (
                        <div className="order-row">
                            <strong>No orders yet</strong>
                            <span> -</span>
                            <span>Your recent orders will appear here.</span>
                            <strong>PKR 0</strong>
                            <span className="order-status pending">New</span>
                        </div>
                    ) : recentOrders.map((order) => (
                        <div className="order-row" key={order.id}>
                            <strong>{order.id}</strong>
                            <span>{order.date}</span>
                            <span>{order.items}</span>
                            <strong>{order.amount}</strong>
                            <span className={`order-status ${order.status.toLowerCase().replace(" ", "-")}`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="dashboard-shortcuts">
                <DashboardShortcut icon="♡" title="Your Wishlist" text="View watches you've saved." link="/dashboard/wishlist" />
                <DashboardShortcut icon="⌖" title="Saved Addresses" text="Manage your delivery addresses." link="/dashboard/addresses" />
                <DashboardShortcut icon="⚙" title="Account Settings" text="Manage your account preferences." link="/dashboard/settings" />
            </section>
        </div>
    );
}

function DashboardShortcut({ icon, title, text, link }) {
    return (
        <Link to={link} className="dashboard-shortcut">
            <div className="shortcut-icon">{icon}</div>
            <div>
                <h3>{title}</h3>
                <p>{text}</p>
            </div>
            <span>→</span>
        </Link>
    );
}

export default DashboardHome;