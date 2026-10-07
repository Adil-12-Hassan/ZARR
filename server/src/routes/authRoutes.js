import express from "express";
import { register, login, adminLogin, logout, me } from "../controllers/authController.js";
import { protectAny } from "../middleware/auth.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/admin/login", loginLimiter, adminLogin);

router.post("/logout", protectAny(), logout);
router.get("/me", protectAny(), me);

export default router;
