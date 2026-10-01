const express = require("express");
const { register, login, adminLogin, logout, me } = require("../controllers/authController");
const { protect, protectAny } = require("../middleware/auth");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/admin/login", loginLimiter, adminLogin);

router.post("/logout", protectAny(), logout);
router.get("/me", protectAny(), me);

module.exports = router;
