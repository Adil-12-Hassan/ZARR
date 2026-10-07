import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const SHIPPING_FEE = 500;
const TAX_RATE = 0.135;
const MAX_ORDER_LINES = 30;
const MAX_ITEM_QUANTITY = 50;
const ORDER_TRANSITIONS = {
  Pending: ["Confirmed", "Processing", "Shipped", "Delivered"],
  Confirmed: ["Pending", "Processing", "Shipped", "Delivered"],
  Processing: ["Pending", "Confirmed", "Shipped", "Delivered"],
  Shipped: ["Pending", "Confirmed", "Processing", "Delivered"],
  Delivered: ["Pending", "Confirmed", "Processing", "Shipped"],
  Cancelled: [],
};

function requestError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function restoreOrderStock(order) {
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } },
    );
  }
}

// paymentMethod is intentionally never trusted from the client  - COD is
// the only thing that works right now, so we force it here regardless of
// what the checkout form sends. Remove this override once a real gateway
// is wired up.
async function createOrder(req, res, next) {
  const body = req.body || {};
  const { items, shippingAddress, couponCode } = body;

  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ORDER_LINES) {
    return res.status(400).json({ message: `Order must contain between 1 and ${MAX_ORDER_LINES} items.` });
  }

  if (!shippingAddress || typeof shippingAddress !== "object" || Array.isArray(shippingAddress)) {
    return res.status(400).json({ message: "A valid shipping address is required." });
  }

  const addressFields = ["fullName", "phone", "address", "city"];
  const maxAddressLengths = { fullName: 120, phone: 40, address: 250, apartment: 120, city: 100, province: 100, postalCode: 30, country: 100 };
  const safeAddress = {};
  for (const [field, maxLength] of Object.entries(maxAddressLengths)) {
    const value = shippingAddress[field] == null ? "" : String(shippingAddress[field]).trim();
    if (addressFields.includes(field) && !value) {
      return res.status(400).json({ message: `${field} is required.` });
    }
    if (value.length > maxLength) {
      return res.status(400).json({ message: `${field} is too long.` });
    }
    if (value) safeAddress[field] = value;
  }
  safeAddress.email = req.user.email;
  safeAddress.country ||= "Pakistan";

  const normalizedCoupon = String(couponCode || "").trim().toUpperCase();
  if (normalizedCoupon && normalizedCoupon !== "ZARR10") {
    return res.status(400).json({ message: "Invalid coupon code." });
  }

  const requestedQuantities = new Map();
  for (const item of items) {
    const productId = String(item?.product || item?._id || item?.id || "");
    const quantity = Number(item?.quantity);
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Order contains an invalid product." });
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      return res.status(400).json({ message: `Each quantity must be between 1 and ${MAX_ITEM_QUANTITY}.` });
    }
    const combinedQuantity = (requestedQuantities.get(productId) || 0) + quantity;
    if (combinedQuantity > MAX_ITEM_QUANTITY) {
      return res.status(400).json({ message: `Each quantity must be between 1 and ${MAX_ITEM_QUANTITY}.` });
    }
    requestedQuantities.set(productId, combinedQuantity);
  }

  let products;
  try {
    products = await Product.find({
      _id: { $in: [...requestedQuantities.keys()] },
      isActive: true,
    });
  } catch (err) {
    return next(err);
  }
  if (products.length !== requestedQuantities.size) {
    return res.status(409).json({ message: "One or more products are no longer available." });
  }

  const orderItems = products.map((product) => {
    const quantity = requestedQuantities.get(String(product._id));
    return {
      product: product._id,
      name: product.name,
      image: product.image || product.images?.[0] || "",
      price: product.price,
      quantity,
    };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = normalizedCoupon === "ZARR10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = SHIPPING_FEE;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal - discount + shipping + tax;

  const reservations = [];
  let order;
  try {
    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );
      if (result.modifiedCount !== 1) {
        throw requestError(409, `Not enough stock for ${item.name}.`);
      }
      reservations.push({ productId: item.product, quantity: item.quantity });
    }

    [order] = await Order.create([{
      user: req.user._id,
      items: orderItems,
      shippingAddress: safeAddress,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: normalizedCoupon,
      paymentMethod: "Cash on Delivery",
    }]);
  } catch (err) {
    for (const reservation of reservations) {
      try {
        await Product.updateOne(
          { _id: reservation.productId },
          { $inc: { stock: reservation.quantity } },
        );
      } catch (rollbackError) {
        console.error("Order stock rollback failed:", rollbackError.message);
      }
    }
    return next(err);
  }

  req.app.get("io")?.to("admins").emit("order:new", order);
  req.app.get("io")?.emit("products:updated", { type: "stock", at: new Date().toISOString() });
  return res.status(201).json(order);
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order." });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// User can only cancel their own order, and only while it's still early
// in the pipeline  - once it's Shipped/Delivered, cancellation has to go
// through the admin (they've already handed it off).
async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order." });
    }
    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res.status(400).json({ message: `Order can no longer be cancelled (status: ${order.status}).` });
    }

    const reason = req.body?.reason;
    if (reason != null && (typeof reason !== "string" || reason.length > 500)) {
      return res.status(400).json({ message: "Cancellation reason must be 500 characters or fewer." });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, user: req.user._id, status: order.status },
      { status: "Cancelled", cancelReason: (reason || "Cancelled by customer").trim() },
      { new: true, runValidators: true },
    );
    if (!updatedOrder) return res.status(409).json({ message: "Order status changed. Refresh and try again." });

    await restoreOrderStock(updatedOrder);

    req.app.get("io")?.to("admins").emit("order:updated", updatedOrder);
    req.app.get("io")?.to(`user:${updatedOrder.user}`).emit("order:updated", updatedOrder);

    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate("user", "username email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!Object.hasOwn(ORDER_TRANSITIONS, status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const existing = await Order.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Order not found." });
    if (!ORDER_TRANSITIONS[existing.status]?.includes(status)) {
      return res.status(409).json({ message: `Order cannot move from ${existing.status} to ${status}.` });
    }

    const order = await Order.findOneAndUpdate(
      { _id: existing._id, status: existing.status },
      { status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (status === "Cancelled") await restoreOrderStock(order);

    req.app.get("io")?.to("admins").emit("order:updated", order);
    req.app.get("io")?.to(`user:${order.user}`).emit("order:updated", order);

    res.json(order);
  } catch (err) {
    next(err);
  }
}

export {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
