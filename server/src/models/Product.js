const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    images: [String],
    gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },
    category: { type: String, default: "" },
    movement: { type: String, default: "" },
    material: { type: String, default: "" },
    color: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
    displayPage: { type: Number, min: 1, max: 5, default: 1 },
    sortOrder: { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Plain SEO fields the frontend can drop straight into <head>/meta tags
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", keywords: "text" });

module.exports = mongoose.model("Product", productSchema);
