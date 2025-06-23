const EmailCategory = require("../models/EmailCategory");
const Email = require("../models/Email");

// Category: Create
exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const existing = await EmailCategory.findOne({ category });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const cat = new EmailCategory({ category: category });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error("Server error in createCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Category: Read All
exports.getAllCategories = async (req, res) => {
  try {
    const cats = await EmailCategory.find();
    res.json(cats);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Category: Delete
exports.deleteCategory = async (req, res) => {
  try {
    await EmailCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Email: Create
exports.createEmail = async (req, res) => {
  try {
    const { name, mail } = req.body;
    const category = req.params.id;

    const email = new Email({
      category,
      name,
      mail,
      sentBy: req.user.id,
    });

    await email.save();
    res.status(201).json(email);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Email: Get by Category
exports.getEmailsByCategory = async (req, res) => {
  try {
    const emails = await Email.find({ category: req.params.id });
    res.json(emails);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Email: Delete
exports.deleteEmail = async (req, res) => {
  try {
    await Email.findByIdAndDelete(req.params.emailId);
    res.json({ message: "Email deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
