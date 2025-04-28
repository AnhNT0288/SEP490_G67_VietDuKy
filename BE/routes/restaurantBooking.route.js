const express = require("express");
const router = express.Router();
const restaurantBookingController = require("../controllers/restaurantBooking.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get(
  "/booking/:booking_id",
  restaurantBookingController.getRestaurantBookingsByBookingId
);
router.post(
  "/create",
  // authenticateUser,
  restaurantBookingController.addRestaurantToBooking
);
router.delete(
  "/cancel/:id",
  authenticateUser,
  restaurantBookingController.cancelRestaurantBooking
);
router.get(
  "/:id",
  restaurantBookingController.getRestaurantBookingById
);
router.get(
  "/restaurant/:id",
  restaurantBookingController.getRestaurantBookingByRestaurantId
);
router.get(
  "/travel-tour/:travel_tour_id",
  restaurantBookingController.getRestaurantBookingByTravelTour
);


module.exports = router;
