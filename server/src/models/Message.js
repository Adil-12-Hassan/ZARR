const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 254 },
    subject: { type: String, maxlength: 160 },
    message: { type: String, required: true, maxlength: 5000 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // set if sender was logged in
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
