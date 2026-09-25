import React from "react";
import { useOrders } from "../../context/OrdersContext";

const money = (n) => `PKR ${Number(n).toLocaleString()}`;

function Orders() {
    const { orders } = useOrders(); return (
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
                    </div>                 {orders.map((order) => (
                        <div className="order-row" key={order.id}>
                            <strong>{order.id}</strong>
                            <span>{order.date}</span>
                            <span>{order.items}</span>
                            <strong>{money(order.total)}</strong>
                            <span className={`order-status ${order.status.toLowerCase().replace(" ", "-")}`}>
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
