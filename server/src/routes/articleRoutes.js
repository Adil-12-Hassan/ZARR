import express from "express";
import {
  getPublishedArticles,
  getPublishedArticle,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const requireAdmin = [protect({ isAdmin: true }), adminOnly];

router.get("/", getPublishedArticles);
router.get("/admin", ...requireAdmin, getAdminArticles);
router.post("/", ...requireAdmin, createArticle);
router.get("/:slug", getPublishedArticle);
router.put("/:id", ...requireAdmin, updateArticle);
router.delete("/:id", ...requireAdmin, deleteArticle);

export default router;
