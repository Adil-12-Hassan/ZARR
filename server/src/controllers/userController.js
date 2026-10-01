const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const MAX_SAVED_ADDRESSES = 20;
const MAX_WISHLIST_ITEMS = 100;

async function getMe(req, res) {
  res.json(req.user.toSafeJSON());
}

async function toggleWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product." });
    }
    const product = await Product.findOne({ _id: productId, isActive: true }).select("_id");
    if (!product) return res.status(404).json({ message: "Product not found." });

    const idx = req.user.wishlist.findIndex((id) => id.toString() === productId);
    if (idx >= 0) req.user.wishlist.splice(idx, 1);
    else {
      if (req.user.wishlist.length >= MAX_WISHLIST_ITEMS) {
        return res.status(400).json({ message: "Wishlist has reached its item limit." });
      }
      req.user.wishlist.push(productId);
    }
    await req.user.save();
    res.json(req.user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    if (req.user.addresses.length >= MAX_SAVED_ADDRESSES) {
      return res.status(400).json({ message: "You have reached the saved address limit." });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Address must be an object." });
    }
    req.user.addresses.push(req.body);
    await req.user.save();
    res.status(201).json(req.user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.addressId)) {
      return res.status(400).json({ message: "Invalid address." });
    }
    req.user.addresses = req.user.addresses.filter(
      (a) => a._id.toString() !== req.params.addressId
    );
    await req.user.save();
    res.json(req.user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { username, addresses } = req.body;
    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim() || username.trim().length > 120) {
        return res.status(400).json({ message: "Name must be between 1 and 120 characters." });
      }
      req.user.username = username.trim();
    }
    if (addresses !== undefined) {
      if (!Array.isArray(addresses) || addresses.length > MAX_SAVED_ADDRESSES) {
        return res.status(400).json({ message: `You can save up to ${MAX_SAVED_ADDRESSES} addresses.` });
      }
      req.user.addresses = addresses;
    }
    await req.user.save();
    res.json(req.user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }
    if (newPassword.length < 8 || Buffer.byteLength(newPassword, "utf8") > 72) {
      return res.status(400).json({ message: "New password must be at least 8 characters and no more than 72 bytes." });
    }
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }
    user.password = newPassword;
    user.tokenVersion += 1; // invalidates every existing session, this device included
    await user.save();

    res.json({ message: "Password updated. Please log in again." });
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({ role: "user" })
      .select("username email createdAt lastLoginAt")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  toggleWishlist,
  addAddress,
  deleteAddress,
  getAllUsers,
  removeUser,
};
