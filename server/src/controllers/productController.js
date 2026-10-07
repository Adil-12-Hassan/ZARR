import Product from "../models/Product.js";
import mongoose from "mongoose";

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function notifyProductChange(req, product) {
  req.app.get("io")?.emit("products:updated", {
    type: "change",
    product,
    at: new Date().toISOString(),
  });
}

async function getProducts(req, res, next) {
  try {
    const { search, gender, category, min, max, page } = req.query;
    if (page !== undefined && (!/^\d+$/.test(String(page)) || Number(page) < 1 || Number(page) > 5)) {
      return res.status(400).json({ message: "Page must be a number between 1 and 5." });
    }
    if (gender !== undefined && !["Men", "Women", "Unisex"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender filter." });
    }
    if (search !== undefined && (typeof search !== "string" || search.trim().length > 120)) {
      return res.status(400).json({ message: "Search must be 120 characters or fewer." });
    }
    const minPrice = min === undefined ? undefined : Number(min);
    const maxPrice = max === undefined ? undefined : Number(max);
    if ((minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0))
      || (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))) {
      return res.status(400).json({ message: "Price filters must be valid non-negative amounts." });
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      return res.status(400).json({ message: "Minimum price cannot exceed maximum price." });
    }

    const filter = { isActive: true };
    if (gender) filter.gender = gender;
    if (typeof category === "string" && category.trim()) filter.category = category.trim().slice(0, 80);
    if (page) filter.displayPage = Number(page);
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (search?.trim()) filter.$text = { $search: search.trim() };

    const products = await Product.find(filter)
      .sort({ sortOrder: -1, createdAt: -1 })
      .lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const selector = mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
      : { slug: req.params.id };
    const product = await Product.findOne({ isActive: true, ...selector }).lean();
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const body = { ...req.body };
    if (!body.slug) body.slug = slugify(body.name);
    if (!body.displayPage) body.displayPage = 1;
    const product = await Product.create(body);
    notifyProductChange(req, product);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found." });
    notifyProductChange(req, product);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    notifyProductChange(req, product);
    res.json({ message: "Product deleted." });
  } catch (err) {
    next(err);
  }
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
