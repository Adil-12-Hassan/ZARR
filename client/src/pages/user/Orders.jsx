import React from "react";
import { useOrders } from "../../context/OrdersContext";

const money = (n) => `PKR ${Number(n).toLocaleString()}`;

function Orders() {
    const { orders, loading, error } = useOrders();

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <span>ACCOUNT</span>
                    <h2>My Orders</h2>
                    <p>Track and manage all your ZARR orders.</p>
                </div>
            </div>
            <div className="dashboard-panel">
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
                    ) : orders.length === 0 ? (
                        <div className="order-row">
                            <strong>No orders yet</strong>
                            <span> -</span>
                            <span>Your order history will appear here.</span>
                            <strong>PKR 0</strong>
                            <span className="order-status pending">New</span>
                        </div>
                    ) : orders.map((order) => (
                        <div className="order-row" key={order._id}>
                            <strong>#{(order._id || "000000").slice(-6).toUpperCase()}</strong>
                            <span>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                            <span>{order.items?.map((item) => item.name).join(", ") || "Watch order"}</span>
                            <strong>{money(order.total)}</strong>
                            <span className={`order-status ${order.status?.toLowerCase().replace(" ", "-")}`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orders;
