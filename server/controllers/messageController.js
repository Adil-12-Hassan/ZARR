const Message = require("../models/Message");

// @route   POST /api/messages
// @access  Public (anyone can send a contact message)
// @body    { name, email, phone, subject, message }
//
// Called from contactPage.jsx when the form is submitted.
const sendMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required" });
        }

        const newMessage = await Message.create({
            name,
            email,
            phone: phone || "",
            subject: subject || "General Inquiry",
            message,
        });

        return res.status(201).json({
            message: "Your message has been sent. We'll get back to you soon!",
            data: newMessage,
        });

    } catch (error) {
        console.error("Send message error:", error.message);
        return res.status(500).json({ message: "Failed to send message" });
    }
};

// @route   GET /api/messages
// @access  Admin only
//
// Returns all messages for the admin messages panel.
// Newest messages first.
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        return res.status(200).json(messages);

    } catch (error) {
        console.error("Get messages error:", error.message);
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// @route   PATCH /api/messages/:id/read
// @access  Admin only
//
// Marks a message as read when admin opens it.
const markAsRead = async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!msg) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json(msg);

    } catch (error) {
        console.error("Mark read error:", error.message);
        return res.status(500).json({ message: "Failed to mark message as read" });
    }
};

// @route   DELETE /api/messages/:id
// @access  Admin only
const deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);

        if (!msg) {
            return res.status(404).json({ message: "Message not found" });
        }

        await msg.deleteOne();
        return res.status(200).json({ message: "Message deleted" });

    } catch (error) {
        console.error("Delete message error:", error.message);
        return res.status(500).json({ message: "Failed to delete message" });
    }
};

module.exports = { sendMessage, getAllMessages, markAsRead, deleteMessage };