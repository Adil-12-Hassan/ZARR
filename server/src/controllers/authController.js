import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((value) => typeof value !== "string")) {
      return res.status(400).json({ message: "Username, email and password are required." });
    }
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanUsername || !cleanEmail || !password) {
      return res.status(400).json({ message: "Username, email and password are required." });
    }
    if (cleanUsername.length > 120 || cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Enter a valid name and email address." });
    }
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ message: "Password must be at least 8 characters and no more than 72 bytes." });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    // role is never read from the request body  - always "user" here.
    // Admin accounts are only ever created via scripts/createAdmin.js.
    const user = await User.create({ username: cleanUsername, email: cleanEmail, password, role: "user" });

    const token = generateToken(user, { isAdmin: false });
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user || user.role !== "user" || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user, { isAdmin: false });
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user || user.role !== "admin" || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Admin token: shorter expiry (JWT_ADMIN_EXPIRES_IN), signed with a
    // separate secret. The frontend stores this in sessionStorage so it
    // disappears the moment the admin closes the tab/browser.
    const token = generateToken(user, { isAdmin: true });
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// Bumps tokenVersion so every previously-issued token (this device or any
// other) stops working immediately. The frontend also deletes its stored
// token on logout, but this makes logout real even if a token was copied
// or a tab was left open elsewhere.
async function logout(req, res, next) {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();
    res.json({ message: "Logged out." });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json(req.user.toSafeJSON());
}

export { register, login, adminLogin, logout, me };
