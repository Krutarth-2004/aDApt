const QnACategory = require("../models/QnACategory");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const cloudinary = require("cloudinary").v2;

// ----------------------
// CATEGORIES
// ----------------------
exports.getCategories = async (req, res) => {
  try {
    const categories = await QnACategory.find().distinct("name");
    res.json(categories);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const existing = await QnACategory.findOne({ name: category });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const newCat = new QnACategory({ name: category });
    await newCat.save();
    res.status(201).json({ category: newCat.name });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await QnACategory.deleteMany({ name: category });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Category removed successfully." });
  } catch (error) {
    console.error("Error removing category:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ----------------------
// QUESTIONS
// ----------------------
exports.getQuestions = async (req, res) => {
  try {
    const category = req.params.category;
    const catDoc = await QnACategory.findOne({ name: category });
    if (!catDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const questions = await Question.find({ category: catDoc._id }).populate(
      "category"
    );
    res.json(questions);
  } catch (err) {
    console.error("❌ Error in getQuestions:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const categoryName = req.params.category;
    const io = req.app.get("io");

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user info" });
    }

    const category = await QnACategory.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const question = new Question({
      category: category._id,
      text,
      user: req.user.id,
    });

    if (req.file) {
      question.file = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await question.save();

    // Real-time broadcast
    io.emit("newQuestion", {
      _id: question._id,
      category: categoryName,
      text: question.text,
      user: req.user.id,
      file: question.file || null,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("❌ Error in sendQuestion:", err); // <--- logs entire error object
    res
      .status(500)
      .json({ message: "Failed to send question", error: err.message });
  }
};

// ----------------------
// ANSWERS
// ----------------------
exports.getAnswers = async (req, res) => {
  try {
    const { questionId } = req.body;
    const answers = await Answer.find({ question: questionId });
    res.json(answers);
  } catch {
    res.status(500).json({ message: "Failed to fetch answers" });
  }
};

exports.sendAnswer = async (req, res) => {
  try {
    const { text, questionId } = req.body;
    const { category } = req.params;
    const io = req.app.get("io");

    const answer = new Answer({
      text,
      category,
      question: questionId,
      senderId: req.user.id,
    });

    if (req.file) {
      answer.file = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await answer.save();

    // Real-time broadcast to others
    io.emit("newAnswer", {
      questionId,
      newAnswer: {
        _id: answer._id,
        text: answer.text,
        file: answer.file || null,
        senderId: req.user.id,
      },
    });

    res.status(201).json(answer);
  } catch (err) {
    console.error("❌ Error in sendAnswer:", err.message);
    res.status(500).json({ message: "Failed to send answer" });
  }
};
