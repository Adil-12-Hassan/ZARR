const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, protectAny, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET / (admin: list everyone's orders) and POST / (customer: place an
// order) are different HTTP methods on the same path, so they don't
// collide — matches orderAPI.getAll()/place() in the frontend as-is.
router.get("/", protect({ isAdmin: true }), adminOnly, getAllOrders);
router.post("/", protect(), createOrder);
router.get("/my", protect(), getMyOrders);
router.get("/:id", protectAny(), getOrder);
router.patch("/:id/cancel", protect(), cancelOrder);
router.patch("/:id/status", protect({ isAdmin: true }), adminOnly, updateOrderStatus);

module.exports = router;
