const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  removeCategory,
  getQuestions,
  sendQuestion,
  getAnswers,
  sendAnswer,
} = require("../controllers/qnaController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload")("aDApt");

// ------------------------------
// CATEGORY ROUTES
// ------------------------------
router.get("", getCategories); // Public
router.post("/add", verifyToken, isAdmin, addCategory);
router.delete("/:category/remove", verifyToken, isAdmin, removeCategory);

// ------------------------------
// QUESTIONS ROUTES
// ------------------------------
router.get("/:category/questions", getQuestions);
router.post(
  "/:category/questions",
  verifyToken,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        console.error("🔥 Multer upload error:", err);
        if (err.name === "TimeoutError") {
          return res.status(408).json({
            message:
              "Cloudinary timed out. Try again with smaller image or better network.",
          });
        }
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });
      }
      next();
    });
  },
  sendQuestion
);

// ------------------------------
// ANSWERS ROUTES
// ------------------------------
router.post(
  "/:category/answers",
  verifyToken,
  upload.single("file"),
  sendAnswer
);
router.post("/:category/answers/get", verifyToken, getAnswers);

module.exports = router;
