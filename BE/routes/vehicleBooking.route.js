const express = require("express");
const router = express.Router();
const vehicleBookingController = require("../controllers/vehicleBooking.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get(
  "/:booking_id",
  // authenticateUser,
  vehicleBookingController.getVehicleBookingsByBookingId
);
router.post(
  "/create",
  // authenticateUser,
  vehicleBookingController.addVehicleToBooking
);
router.delete(
  "/cancel/:id",
  // authenticateUser,
  vehicleBookingController.cancelVehicleBookingById
);
router.get(
  "/vehicle/:vehicle_id",
  // authenticateUser,
  vehicleBookingController.getVehicleBookingByVehicleId
);
router.get(
  "/travel-tour/:travel_tour_id",
  // authenticateUser,
  vehicleBookingController.getVehicleBookingByTravelTour
);


module.exports = router;
