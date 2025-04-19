const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticateUser,
  notificationController.getNotificationsByUser
);
router.post(
  "/create",
  authenticateUser,
  checkRoles("admin", "staff"),
  notificationController.createNotificationForBooking
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  notificationController.deleteNotification
);

module.exports = router;
