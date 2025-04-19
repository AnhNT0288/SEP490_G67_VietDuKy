const express = require("express");
const router = express.Router();
const travelTourController = require("../controllers/travel_tour.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/", travelTourController.getAllTravelTours);
router.get("/guide", travelTourController.getListTravelTourForGuide);
// router.get("/:id", authenticateUser, travelTourController.getTravelTourById);
router.get("/:id", travelTourController.getTravelTourById);
router.post(
  "/create",
  authenticateUser,
  authenticateAdmin,
  travelTourController.createTravelTour
);
router.put(
  "/update/:id",
  authenticateUser,
  authenticateAdmin,
  travelTourController.updateTravelTour
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authenticateAdmin,
  travelTourController.deleteTravelTour
);
router.get(
  "/tour/:id",
  travelTourController.getTravelTourByTourId
);

router.post(
  "/close/:id",
  authenticateUser,
  authenticateAdmin,
  travelTourController.closeTourWhenFull
);

//Lấy danh sách travelTour đã đủ số lượng người
router.get(
  "/max-people/full",
  authenticateUser,
  authenticateAdmin,
  travelTourController.getFullTravelTours
);

module.exports = router;
