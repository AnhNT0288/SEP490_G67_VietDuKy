const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

router.get("/", locationController.getAllLocations);
router.get("/:id", locationController.getLocationById);
router.post("/create", locationController.createLocation);
router.put("/update/:id", locationController.updateLocation);
router.delete("/delete/:id", locationController.deleteLocation);

module.exports = router;
