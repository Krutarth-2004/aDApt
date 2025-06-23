const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: String,
  file: {
    url: String,
    public_id: String,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Answer", answerSchema);
