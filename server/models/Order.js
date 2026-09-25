const mongoose = require("mongoose");

// A single item inside an order
// We store a snapshot (name, price) so the order record stays accurate
// even if the product is later edited or deleted.
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        name: {
            type: String,
            required: true
        },  // snapshot
        image: {
            type: String,
            default: ""
        },      // snapshot
        variant: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: true
        },   // snapshot at purchase time
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
    }, { _id: false }
);

// Shipping address — copied from checkoutPage.jsx formData fields
const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        apartment: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: "Pakistan"
        },
    }, { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        // The customer who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Human-readable order ID shown in the UI — e.g. "ZR-1042"
        orderId: {
            type: String,
            unique: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        // Pricing breakdown — matches your checkout calculations
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        shipping: {
            type: Number,
            default: 500
        },
        tax: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        couponCode: {
            type: String,
            default: ""
        },

        // Order lifecycle — matches STATUSES in ManageOrders.jsx
        status: {
            type: String,
            enum: ["Received", "Processing", "Delivered", "Cancelled"],
            default: "Received",
        },

        paymentMethod: {
            type: String,
            default: "Cash on Delivery",
        },
    },
    {
        timestamps: true, // createdAt = order date shown in admin table
    }
);

//  Auto-generate a human-readable order ID before first save
// Format: ZR-XXXX where XXXX is a random 4-digit number
// For production you'd use a counter, but this is clean for a portfolio project.
orderSchema.pre("save", async function (next) {
    if (!this.orderId) {
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderId = `ZR-${random}`;
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);