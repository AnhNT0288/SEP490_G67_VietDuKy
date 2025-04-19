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
router.get("/guide", travelTourController.getListTravelTourForGuide);
// router.get("/:id", authenticateUser, travelTourController.getTravelTourById);
router.get("/:id", travelTourController.getTravelTourById);
router.post(
  "/create",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelTourController.createTravelTour
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelTourController.updateTravelTour
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelTourController.deleteTravelTour
);
router.get(
  "/tour/:id",
  travelTourController.getTravelTourByTourId
);

router.post(
  "/close/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelTourController.closeTourWhenFull
);

//Lấy danh sách travelTour đã đủ số lượng người
router.get(
  "/max-people/full",
  authenticateUser,
  checkRoles("admin", "staff"),
  travelTourController.getFullTravelTours
);

router.get(
  "/by-staff/:user_id",
  // authenticateUser,
  // authenticateStaff,
  // authenticateAdmin,
  travelTourController.getTravelToursByStaffWithGuideStatus
);

module.exports = router;
