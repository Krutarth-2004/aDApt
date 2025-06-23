const express = require("express");
const router = express.Router();

const {
  getAllPlaces,
  createPlace,
  deletePlace,
  createLostMessage,
  createFoundMessage,
  getLostMessages,
  getFoundMessages,
  deleteLostMessage,
  deleteFoundMessage,
  getRepliesForMessage,
  createReply,
} = require("../controllers/lnfController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload")("aDApt");

// 🔹 PLACES
router.get("/", getAllPlaces);
router.post("/add", verifyToken, isAdmin, createPlace);
router.delete("/:place/remove", verifyToken, isAdmin, deletePlace);

// 🔹 LOST & FOUND MESSAGES
router.get("/:place/messages/lost", getLostMessages);
router.get("/:place/messages/found", getFoundMessages);

router.post(
  "/:place/messages/lost",
  verifyToken,
  upload.single("file"),
  createLostMessage
);

router.post(
  "/:place/messages/found",
  verifyToken,
  upload.single("file"),
  createFoundMessage
);

router.delete(
  "/:place/messages/lost/:messageId",
  verifyToken,
  deleteLostMessage
);

router.delete(
  "/:place/messages/found/:messageId",
  verifyToken,
  deleteFoundMessage
);

// 🔹 REPLIES
router.post("/:place/replies", verifyToken, getRepliesForMessage);

router.post("/:place/reply", verifyToken, upload.single("file"), createReply);

module.exports = router;