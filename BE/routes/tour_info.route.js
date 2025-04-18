const express = require("express");
const router = express.Router();
const tourInfoController = require("../controllers/tour_info.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");
// Route để tạo tour service mới
router.post(
  "/create",
  // authenticateUser,
  // authenticateAdmin,
  tourInfoController.createTourInfo
);

router.get(
  "/get/:tour_id",
  // authenticateUser,
  // authenticateAdmin,
  tourInfoController.getTourInfo
);
module.exports = router;
