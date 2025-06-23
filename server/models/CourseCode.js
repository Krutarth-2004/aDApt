const mongoose = require("mongoose");

const CourseCodeSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("CourseCode", CourseCodeSchema);
