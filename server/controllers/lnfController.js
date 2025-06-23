const Place = require("../models/Place");
const Message = require("../models/Message");
const Reply = require("../models/Reply");
const cloudinary = require("cloudinary").v2;

// 📍 Places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find().select("place");
    const formatted = places.map((p) => ({ place: p.place }));
    res.json(formatted);
  } catch {
    res.status(500).json({ message: "Failed to fetch places" });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { place } = req.body;
    const exists = await Place.findOne({ place });
    if (exists)
      return res.status(400).json({ message: "Place already exists" });
    const newPlace = await Place.create({ place });
    res.status(201).json({ place: newPlace.place });
  } catch {
    res.status(500).json({ message: "Failed to create place" });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { place } = req.params;
    const found = await Place.findOneAndDelete({ place });
    if (!found) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place removed successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete place" });
  }
};

// 📝 Messages
exports.createLostMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { place } = req.params;
    const p = await Place.findOne({ place });
    if (!p) return res.status(404).json({ message: "Place not found" });

    const msg = new Message({
      place: p._id,
      text,
      status: "lost",
      user: req.user.id,
    });

    if (req.file) {
      msg.file = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await msg.save();
    res.status(201).json(msg);
  } catch {
    res.status(500).json({ message: "Failed to send lost message" });
  }
};

exports.createFoundMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { place } = req.params;
    const p = await Place.findOne({ place });
    if (!p) return res.status(404).json({ message: "Place not found" });

    const msg = new Message({
      place: p._id,
      text,
      status: "found",
      senderId: req.user.id,
    });

    if (req.file) {
      msg.file = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await msg.save();
    res.status(201).json(msg);
  } catch {
    res.status(500).json({ message: "Failed to send found message" });
  }
};

exports.getLostMessages = async (req, res) => {
  try {
    const { place } = req.params;
    const p = await Place.findOne({ place });
    if (!p) return res.status(404).json({ message: "Place not found" });

    const lostMessages = await Message.find({
      place: p._id,
      status: "lost",
    });

    res.json(lostMessages);
  } catch {
    res.status(500).json({ message: "Failed to fetch lost messages" });
  }
};

exports.getFoundMessages = async (req, res) => {
  try {
    const { place } = req.params;
    const p = await Place.findOne({ place });
    if (!p) return res.status(404).json({ message: "Place not found" });

    const foundMessages = await Message.find({
      place: p._id,
      status: "found",
    });

    res.json(foundMessages);
  } catch {
    res.status(500).json({ message: "Failed to fetch found messages" });
  }
};

exports.deleteLostMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const msg = await Message.findById(messageId);
    if (!msg || msg.status !== "lost")
      return res.status(404).json({ message: "Lost message not found" });

    if (msg.file?.public_id) {
      await cloudinary.uploader.destroy(msg.file.public_id);
    }

    await msg.deleteOne();
    res.json({ message: "Lost message deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete lost message" });
  }
};

exports.deleteFoundMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const msg = await Message.findById(messageId);
    if (!msg || msg.status !== "found")
      return res.status(404).json({ message: "Found message not found" });

    if (msg.file?.public_id) {
      await cloudinary.uploader.destroy(msg.file.public_id);
    }

    await msg.deleteOne();
    res.json({ message: "Found message deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete found message" });
  }
};

// 💬 Replies
exports.getRepliesForMessage = async (req, res) => {
  try {
    const { msgId } = req.body;
    const replies = await Reply.find({ message: msgId });
    res.json(replies);
  } catch {
    res.status(500).json({ message: "Failed to fetch replies" });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { text, msgId } = req.body;
    const { place } = req.params;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User info missing." });
    }

    const reply = new Reply({
      message: msgId,
      text,
      senderId: req.user.id,
    });

    if (req.file) {
      reply.file = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await reply.save();

    // Emit via socket.io
    const io = req.app.get("io");
    io?.emit("newReply", { msgId, newReply: reply });

    res.status(201).json(reply);
  } catch (err) {
    console.error("❌ createReply error:", err);
    res
      .status(500)
      .json({ message: "Failed to send reply", error: err.message });
  }
};
