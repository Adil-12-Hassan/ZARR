const jwt = require("jsonwebtoken");

/**
 * Users and admins get tokens signed with different secrets and different
 * lifetimes:
 *  - user token: long-lived (default 7d), meant to persist in localStorage
 *    like a normal "stay logged in" e-commerce session.
 *  - admin token: short-lived (default 2h) as a hard ceiling — even if an
 *    admin never logs out, the token stops working on its own. The
 *    frontend pairs this with sessionStorage (cleared when the browser/tab
 *    closes) to mimic classic PHP session-cookie behaviour.
 *
 * Both embed the user's current tokenVersion so a password change or an
 * explicit "log out everywhere" immediately invalidates every token already
 * issued, not just the one the client happens to delete.
 */
function generateToken(user, { isAdmin = false } = {}) {
  const secret = isAdmin ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
  const expiresIn = isAdmin
    ? process.env.JWT_ADMIN_EXPIRES_IN || "2h"
    : process.env.JWT_USER_EXPIRES_IN || "7d";

  return jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion, isAdmin },
    secret,
    { expiresIn }
  );
}

module.exports = generateToken;
