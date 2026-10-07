import "dotenv/config";
import http from "node:http";
import { pathToFileURL } from "node:url";
import app from "./app.js";
import connectDB from "./config/db.js";
import initSockets from "./sockets/index.js";
const PORT = process.env.PORT || 5000;
function validateProductionConfig() {
  if (process.env.NODE_ENV !== "production") return;
  const { MONGO_URI, CLIENT_URL, JWT_SECRET, JWT_ADMIN_SECRET } = process.env;
  if (!MONGO_URI || !CLIENT_URL || !JWT_SECRET || !JWT_ADMIN_SECRET) {
    throw new Error("Production requires MONGO_URI, CLIENT_URL, JWT_SECRET, and JWT_ADMIN_SECRET.");
  }
  const placeholderSecret = /replace_with|change_this|placeholder/i;
  if (
    JWT_SECRET.length < 32
    || JWT_ADMIN_SECRET.length < 32
    || JWT_SECRET === JWT_ADMIN_SECRET
    || placeholderSecret.test(JWT_SECRET)
    || placeholderSecret.test(JWT_ADMIN_SECRET)
  ) {
    throw new Error("Production JWT secrets must be distinct and at least 32 characters long.");
  }
  const clientOrigins = CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean);
  try {
    if (!clientOrigins.length || clientOrigins.some((origin) => {
      const parsed = new URL(origin);
      return parsed.protocol !== "https:" || parsed.origin !== origin.replace(/\/$/, "");
    })) {
      throw new Error();
    }
  } catch {
    throw new Error("CLIENT_URL must contain one or more HTTPS origins, separated by commas.");
  }
}
validateProductionConfig();
async function start() {
  await connectDB();
  const server = http.createServer(app);
  const io = initSockets(server);
  app.set("io", io); // controllers reach it via req.app.get("io")
  server.listen(PORT, () => {
    console.log(`ZARR API running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((error) => {
    console.error("API startup failed:", error.message);
    process.exitCode = 1;
  });
}

export default app;
