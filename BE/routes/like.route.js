const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/like.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.post("/toggle", authenticateUser, LikeController.toggleLike);

router.get("/isLiked", authenticateUser, LikeController.isLiked);

router.get("/count", LikeController.countLikes);
module.exports = router;
