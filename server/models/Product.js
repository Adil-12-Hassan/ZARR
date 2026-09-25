const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        // Matches MENU_SECTIONS in your ManageProduct.jsx
        section: {
            type: String,
            required: [true, "Section is required"],
            enum: ["Men's Watches", "Women's Watches", "Limited Edition", "Accessories"],
        },
        price: {
            type: Number,
            requires: [true, "Price is required"],
            min: [0, "Price cannot be negtive"],
        },
        stock: {
            type: Number,
            requires: [true, "Stock is required"],
            min: [0, "Stock cannot be negtive"],
            default: 0,
        },
        status: {
            type: String,
            enum: ["Active", "Out of Stock"],
            default: "Active",
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        // Variant options shown on product cards, e.g. "Gold / Green"
        variants: [
            {
                type: String,
                trim: true,
            },
        ],
    }, { timestamp: true, }
);
/* Auto set status based on stock before every save. Mirrors the logic already in ManageProducts.jsx frontend.*/
productSchema.pre("save", function (next) {
    this.status = this.stock > 0 ? "Active" : "Out of Stock";
    next();
});
// Also update status on findOneAndUpdate calls
productSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.stock !== undefined) {
        update.stock = update.stock > 0 ? "Active" : "Out of Stock";
    }
    next();
})

module.exports = mongoose.model("Product", productSchema);