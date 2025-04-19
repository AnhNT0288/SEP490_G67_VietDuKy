const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateStaff,
    checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", serviceController.getAllServices);
router.get("/:id", authenticateUser, serviceController.getServiceById);
router.post("/create",
    authenticateUser,
    checkRoles("admin", "staff"),
    serviceController.createService);
router.delete(
    "/delete/:id",
    authenticateUser,
    checkRoles("admin", "staff"),
    serviceController.deleteService
);
router.put("/update/:id", authenticateUser, checkRoles("admin", "staff"), serviceController.updateService);

module.exports = router;
