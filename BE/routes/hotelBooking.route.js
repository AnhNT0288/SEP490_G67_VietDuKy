const express = require("express");
const router = express.Router();
const hotelBookingController = require("../controllers/hotelBooking.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get(
  "/:booking_id",
  authenticateUser,
  hotelBookingController.getHotelBookingsByBookingId
);
router.post(
  "/create",
  authenticateUser,
  hotelBookingController.addHotelToBooking
);
router.delete(
  "/cancel/:id",
  authenticateUser,
  hotelBookingController.cancelBookingHotelById
);

module.exports = router;
