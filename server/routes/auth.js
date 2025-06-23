const router = require("express").Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/check", verifyToken, authController.checkAuth);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/adminsignup", authController.adminSignup);
router.post("/adminlogin", authController.adminLogin);
router.put("/profile", verifyToken, authController.updateProfile);

module.exports = router;
