require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSockets = require("./sockets");

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
  let frontendUrl;
  try {
    frontendUrl = new URL(CLIENT_URL);
  } catch {
    throw new Error("CLIENT_URL must be a valid HTTPS origin in production.");
  }
  if (frontendUrl.protocol !== "https:" || frontendUrl.origin !== CLIENT_URL.replace(/\/$/, "")) {
    throw new Error("CLIENT_URL must be a valid HTTPS origin in production.");
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
start();
