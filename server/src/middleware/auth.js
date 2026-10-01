const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/**
 * Verifies a JWT and attaches the user doc to req.user.
 * `isAdmin: true` verifies against the admin secret (shorter-lived tokens);
 * otherwise the regular user secret is used. Either way we also check the
 * token's tokenVersion against the current value on the user doc, so a
 * password change or forced logout kills the session server-side even if
 * the token itself hasn't expired yet.
 */
function protect({ isAdmin = false } = {}) {
  return async function protectMiddleware(req, res, next) {
    try {
      const token = getBearerToken(req);
      if (!token) {
        return res.status(401).json({ message: "Not authenticated." });
      }

      const secret = isAdmin ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Account no longer exists." });
      }
      if (decoded.tokenVersion !== user.tokenVersion) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      if (isAdmin && user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required." });
      }

      req.user = user;
      req.tokenIsAdmin = Boolean(decoded.isAdmin);
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };
}

// For routes any logged-in user (or admin) may hit — tries user secret
// first, falls back to admin secret, so /orders/my works no matter which
// token type is presented.
function protectAny() {
  return async function protectAnyMiddleware(req, res, next) {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated." });

    for (const secret of [process.env.JWT_SECRET, process.env.JWT_ADMIN_SECRET]) {
      try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);
        if (user && decoded.tokenVersion === user.tokenVersion) {
          req.user = user;
          req.tokenIsAdmin = Boolean(decoded.isAdmin);
          return next();
        }
      } catch {
        // try the next secret
      }
    }
    return res.status(401).json({ message: "Invalid or expired token." });
  };
}

// Contact form etc: attach req.user if a valid token is present, but never
// blocks the request if there isn't one (guests can message the shop too).
function optionalAuth() {
  return async function optionalAuthMiddleware(req, res, next) {
    const token = getBearerToken(req);
    if (!token) return next();

    for (const secret of [process.env.JWT_SECRET, process.env.JWT_ADMIN_SECRET]) {
      try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);
        if (user && decoded.tokenVersion === user.tokenVersion) {
          req.user = user;
          break;
        }
      } catch {
        // ignore — treat as guest
      }
    }
    next();
  };
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

module.exports = { protect, protectAny, optionalAuth, adminOnly };
