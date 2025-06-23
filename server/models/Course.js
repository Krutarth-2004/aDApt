const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseCode", // ✅ Links to CourseCode category
    required: true,
  },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Course", CourseSchema);
