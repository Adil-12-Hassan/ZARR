import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Every connecting client sends its JWT in the handshake (auth.token).
 * Admins get dropped into the "admins" room, so orderController /
 * messageController can broadcast new orders and messages there for the
 * "live" admin dashboard. Regular users join "user:<their id>" so they can
 * get pushed updates about their own orders (e.g. status changes) without
 * polling.
 */
function initSockets(httpServer) {
  const clientOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const io = new Server(httpServer, {
    cors: { origin: clientOrigins, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(); // allow anonymous connections, just no rooms

      for (const secret of [process.env.JWT_SECRET, process.env.JWT_ADMIN_SECRET]) {
        try {
          const decoded = jwt.verify(token, secret);
          const user = await User.findById(decoded.id);
          if (user && decoded.tokenVersion === user.tokenVersion) {
            socket.user = user;
            break;
          }
        } catch {
          // try next secret
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.role === "admin") {
      socket.join("admins");
    } else if (socket.user) {
      socket.join(`user:${socket.user._id}`);
    }
  });

  return io;
}

export default initSockets;
