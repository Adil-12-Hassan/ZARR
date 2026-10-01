/**
 * One-time setup. Run with:  node src/scripts/createAdmin.js
 * Reads ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD from .env.
 * Public /api/auth/register can never create an admin — this script is
 * the only way an admin account gets made.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function run() {
  await connectDB();

  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD in .env first.");
    process.exit(1);
  }
  const minimumPasswordLength = process.env.NODE_ENV === "production" ? 12 : 8;
  if (
    password === "change_this_before_running"
    || password.length < minimumPasswordLength
    || Buffer.byteLength(password, "utf8") > 72
  ) {
    console.error(`Admin bootstrap password must be at least ${minimumPasswordLength} characters and no more than 72 bytes.`);
    process.exit(1);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    await User.create({ username: "Admin", email, password, role: "admin" });
    console.log(`Admin account created for ${email}.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run();
