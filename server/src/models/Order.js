import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, maxlength: 160 },
    image: String,
    variant: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 50, validate: Number.isInteger },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    province: String,
    postalCode: String,
    country: { type: String, default: "Pakistan" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: String,

    // Only COD is functional today  - see paymentAPI notes.
    paymentMethod: { type: String, enum: ["Cash on Delivery"], default: "Cash on Delivery" },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    cancelReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
