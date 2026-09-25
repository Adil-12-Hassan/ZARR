const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// GET  /api/products        — public (store page + admin list)
// POST /api/products        — admin only
router
    .route("/")
    .get(getProducts)
    .post(protect, adminOnly, createProduct);

// GET    /api/products/:id  — public
// PUT    /api/products/:id  — admin only
// DELETE /api/products/:id  — admin only
router
    .route("/:id")
    .get(getProductById)
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

module.exports = router;