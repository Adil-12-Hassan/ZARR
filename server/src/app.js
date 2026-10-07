import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
const app = express();
app.use(helmet());
const clientOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
if (process.env.NODE_ENV !== "production") {
  for (const origin of ["http://localhost:3000", "http://127.0.0.1:3000"]) {
    if (!clientOrigins.includes(origin)) clientOrigins.push(origin);
  }
}
app.set("trust proxy", process.env.VERCEL === "1" ? 1 : false);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || clientOrigins.includes(origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize()); // strips $ / . operators from req.body,params,query
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.get("/api/health", (req, res) => {
  res.set("Cache-Control", "no-store").json({ status: "ok" });
});

// Vercel runs the exported Express app without the local startup script.
// Connect lazily for API routes so the health endpoint stays a fast liveness check.
if (process.env.VERCEL === "1") {
  app.use("/api", (req, res, next) => {
    connectDB().then(() => next()).catch(next);
  });
}
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
