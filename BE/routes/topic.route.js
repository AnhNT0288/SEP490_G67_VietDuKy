const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic.controller");
const {
  authenticateUser,
  authenticateAdmin,
  checkRoles,
} = require("../middleware/authMiddleware");

// Tạo topic mới
router.post(
  "/create",
  authenticateUser,
  checkRoles("admin", "staff"),
  topicController.createTopic
);

// Lấy danh sách tất cả topic
router.get("/", topicController.getAllTopics);

// Lấy thông tin topic theo ID
router.get("/:id", topicController.getTopicById);

// Cập nhật thông tin topic
router.put(
  "/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  topicController.updateTopic
);

// Xóa topic
router.delete(
  "/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  topicController.deleteTopic
);

router.post("/remove-tour", topicController.removeToursFromTopic);

router.post("/add-tour", topicController.addTourToTopic);

module.exports = router;
