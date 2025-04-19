const express = require("express");
const router = express.Router();
const tourInfoController = require("../controllers/tour_info.controller");
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
  checkRoles("admin", "staff"),
  tourInfoController.createTourInfo
);

router.get(
  "/get/:tour_id",
  authenticateUser,
  checkRoles("admin", "staff"),
  tourInfoController.getTourInfo
);
module.exports = router;
