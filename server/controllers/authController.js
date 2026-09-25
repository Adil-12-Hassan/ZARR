const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Helper: shape the user object we send back to the frontend.
// Never send the password, even hashed.
const userPayload = (user, token) => ({
    token,
    user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
    },
});

// @route   POST /api/auth/register
// @access  Public
// @body    { username, email, password }
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ── Basic validation 
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check duplicates 
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(409).json({ message: "This username is already taken" });
        }

        // Create user 
        // Password is hashed automatically by the pre-save hook in User.js
        const user = await User.create({ username, email, password });

        // Respond with token + user info
        const token = generateToken(user._id);
        return res.status(201).json(userPayload(user, token));

    } catch (error) {
        console.error("Register error:", error.message);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

// @route   POST /api/auth/login
// @access  Public
// @body    { email, password }
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ── Basic validation ──────────────────────────────────────────────────────
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // ── Find user — must explicitly select password (it's hidden by default) ──
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            // Deliberately vague — don't tell attackers which field was wrong
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ── Check password using the matchPassword method on the User model ────────
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ── Respond with token + user info ────────────────────────────────────────
        const token = generateToken(user._id);
        return res.status(200).json(userPayload(user, token));

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/admin/login
// @access  Public (but only succeeds for admin-role accounts)
// @body    { email, password }
//
// Exactly like login — but if the account exists and password is correct,
// we do one extra check: role must be "admin".
// This powers your AdminLogin.jsx page.
// ─────────────────────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ── Extra admin check ──────────────────────────────────────────────────────
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Not an admin account." });
        }

        const token = generateToken(user._id);
        return res.status(200).json(userPayload(user, token));

    } catch (error) {
        console.error("Admin login error:", error.message);
        return res.status(500).json({ message: "Server error during admin login" });
    }
};

module.exports = { register, login, adminLogin };