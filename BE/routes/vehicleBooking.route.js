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
  authenticateUser,
  vehicleBookingController.getVehicleBookingsByBookingId
);
router.post(
  "/create",
  authenticateUser,
  vehicleBookingController.addVehicleToBooking
);
router.delete(
  "/cancel/:id",
  authenticateUser,
  vehicleBookingController.cancelVehicleBookingById
);

module.exports = router;
