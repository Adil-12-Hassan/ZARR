const Product = require("../models/Product");
const mongoose = require("mongoose");

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
    const filter = { isActive: true };
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (page) filter.displayPage = Number(page);
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter).sort({ sortOrder: -1, createdAt: -1 });
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
    const product = await Product.findOne({ isActive: true, ...selector });
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

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
