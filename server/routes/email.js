const router = require("express").Router();
const mailCtrl = require("../controllers/mailController");
const { verifyToken } = require("../middleware/authMiddleware");

// Category Routes
router.get("/", mailCtrl.getAllCategories);
router.post("/add", verifyToken, mailCtrl.createCategory);
router.delete("/:id/remove", verifyToken, mailCtrl.deleteCategory);

// Email Routes
router.get("/:id/emails", mailCtrl.getEmailsByCategory);
router.post("/:id/emails/add", verifyToken, mailCtrl.createEmail);
router.delete(
  "/:id/emails/:emailId/remove",
  verifyToken,
  mailCtrl.deleteEmail
);

module.exports = router;
