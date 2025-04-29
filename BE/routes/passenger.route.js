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
  checkRoles(["admin", "staff", "customer"]),
  passengerController.createPassenger
);

router.get(
  "/:booking_id",
  authenticateUser,
  checkRoles(["admin", "staff", "customer"]),
  passengerController.getPassengerByBookingId
);

router.delete(
  "/:id",
  authenticateUser,
  checkRoles(["admin", "staff", "customer"]),
  passengerController.deletePassenger
);

router.put(
  "/:id",
  authenticateUser,
  checkRoles(["admin", "staff", "customer"]),
  passengerController.updatePassenger
);

// router.get(
//   "/travel-guide/:travel_guide_id",
//   // authenticateUser,
//   // checkRoles(["admin", "staff"]),
//   passengerController.getPassengersByTravelGuideId
// );

router.get(
  "/travel-tour/:travel_tour_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.getPassengersByTravelTourId
);

//Gán nhiều passenger cho travel guide
router.post(
  "/assign/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.assignPassengersToTravelGuide
);

//Lấy danh sách hành khách theo travel_guide_id
router.get(
  "/booking/travel-guide/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.getPassengersByTravelGuideIdBooking
);

// Thêm hành khách mới cho TravelGuide
router.post(
  "/add-passengers/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.addPassengersToTravelGuide
);

// Xóa hành khách khỏi TravelGuide
router.post(
  "/remove-passengers/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.removePassengersFromTravelGuide
);
router.get(
  "/travel-guide/:travel_guide_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.getPassengerByTravelGuideId2
);
router.delete(
  "/remove-passenger-group/:passenger_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.removePassengerGroup
);
router.get(
  "/service-assigned/:travel_tour_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  passengerController.getPassengerServiceAssigned
);
module.exports = router;
