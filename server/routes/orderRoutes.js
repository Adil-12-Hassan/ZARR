const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
} = require("../controllers/orderController");

const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// POST /api/orders          — place a new order (any logged-in user)
// GET  /api/orders          — get ALL orders (admin only)
router
    .route("/")
    .post(protect, placeOrder)
    .get(protect, adminOnly, getAllOrders);

// GET /api/orders/my        — get current user's own orders
// ⚠️  Must come BEFORE /:id so "my" isn't treated as an id param
router.get("/my", protect, getMyOrders);

// GET   /api/orders/:id              — single order (owner or admin)
// PATCH /api/orders/:id/status       — update status (admin only)
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;