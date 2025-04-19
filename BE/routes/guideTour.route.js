const express = require("express");
const router = express.Router();
const GuideTourController = require("../controllers/guideTour.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/:id", GuideTourController.getGuideTours);
router.post(
  "/create",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.addGuideToTour
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authenticateAdmin,
  GuideTourController.removeGuideFromTour
);
router.put(
  "/approve/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.approveGuideTour
);
router.put(
  "/reject/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.rejectGuideTour
);
router.get(
  "/user/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.getGuideTourByUserId
);
router.get(
  "/travel-tour/:travelTourId",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.getTravelTourDetailForGuide
);
//Gán hướng dẫn viên cho tour
router.post(
  "/assign-travel-guide",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.assignTravelGuideToTravelTour
);

//TravelGuide xác nhận hoặc từ chối GuideTour
router.post(
  "/confirm-guide-tour/:guide_tour_id",
  // authenticateUser,
  // authenticateStaff,
  GuideTourController.confirmGuideTour
);

module.exports = router;
