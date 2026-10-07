import express from "express";
import { createMessage, getMessages, markRead, deleteMessage } from "../controllers/messageController.js";
import { optionalAuth, protect, adminOnly } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/", contactLimiter, optionalAuth(), createMessage);

router.get("/", protect({ isAdmin: true }), adminOnly, getMessages);
router.patch("/:id/read", protect({ isAdmin: true }), adminOnly, markRead);
router.delete("/:id", protect({ isAdmin: true }), adminOnly, deleteMessage);

export default router;
