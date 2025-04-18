const express = require("express");
const router = express.Router();
const travelGuideController = require("../controllers/travelGuide.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/", travelGuideController.getAllTravelGuides);
router.get(
  "/feedback/:travelGuideId",
  authenticateStaff,
  authenticateAdmin,
  travelGuideController.getFeedbackByTravelGuide
);
router.get(
  "/:user_id",
  authenticateAdmin,
  travelGuideController.getTravelGuidesByUser
);
router.post(
  "/create",
  // authenticateAdmin,
  travelGuideController.createTravelGuide
);
router.put(
  "/update/:userId",
    authenticateUser,
    authenticateAdmin,
  travelGuideController.updateTravelGuide
);
router.delete(
  "/delete/:id",
  authenticateAdmin,
  travelGuideController.deleteTravelGuide
);
router.get(
  "/location/:locationId",
  // authenticateAdmin,
  travelGuideController.getTravelGuidesByLocation
);

router.post(
  "/assign",
  // authenticateAdmin,
  travelGuideController.assignTravelGuideToStaff
);

router.get(
  "/staff/:staff_id",
  // authenticateAdmin,
  travelGuideController.getTravelGuidesByStaff
);
module.exports = router;
