const express = require("express");
const router = express.Router();
const travelGuideController = require("../controllers/travelGuide.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", travelGuideController.getAllTravelGuides);
router.get(
  "/feedback/:travelGuideId",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.getFeedbackByTravelGuide
);
router.get(
  "/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff", "tour_guide"]),
  travelGuideController.getTravelGuidesByUser
);
router.get(
  "/user/:id",
  authenticateUser,
  checkRoles(["admin", "staff", "tour_guide"]),
  travelGuideController.getTravelGuidesByUserID
);
router.post(
  "/create",

  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.createTravelGuide
);
router.put(
  "/update/:userId",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.updateTravelGuide
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.deleteTravelGuide
);

router.get(
  "/location/:locationId",

  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.getTravelGuidesByLocation
);

router.get(
  "/locations-travel-guide/:travel_guide_id",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  travelGuideController.getLocationsByTravelGuide
);

router.post(
  "/add-locations-travel-guide",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  travelGuideController.addLocationsToTravelGuide
);

router.delete(
  "/delete-location",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  travelGuideController.deleteLocationFromTravelGuide
);

router.post(
  "/assign",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelGuideController.assignTravelGuideToStaff
);

router.delete(
  "/unassign",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  travelGuideController.unassignTravelGuidesFromStaff
);

router.get(
  "/staff/:staff_id",
  // authenticateUser,
  // checkRoles(["staff", "admin"]),
  travelGuideController.getTravelGuidesByStaff
);

router.post(
  // authenticateUser,
  // checkRoles(["staff", "admin"]),
  "/add-travel-guide-to-group",
  travelGuideController.addTravelGuideToStaffGroup
);

router.put(
  "/update-personal-info/:id",
  authenticateUser,
  checkRoles(["staff", "admin", "tour_guide"]),
  travelGuideController.updatePersonalInfo
);

router.get(
  "/filter/travel-guides",
  authenticateUser,
  checkRoles(["staff", "admin"]),
  travelGuideController.getAllTravelGuides
);

router.put(
  "/update-current-location/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  travelGuideController.updateCurrentLocation
);

router.get(
  "/current-location/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  travelGuideController.getCurrentLocation
);

module.exports = router;
