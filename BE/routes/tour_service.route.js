const express = require("express");
const router = express.Router();
const tourServiceController = require("../controllers/tour_service.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");
// Route để tạo tour service mới
router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  tourServiceController.createTourService
);

module.exports = router;
