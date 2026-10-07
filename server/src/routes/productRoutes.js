import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", protect({ isAdmin: true }), adminOnly, createProduct);
router.put("/:id", protect({ isAdmin: true }), adminOnly, updateProduct);
router.delete("/:id", protect({ isAdmin: true }), adminOnly, deleteProduct);

export default router;
