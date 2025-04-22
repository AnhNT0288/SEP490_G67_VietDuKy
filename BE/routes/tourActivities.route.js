const express = require("express");
const router = express.Router();
const tourActivitiesController = require("../controllers/tourActivities.controller");
const {uploadTourActivities} = require("../utils/cloudinary");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateStaff,
    checkRoles,
} = require("../middleware/authMiddleware");

router.post(
    "/create",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    uploadTourActivities.single("image"),
    tourActivitiesController.createTourActivities
);
router.put(
    "/update/:id",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    uploadTourActivities.single("image"),
    tourActivitiesController.updateTourActivities
);  
router.delete(
    "/delete/:id",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    tourActivitiesController.deleteTourActivities
);


module.exports = router;
