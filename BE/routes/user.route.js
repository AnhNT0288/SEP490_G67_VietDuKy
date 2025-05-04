const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { uploadAvatar } = require("../utils/cloudinary");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticateUser,
  checkRoles(["admin", "staff", "customer", "tour_guide"]),
  userController.getUserById
);
router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  uploadAvatar.single("avatar"),
  userController.addNewUser
);
router.put('/fcm-token',
  authenticateUser,
  checkRoles(["admin", "staff", "customer", "tour_guide",]),
  userController.updateFcmToken
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  uploadAvatar.single("avatar"),
  userController.updateUser
);
router.put(
  "/change-password/:id",
  authenticateUser,
  userController.changePassword
);
router.put(
  "/status/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.changeStatus
);
router.get(
  "/status-filter/:status",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.filterByStatus
);
router.post(
  "/assign-role",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.assignRole
);

router.get(
  "/role/:role_id",
  authenticateUser,
  checkRoles(["admin"]),
  userController.getUsersByRoleId
);

router.get(
  "/staff-profile/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.getStaffProfile
);

router.put(
  "/staff-profile/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.updateStaffProfile
);

router.post(
  "/assign-locations/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.assignLocationsToStaff
);

router.get(
  "/travel-tours/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.getTravelToursByStaffLocations
);

router.get(
  "/staff/locations/:user_id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.getLocationsByStaff
);

router.delete(
  "/delete-location-from-staff",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  userController.deleteLocationFromStaff
);

router.post("/contact-advice", authenticateUser, userController.contactAdvice);

module.exports = router;
