const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QnACategory",
    required: true,
  },
  text: { type: String, required: true },
  file: { url: String, public_id: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);
