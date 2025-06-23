const mongoose = require("mongoose");

const EmailCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("EmailCategory", EmailCategorySchema);
