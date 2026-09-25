const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    // JWT is sent in the Authorization header as: "Bearer eyJhbGci..."
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // No token found — reject immediately
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        // Verify the token using our secret key
        // If the token is expired or tampered, this throws an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the full user object to the request (minus the password)
        // Now any controller that runs after this has access to req.user
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        next(); // Token is valid — move on to the actual route handler
    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };