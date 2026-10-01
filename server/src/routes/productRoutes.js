const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", protect({ isAdmin: true }), adminOnly, createProduct);
router.put("/:id", protect({ isAdmin: true }), adminOnly, updateProduct);
router.delete("/:id", protect({ isAdmin: true }), adminOnly, deleteProduct);

module.exports = router;
