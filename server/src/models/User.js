import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    fullName: { type: String, required: true, maxlength: 120 },
    phone: { type: String, required: true, maxlength: 40 },
    address: { type: String, required: true, maxlength: 250 },
    apartment: { type: String, maxlength: 120 },
    city: { type: String, required: true, maxlength: 100 },
    province: { type: String, maxlength: 100 },
    postalCode: { type: String, maxlength: 30 },
    country: { type: String, default: "Pakistan", maxlength: 100 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Bumped on password change or explicit "log out everywhere" /
    // admin force-logout. Embedded in every JWT we issue; if it doesn't
    // match the current value on the user doc, the token is rejected  -
    // this is what lets us kill a session server-side, not just rely on
    // the client to delete its own token.
    tokenVersion: { type: Number, default: 0 },

    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.tokenVersion;
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);
