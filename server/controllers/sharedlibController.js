const CourseCode = require("../models/CourseCode");
const Course = require("../models/Course");
const CourseFile = require("../models/CourseFile");
const cloudinary = require("cloudinary").v2;

// 🔹 CATEGORY CRUD
exports.createCourseCode = async (req, res) => {
  try {
    const { category } = req.body;
    const existing = await CourseCode.findOne({ category });
    if (existing) return res.status(400).json({ message: "Category exists" });

    const newCat = new CourseCode({ category });
    await newCat.save();
    res.status(201).json(newCat);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCourseCodes = async (req, res) => {
  try {
    const codes = await CourseCode.find();
    res.json(codes);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

exports.deleteCourseCodeByName = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const deleted = await CourseCode.findOneAndDelete({
      category: new RegExp(`^${categoryName}$`, "i"),
    });
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category removed" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 COURSE CRUD
exports.createCourse = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { name } = req.body;

    const courseCode = await CourseCode.findOne({
      category: new RegExp(`^${categoryName}$`, "i"),
    });
    if (!courseCode)
      return res.status(404).json({ message: "Category not found" });

    const newCourse = new Course({ code: courseCode._id, name });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const courses = await Course.find({ code: categoryId });
    res.json(courses);
  } catch {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

exports.deleteCourseByName = async (req, res) => {
  try {
    const { categoryName, courseName } = req.params;

    const courseCode = await CourseCode.findOne({
      category: new RegExp(`^${categoryName}$`, "i"),
    });
    if (!courseCode)
      return res.status(404).json({ message: "Category not found" });

    const deleted = await Course.findOneAndDelete({
      code: courseCode._id,
      name: new RegExp(`^${courseName}$`, "i"),
    });

    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course removed" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 FILE CRUD
exports.uploadCourseFile = async (req, res) => {
  try {
    const { categoryId, courseId } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "aDApt",
    });

    const newFile = new CourseFile({
      course: courseId,
      title: title,
      fileType: req.file.mimetype, // ✅ Store file type
      file: {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      },
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    console.error("Cloudinary Error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
};

exports.getCourseFiles = async (req, res) => {
  try {
    const { courseId } = req.params;
    const files = await CourseFile.find({ course: courseId });
    res.json(files);
  } catch {
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

exports.deleteCourseFileByName = async (req, res) => {
  try {
    const { courseId, fileName } = req.params;

    const fileDoc = await CourseFile.findOne({
      course: courseId,
      title: new RegExp(`^${fileName}$`, "i"),
    });

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ Determine resource type based on stored MIME type
    const getCloudinaryType = (mimeType) => {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      return "raw"; // PDF, Word, ZIP, etc.
    };

    const resourceType = getCloudinaryType(fileDoc.fileType);

    if (fileDoc.file?.public_id) {
      await cloudinary.uploader.destroy(fileDoc.file.public_id, {
        resource_type: resourceType,
      });
    }

    await CourseFile.findByIdAndDelete(fileDoc._id);
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("❌ File deletion failed:", err);
    res.status(500).json({ message: "File deletion failed" });
  }
};
