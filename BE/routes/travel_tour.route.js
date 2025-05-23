const express = require("express");
const router = express.Router();
const travelTourController = require("../controllers/travel_tour.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", travelTourController.getAllTravelTours);
router.get("/guide/:user_id", travelTourController.getListTravelTourForGuide);
router.get("/complete-auto", travelTourController.completeTravelTour);

router.get("/cancel/:id", travelTourController.cancelTravelTour);
// router.get("/:id", authenticateUser, travelTourController.getTravelTourById);
router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.createTravelTour
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.updateTravelTour
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.deleteTravelTour
);
router.get("/tour/:id", travelTourController.getTravelTourByTourId);

router.get(
  "/close/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.closeTravelTour
);
router.post(
  "/close/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.closeTourWhenFull
);


//Lấy danh sách travelTour đã đủ số lượng người
router.get(
  "/max-people/full",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  travelTourController.getFullTravelTours
);

router.get(
  "/by-staff/:user_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  travelTourController.getTravelToursByStaffWithLocation
);

router.get(
  "/by-staff-end-location/:user_id",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  travelTourController.getTravelToursByStaffEndLocationWithBooking
);
router.get("/remind-upcoming", travelTourController.remindUpcomingTravelTours);

router.get("/:id", travelTourController.getTravelTourById);


module.exports = router;
