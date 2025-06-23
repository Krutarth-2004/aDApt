const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sharedlibController");
const upload = require("../middleware/upload")("aDApt");

// Category (CourseCode)
router.get("/", ctrl.getAllCourseCodes);
router.post("/add", ctrl.createCourseCode);
router.post("/:categoryName/remove", ctrl.deleteCourseCodeByName);

// Course
router.get("/:categoryId/courses", ctrl.getCoursesByCategory);
router.post("/:categoryName/courses/add", ctrl.createCourse);
router.post(
  "/:categoryName/courses/:courseName/remove",
  ctrl.deleteCourseByName
);

// Files
router.get("/:categoryId/courses/:courseId/files", ctrl.getCourseFiles);
router.post(
  "/:categoryId/courses/:courseId/files/add",
  upload.single("file"),
  ctrl.uploadCourseFile
);
router.post(
  "/:categoryId/courses/:courseId/files/:fileName/remove",
  ctrl.deleteCourseFileByName
);

module.exports = router;
