const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  place: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Place", PlaceSchema);
