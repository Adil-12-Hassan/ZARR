const Product = require("../models/Product");

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products
// @access  Public
// @query   ?section=Men's Watches  (optional filter)
// @query   ?search=rolex           (optional search)
// ─────────────────────────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
    try {
        const filter = {};

        // Filter by section if provided — matches your collection page tabs
        if (req.query.section) {
            filter.section = req.query.section;
        }

        // Basic search on product name
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(products);

    } catch (error) {
        console.error("Get products error:", error.message);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);

    } catch (error) {
        console.error("Get product error:", error.message);
        return res.status(500).json({ message: "Failed to fetch product" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/products
// @access  Admin only
// @body    { name, section, price, stock, description, image, variants }
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
    try {
        const { name, section, price, stock, description, image, variants } = req.body;

        // ── Required field check ──────────────────────────────────────────────────
        if (!name || !section || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "Name, section, price and stock are required" });
        }

        const product = await Product.create({
            name,
            section,
            price,
            stock,
            description: description || "",
            image: image || "",
            variants: variants || [],
        });

        return res.status(201).json(product);

    } catch (error) {
        console.error("Create product error:", error.message);
        return res.status(500).json({ message: "Failed to create product" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/products/:id
// @access  Admin only
// @body    Any product fields to update
// ─────────────────────────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Only update fields that were actually sent
        const { name, section, price, stock, description, image, variants } = req.body;

        if (name !== undefined) product.name = name;
        if (section !== undefined) product.section = section;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (description !== undefined) product.description = description;
        if (image !== undefined) product.image = image;
        if (variants !== undefined) product.variants = variants;

        // pre-save hook will auto-update status based on new stock value
        const updated = await product.save();
        return res.status(200).json(updated);

    } catch (error) {
        console.error("Update product error:", error.message);
        return res.status(500).json({ message: "Failed to update product" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/products/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Delete product error:", error.message);
        return res.status(500).json({ message: "Failed to delete product" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};