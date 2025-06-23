const mongoose = require("mongoose");

const QnACategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("QnACategory", QnACategorySchema);
