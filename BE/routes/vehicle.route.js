const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getVehicleById);
router.post("/", vehicleController.createVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);
router.get("/location/:location_id", vehicleController.getVehicleByLocation);
router.get("/travel-tour/:travel_tour_id", vehicleController.getVehicleByTravelTour);


module.exports = router;
