const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");
const {uploadLocation} = require("../utils/cloudinary");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateStaff,
    checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", locationController.getAllLocations);
router.get("/:id", locationController.getLocationById);
router.post(
    "/create",
    authenticateUser,
    checkRoles("admin", "staff"),
    uploadLocation.single("image"),
    locationController.createLocation
);
router.put(
    "/update/:id",
    authenticateUser,
    checkRoles("admin", "staff"),
    uploadLocation.single("image"),
    locationController.updateLocation
);
router.delete(
    "/delete/:id",
    authenticateUser,
    checkRoles("admin", "staff"),
    locationController.deleteLocation
);

module.exports = router;
