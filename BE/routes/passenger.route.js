const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passenger.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.createPassenger
);

router.get(
  "/:booking_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.getPassengerByBookingId
);

router.delete("/:id", authenticateUser, checkRoles(["admin", "staff"]), passengerController.deletePassenger);

router.put(
  "/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.updatePassenger
);

router.get(
  "/travel-guide/:travel_guide_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.getPassengersByTravelGuideId
);

router.get(
  "/travel-tour/:travel_tour_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.getPassengersByTravelTourId
);

//Gán nhiều passenger cho travel guide
router.post(
  "/assign/:travel_guide_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  passengerController.assignPassengersToTravelGuide
);

module.exports = router;
