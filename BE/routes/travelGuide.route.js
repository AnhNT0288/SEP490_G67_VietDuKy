const express = require("express");
const router = express.Router();
const travelGuideController = require("../controllers/travelGuide.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff, checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", travelGuideController.getAllTravelGuides);
router.get(
  "/feedback/:travelGuideId",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.getFeedbackByTravelGuide
);
router.get(
  "/:user_id",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.getTravelGuidesByUser
);
router.post(
  "/create",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.createTravelGuide
);
router.put(
  "/update/:userId",
    authenticateUser,
    checkRoles("admin", "staff"),
  travelGuideController.updateTravelGuide
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.deleteTravelGuide
);
router.get(
  "/location/:locationId",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.getTravelGuidesByLocation
);

router.post(
  "/assign",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelGuideController.assignTravelGuideToStaff
);

router.get(
  "/staff/:staff_id",
    authenticateUser,
    checkRoles(["staff", "admin"]),
  travelGuideController.getTravelGuidesByStaff
);
module.exports = router;
