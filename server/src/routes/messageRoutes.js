const express = require("express");
const { createMessage, getMessages, markRead, deleteMessage } = require("../controllers/messageController");
const { optionalAuth, protect, adminOnly } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/", contactLimiter, optionalAuth(), createMessage);

router.get("/", protect({ isAdmin: true }), adminOnly, getMessages);
router.patch("/:id/read", protect({ isAdmin: true }), adminOnly, markRead);
router.delete("/:id", protect({ isAdmin: true }), adminOnly, deleteMessage);

module.exports = router;
