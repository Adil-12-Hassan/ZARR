const express = require("express");
const router = express.Router();

const {
    getMe,
    updateMe,
    changePassword,
    toggleWishlist,
    addAddress,
    deleteAddress,
    getAllUsers,
    deleteUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// GET /api/users/me    — get own profile
// PUT /api/users/me    — update own profile (username, phone)
router
    .route("/me")
    .get(protect, getMe)
    .put(protect, updateMe);

// PUT /api/users/me/password  — change password
router.put("/me/password", protect, changePassword);

// POST   /api/users/me/wishlist/:productId  — toggle wishlist item
router.post("/me/wishlist/:productId", protect, toggleWishlist);

// POST   /api/users/me/addresses            — add a new address
// DELETE /api/users/me/addresses/:addressId — delete an address
router.post("/me/addresses", protect, addAddress);
router.delete("/me/addresses/:addressId", protect, deleteAddress);

// GET    /api/users        — all users (admin only)
// DELETE /api/users/:id   — delete a user (admin only)
router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;