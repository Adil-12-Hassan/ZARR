const Order = require("../models/Order");
const Product = require("../models/Product");

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/orders
// @access  Protected (logged-in users)
// @body    { items, shippingAddress, subtotal, discount, shipping, tax, total,
//            couponCode, paymentMethod }
//
// Called from your checkoutPage.jsx when the user confirms the order.
// ─────────────────────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            subtotal,
            discount,
            shipping,
            tax,
            total,
            couponCode,
            paymentMethod,
        } = req.body;

        // ── Validate ──────────────────────────────────────────────────────────────
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        // ── Create the order ──────────────────────────────────────────────────────
        // req.user._id comes from the protect middleware
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            subtotal: subtotal || 0,
            discount: discount || 0,
            shipping: shipping || 500,
            tax: tax || 0,
            total,
            couponCode: couponCode || "",
            paymentMethod: paymentMethod || "Cash on Delivery",
        });

        return res.status(201).json(order);

    } catch (error) {
        console.error("Place order error:", error.message);
        return res.status(500).json({ message: "Failed to place order" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/orders/my
// @access  Protected (logged-in users)
//
// Returns the current user's own orders — for the Orders page in user dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(orders);

    } catch (error) {
        console.error("Get my orders error:", error.message);
        return res.status(500).json({ message: "Failed to fetch your orders" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/orders
// @access  Admin only
//
// Returns ALL orders for the admin ManageOrders.jsx page.
// Includes the user's name and email via populate.
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email") // join user info
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {
        console.error("Get all orders error:", error.message);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PATCH /api/orders/:id/status
// @access  Admin only
// @body    { status }  — "Received" | "Processing" | "Delivered" | "Cancelled"
//
// Called when admin changes the status dropdown in ManageOrders.jsx.
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowed = ["Received", "Processing", "Delivered", "Cancelled"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        const updated = await order.save();

        return res.status(200).json(updated);

    } catch (error) {
        console.error("Update order status error:", error.message);
        return res.status(500).json({ message: "Failed to update order status" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/orders/:id
// @access  Protected
//
// Get a single order — user can only see their own, admin can see any.
// ─────────────────────────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "username email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Non-admin users can only view their own orders
        const isOwner = order.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.error("Get order error:", error.message);
        return res.status(500).json({ message: "Failed to fetch order" });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
}; 