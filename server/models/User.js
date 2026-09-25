const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
    {
        label: { type: String, default: "Home" }, // e.g. "Home", "Office"
        fullName: { type: String },
        phone: { type: String },
        address: { type: String },
        apartment: { type: String },
        city: { type: String },
        province: { type: String },
        postalCode: { type: String },
        country: { type: String, default: "Pakistan" },
        isDefault: { type: Boolean, default: false },
    },
    { _id: true }
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // never returned in queries by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        phone: {
            type: String,
            default: "",
        },
        addresses: [addressSchema],

        // Array of product _ids the user has wishlisted
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// ── Hash password before saving ───────────────────────────────────────────────
// This hook runs before every .save() call.
// It only re-hashes if the password field was actually changed.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ── Instance method: compare a plain-text password with the stored hash ───────
// Used in the login controller: user.matchPassword("myPassword")
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);