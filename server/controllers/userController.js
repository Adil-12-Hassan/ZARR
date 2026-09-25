const User = require("../models/User");

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/users/me
// @access  Protected
//
// Returns the currently logged-in user's profile.
// Used by the ProfilePage and SettingsPage in the user dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
    try {
        // req.user is already attached by protect middleware — just return it
        const user = await User.findById(req.user._id).populate("wishlist");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (error) {
        console.error("Get me error:", error.message);
        return res.status(500).json({ message: "Failed to fetch profile" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/users/me
// @access  Protected
// @body    { username, phone }  — basic info update
//
// Used by the SettingsPage / ProfilePage to update name and phone.
// ─────────────────────────────────────────────────────────────────────────────
const updateMe = async (req, res) => {
    try {
        const { username, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if new username is already taken by someone else
        if (username && username !== user.username) {
            const taken = await User.findOne({ username });
            if (taken) {
                return res.status(409).json({ message: "Username is already taken" });
            }
            user.username = username;
        }

        if (phone !== undefined) user.phone = phone;

        const updated = await user.save();

        // Return the updated user without the password
        return res.status(200).json({
            _id: updated._id,
            username: updated.username,
            email: updated.email,
            role: updated.role,
            phone: updated.phone,
            addresses: updated.addresses,
            wishlist: updated.wishlist,
        });

    } catch (error) {
        console.error("Update me error:", error.message);
        return res.status(500).json({ message: "Failed to update profile" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/users/me/password
// @access  Protected
// @body    { currentPassword, newPassword }
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        // Need password for comparison — it's hidden by default
        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword; // pre-save hook will hash it
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Change password error:", error.message);
        return res.status(500).json({ message: "Failed to change password" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/users/me/wishlist/:productId
// @access  Protected
//
// Toggles a product in the user's wishlist — add if not there, remove if there.
// ─────────────────────────────────────────────────────────────────────────────
const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;

        const index = user.wishlist.indexOf(productId);

        if (index === -1) {
            user.wishlist.push(productId); // add to wishlist
        } else {
            user.wishlist.splice(index, 1); // remove from wishlist
        }

        await user.save();

        return res.status(200).json({
            wishlist: user.wishlist,
            message: index === -1 ? "Added to wishlist" : "Removed from wishlist",
        });

    } catch (error) {
        console.error("Toggle wishlist error:", error.message);
        return res.status(500).json({ message: "Failed to update wishlist" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/users/me/addresses
// @access  Protected
// @body    { label, fullName, phone, address, city, province, postalCode, country }
//
// Adds a new address to the user's saved addresses.
// ─────────────────────────────────────────────────────────────────────────────
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.push(req.body);
        await user.save();
        return res.status(201).json(user.addresses);

    } catch (error) {
        console.error("Add address error:", error.message);
        return res.status(500).json({ message: "Failed to add address" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/users/me/addresses/:addressId
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.addressId
        );
        await user.save();
        return res.status(200).json(user.addresses);

    } catch (error) {
        console.error("Delete address error:", error.message);
        return res.status(500).json({ message: "Failed to delete address" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/users
// @access  Admin only
//
// Returns all users for the admin panel.
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json(users);

    } catch (error) {
        console.error("Get all users error:", error.message);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Delete user error:", error.message);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};

module.exports = {
    getMe,
    updateMe,
    changePassword,
    toggleWishlist,
    addAddress,
    deleteAddress,
    getAllUsers,
    deleteUser,
};