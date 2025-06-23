const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmailCategory",
    required: true,
  },
  name: { type: String, required: true },
  mail: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", EmailSchema);
