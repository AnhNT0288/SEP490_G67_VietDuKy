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
  // authenticateUser,
  hotelBookingController.getHotelBookingsByBookingId
);
router.post(
  "/create",
  // authenticateUser,
  hotelBookingController.addHotelToBooking
);
router.delete(
  "/cancel/:id",
  // authenticateUser,
  hotelBookingController.cancelBookingHotelById
);
router.get("/travel-tour/:travel_tour_id", hotelBookingController.getHotelBookingByTravelTour);
module.exports = router;
