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
  checkRoles("admin", "staff"),
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  userController.getUserById
);
router.post(
  "/create",
  authenticateUser,
  checkRoles("admin", "staff"),
  uploadAvatar.single("avatar"),
  userController.addNewUser
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
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
  checkRoles("admin", "staff"),
  userController.changeStatus
);
router.get(
  "/status-filter/:status",
  authenticateUser,
  checkRoles("admin", "staff"),
  userController.filterByStatus
);
router.post(
  "/assign-role",
  authenticateUser,
  checkRoles("admin", "staff"),
  userController.assignRole
);

router.get(
  "/role/:role_id",
  // authenticateUser,
  // authenticateStaff,
  // authenticateAdmin,
  userController.getUsersByRoleId
);
module.exports = router;
