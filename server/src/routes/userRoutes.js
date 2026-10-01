const express = require("express");
const {
  getMe,
  updateMe,
  changePassword,
  toggleWishlist,
  addAddress,
  deleteAddress,
  getAllUsers,
  removeUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");
const { passwordChangeLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.get("/me", protect(), getMe);
router.put("/me", protect(), updateMe);
router.put("/me/password", passwordChangeLimiter, protect(), changePassword);
router.post("/me/wishlist/:productId", protect(), toggleWishlist);
router.post("/me/addresses", protect(), addAddress);
router.delete("/me/addresses/:addressId", protect(), deleteAddress);

router.get("/", protect({ isAdmin: true }), adminOnly, getAllUsers);
router.delete("/:id", protect({ isAdmin: true }), adminOnly, removeUser);

module.exports = router;
