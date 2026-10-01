const Message = require("../models/Message");

async function createMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if ([name, email, subject, message].some((value) => value != null && typeof value !== "string")) {
      return res.status(400).json({ message: "Message fields must be text." });
    }

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanSubject = (subject || "").trim();
    const cleanMessage = (message || "").trim();
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    if (cleanName.length > 120 || cleanEmail.length > 254 || cleanSubject.length > 160 || cleanMessage.length > 5000) {
      return res.status(400).json({ message: "One or more message fields are too long." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const doc = await Message.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      user: req.user?._id, // present if sent while logged in, else undefined
    });

    req.app.get("io")?.to("admins").emit("message:new", doc);

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json(message);
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMessage, getMessages, markRead, deleteMessage };
