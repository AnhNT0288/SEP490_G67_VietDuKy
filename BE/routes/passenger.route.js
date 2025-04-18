const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passenger.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateUser,
  authenticateStaff,
  passengerController.createPassenger
);

router.get(
  "/:booking_id",
  authenticateUser,
  authenticateStaff,
  authenticateAdmin,
  passengerController.getPassengerByBookingId
);

router.delete("/:id", authenticateAdmin, passengerController.deletePassenger);

router.put(
  "/:id",
  authenticateUser,
  authenticateStaff,
  passengerController.updatePassenger
);

router.get(
  "/travel-guide/:travel_guide_id",
  authenticateUser,
  authenticateStaff,
  authenticateAdmin,
  passengerController.getPassengersByTravelGuideId
);

router.get(
  "/travel-tour/:travel_tour_id",
  authenticateUser,
  authenticateStaff,
  authenticateAdmin,
  passengerController.getPassengersByTravelTourId
);

//Gán nhiều passenger cho travel guide
router.post(
  "/assign/:travel_guide_id",
  authenticateUser,
  authenticateStaff,
  authenticateAdmin,
  passengerController.assignPassengersToTravelGuide
);

module.exports = router;
