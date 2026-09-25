const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getAllMessages,
    markAsRead,
    deleteMessage,
} = require("../controllers/messageController");

const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// POST /api/messages    — send a contact message (public)
// GET  /api/messages    — get all messages (admin only)
router
    .route("/")
    .post(sendMessage)
    .get(protect, adminOnly, getAllMessages);

// PATCH  /api/messages/:id/read  — mark as read (admin only)
// DELETE /api/messages/:id       — delete message (admin only)
router.patch("/:id/read", protect, adminOnly, markAsRead);
router.delete("/:id", protect, adminOnly, deleteMessage);

module.exports = router;