const mongoose = require("mongoose");

const CourseFileSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // e.g. 'application/pdf', 'image/png'
    required: true,
  },
  file: {
    url: String,
    public_id: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CourseFile", CourseFileSchema);
