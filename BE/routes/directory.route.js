const express = require("express");
const router = express.Router();
const DirectoryController = require("../controllers/directory.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", DirectoryController.getAllDirectories);
router.post("/create",authenticateUser, checkRoles(["admin", "staff"]),  DirectoryController.createDirectory);
router.put(
  "/update/:id",
    authenticateUser,
  checkRoles(["admin", "staff"]),
    DirectoryController.updateDirectory
);
router.delete(
  "/delete/:id",
    authenticateUser,
  checkRoles(["admin", "staff"]),
    DirectoryController.deleteDirectory
);

module.exports = router;
