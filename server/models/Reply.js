const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  text: {
    type: String,
  },
  file: {
    url: { type: String },
    public_id: { type: String },
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reply", ReplySchema);
