const express = require("express");
const router = express.Router();
const restaurantBookingController = require("../controllers/restaurantBooking.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get(
  "/:booking_id",
  restaurantBookingController.getRestaurantBookingsByBookingId
);
router.post(
  "/create",
  authenticateUser,
  restaurantBookingController.addRestaurantToBooking
);
router.delete(
  "/cancel/:id",
  authenticateUser,
  restaurantBookingController.cancelRestaurantBooking
);

module.exports = router;
