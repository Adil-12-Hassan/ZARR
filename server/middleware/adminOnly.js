const adminOnly = (req, res, next) => {
    // protect middleware must run before this — req.user is guaranteed to exist
    if (req.user && req.user.role === "admin") {
        next(); // User is admin — allow through
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

module.exports = { adminOnly };