const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        // Sender info — from the contact form
        name: { type: String, required: [true, "Name is required"], trim: true },
        email: { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
        phone: { type: String, default: "" },
        subject: { type: String, default: "General Inquiry", trim: true },
        message: { type: String, required: [true, "Message is required"], trim: true },

        // Admin management
        isRead: {
            type: Boolean,
            default: false, // new messages come in as unread
        },
        // Optional: admin reply stored alongside the original message
        reply: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true, // createdAt = when message was sent
    }
);

module.exports = mongoose.model("Message", messageSchema);